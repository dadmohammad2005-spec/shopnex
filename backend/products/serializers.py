from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.ReadOnlyField(source='display_url')

    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'alt_text', 'is_primary']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'variant_type', 'name', 'sku', 'additional_price', 'stock']


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.ReadOnlyField(source='display_image')
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    image = serializers.ReadOnlyField(source='display_image')
    effective_price = serializers.ReadOnlyField()
    has_discount = serializers.ReadOnlyField()
    discount_percent = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description',
            'price', 'sale_price', 'effective_price', 'has_discount',
            'discount_percent', 'stock', 'is_in_stock',
            'is_featured', 'is_new_arrival', 'is_bestseller',
            'image', 'rating', 'review_count', 'category', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    image = serializers.ReadOnlyField(source='display_image')
    effective_price = serializers.ReadOnlyField()
    has_discount = serializers.ReadOnlyField()
    discount_percent = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description', 'description',
            'price', 'sale_price', 'effective_price', 'has_discount',
            'discount_percent', 'stock', 'is_in_stock',
            'is_featured', 'is_new_arrival', 'is_bestseller',
            'image', 'images', 'variants', 'rating', 'review_count',
            'category', 'created_at', 'updated_at'
        ]
