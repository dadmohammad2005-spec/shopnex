from decimal import Decimal
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_sku',
            'variant_name', 'unit_price', 'quantity', 'total_price',
            'image_url'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email',
            'customer_phone', 'shipping_address', 'city', 'state',
            'postal_code', 'country', 'order_notes', 'subtotal',
            'shipping_cost', 'discount_amount', 'coupon_code',
            'total_amount', 'payment_method', 'payment_status',
            'order_status', 'created_at', 'updated_at', 'items', 'item_count'
        ]
        read_only_fields = [
            'id', 'order_number', 'subtotal', 'shipping_cost',
            'discount_amount', 'total_amount', 'created_at', 'updated_at'
        ]


class CheckoutRequestSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=30)
    shipping_address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='United States')
    order_notes = serializers.CharField(required=False, allow_blank=True, default='')
    payment_method = serializers.ChoiceField(choices=['cod', 'card_placeholder'], default='cod')
    coupon_code = serializers.CharField(required=False, allow_blank=True, default='')
