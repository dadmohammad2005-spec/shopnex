from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from products.models import Product, ProductVariant
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


def get_user_cart(request):
    if not request.session.session_key:
        request.session.create()
    session_key = request.session.session_key

    if request.user.is_authenticated:
        # Check if there was an anonymous session cart to merge
        session_cart = Cart.objects.filter(session_key=session_key, user__isnull=True).first()
        user_cart, _ = Cart.objects.get_or_create(user=request.user)

        if session_cart and session_cart != user_cart:
            for item in session_cart.items.all():
                existing, created = CartItem.objects.get_or_create(
                    cart=user_cart,
                    product=item.product,
                    variant=item.variant,
                    defaults={'quantity': item.quantity}
                )
                if not created:
                    existing.quantity += item.quantity
                    existing.save()
            session_cart.delete()

        return user_cart
    else:
        cart, _ = Cart.objects.get_or_create(session_key=session_key, user__isnull=True)
        return cart


class CartView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        cart = get_user_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemAddView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        cart = get_user_cart(request)
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            return Response({"detail": "Quantity must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            return Response({"detail": "Product not found or inactive."}, status=status.HTTP_404_NOT_FOUND)

        variant = None
        available_stock = product.stock
        if variant_id:
            variant = ProductVariant.objects.filter(id=variant_id, product=product).first()
            if not variant:
                return Response({"detail": "Selected variant does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            available_stock = variant.stock

        if available_stock <= 0:
            return Response({"detail": "This item is currently out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={'quantity': quantity}
        )

        if not created:
            new_qty = item.quantity + quantity
            if new_qty > available_stock:
                return Response({
                    "detail": f"Cannot add {quantity} more. Only {available_stock} in stock (you already have {item.quantity} in cart)."
                }, status=status.HTTP_400_BAD_REQUEST)
            item.quantity = new_qty
            item.save()
        else:
            if quantity > available_stock:
                item.quantity = available_stock
                item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CartItemUpdateView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, item_id):
        cart = get_user_cart(request)
        item = CartItem.objects.filter(id=item_id, cart=cart).first()
        if not item:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            item.delete()
            return Response(CartSerializer(cart).data)

        max_stock = item.variant.stock if item.variant else item.product.stock
        if quantity > max_stock:
            return Response({
                "detail": f"Only {max_stock} available in stock."
            }, status=status.HTTP_400_BAD_REQUEST)

        item.quantity = quantity
        item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_user_cart(request)
        item = CartItem.objects.filter(id=item_id, cart=cart).first()
        if not item:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response(CartSerializer(cart).data)


class CartClearView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        cart = get_user_cart(request)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)
