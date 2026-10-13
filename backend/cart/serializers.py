from rest_framework import serializers
from products.serializers import ProductListSerializer, ProductVariantSerializer
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)
    unit_price = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    stock_available = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'variant', 'quantity',
            'unit_price', 'total_price', 'stock_available'
        ]

    def get_stock_available(self, obj):
        if obj.variant:
            return obj.variant.stock
        return obj.product.stock


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'subtotal', 'total_items']
