from decimal import Decimal
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.views import get_user_cart
from coupons.models import Coupon
from products.models import Product, ProductVariant
from .models import Order, OrderItem
from .serializers import OrderSerializer, CheckoutRequestSerializer


class CheckoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CheckoutRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = get_user_cart(request)
        cart_items = cart.items.select_related('product', 'variant').all()
        if not cart_items.exists():
            return Response({"detail": "Your shopping cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        coupon_code = data.get('coupon_code', '').strip().upper()

        try:
            with transaction.atomic():
                # 1. Validate stock for all items
                for item in cart_items:
                    product = Product.objects.select_for_update().get(id=item.product.id)
                    if not product.is_active:
                        raise ValueError(f"Product '{product.name}' is no longer active.")

                    if item.variant:
                        variant = ProductVariant.objects.select_for_update().get(id=item.variant.id)
                        if variant.stock < item.quantity:
                            raise ValueError(f"Only {variant.stock} units available for '{product.name} ({variant.name})'.")
                    else:
                        if product.stock < item.quantity:
                            raise ValueError(f"Only {product.stock} units available for '{product.name}'.")

                # 2. Calculate subtotal strictly on backend
                subtotal = Decimal('0.00')
                order_item_snapshots = []
                for item in cart_items:
                    unit_price = item.product.effective_price
                    if item.variant and item.variant.additional_price:
                        unit_price += item.variant.additional_price

                    item_total = unit_price * item.quantity
                    subtotal += item_total

                    image_url = item.product.display_image

                    order_item_snapshots.append({
                        'product': item.product,
                        'product_name': item.product.name,
                        'product_sku': item.variant.sku if (item.variant and item.variant.sku) else item.product.sku,
                        'variant_name': item.variant.name if item.variant else '',
                        'unit_price': unit_price,
                        'quantity': item.quantity,
                        'total_price': item_total,
                        'image_url': image_url,
                        'variant_obj': item.variant
                    })

                # 3. Calculate coupon discount
                discount_amount = Decimal('0.00')
                applied_coupon_code = ''
                if coupon_code:
                    coupon = Coupon.objects.filter(code__iexact=coupon_code).first()
                    if coupon:
                        valid, _ = coupon.is_valid(subtotal)
                        if valid:
                            discount_amount = coupon.calculate_discount(subtotal)
                            applied_coupon_code = coupon.code
                            coupon.current_uses += 1
                            coupon.save(update_fields=['current_uses'])

                # 4. Calculate shipping cost (free over $100, else $10)
                shipping_cost = Decimal('0.00') if subtotal >= Decimal('100.00') else Decimal('10.00')

                # 5. Grand total
                total_amount = max(Decimal('0.00'), subtotal - discount_amount + shipping_cost)

                # Payment status
                payment_method = data.get('payment_method', 'cod')
                payment_status = 'pending'
                order_status = 'confirmed' if payment_method == 'cod' else 'pending'

                # 6. Create Order
                order = Order.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    customer_name=data['customer_name'],
                    customer_email=data['customer_email'],
                    customer_phone=data['customer_phone'],
                    shipping_address=data['shipping_address'],
                    city=data['city'],
                    state=data['state'],
                    postal_code=data['postal_code'],
                    country=data.get('country', 'United States'),
                    order_notes=data.get('order_notes', ''),
                    subtotal=subtotal,
                    shipping_cost=shipping_cost,
                    discount_amount=discount_amount,
                    coupon_code=applied_coupon_code,
                    total_amount=total_amount,
                    payment_method=payment_method,
                    payment_status=payment_status,
                    order_status=order_status,
                )

                # 7. Create OrderItems & deduct stock
                for snap in order_item_snapshots:
                    OrderItem.objects.create(
                        order=order,
                        product=snap['product'],
                        product_name=snap['product_name'],
                        product_sku=snap['product_sku'],
                        variant_name=snap['variant_name'],
                        unit_price=snap['unit_price'],
                        quantity=snap['quantity'],
                        total_price=snap['total_price'],
                        image_url=snap['image_url'],
                    )
                    # Deduct stock
                    snap['product'].stock = max(0, snap['product'].stock - snap['quantity'])
                    snap['product'].save(update_fields=['stock'])
                    if snap['variant_obj']:
                        snap['variant_obj'].stock = max(0, snap['variant_obj'].stock - snap['quantity'])
                        snap['variant_obj'].save(update_fields=['stock'])

                # 8. Clear Cart
                cart.items.all().delete()

        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"An error occurred while creating order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, order_identifier):
        order = None
        if str(order_identifier).isdigit():
            order = Order.objects.filter(id=order_identifier).prefetch_related('items').first()
        if not order:
            order = Order.objects.filter(order_number=order_identifier).prefetch_related('items').first()

        if not order:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        # Security check: if order belongs to a user, only that user or staff can view it
        if order.user and (not request.user.is_authenticated or (request.user != order.user and not request.user.is_staff)):
            return Response({"detail": "You do not have permission to view this order."}, status=status.HTTP_403_FORBIDDEN)

        serializer = OrderSerializer(order)
        return Response(serializer.data)


class OrderCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = Order.objects.filter(id=order_id, user=request.user).first()
        if not order:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.order_status not in ['pending', 'confirmed']:
            return Response({
                "detail": f"Cannot cancel order in '{order.get_order_status_display()}' status."
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            order.order_status = 'cancelled'
            order.save(update_fields=['order_status'])

            # Restore stocks
            for item in order.items.all():
                if item.product:
                    item.product.stock += item.quantity
                    item.product.save(update_fields=['stock'])

        return Response({
            "message": "Order cancelled successfully.",
            "order": OrderSerializer(order).data
        })
