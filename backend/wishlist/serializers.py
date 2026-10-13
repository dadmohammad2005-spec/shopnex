from rest_framework import serializers
from products.serializers import ProductListSerializer
from .models import Wishlist, WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)
    count = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'count']

    def get_count(self, obj):
        return obj.items.count()
