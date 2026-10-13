from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVariant


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'sku', 'category', 'price', 'sale_price',
        'stock', 'is_active', 'is_featured', 'is_new_arrival', 'is_bestseller', 'rating'
    )
    list_filter = ('is_active', 'is_featured', 'is_new_arrival', 'is_bestseller', 'category')
    search_fields = ('name', 'sku', 'description', 'short_description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVariantInline]
    ordering = ('-created_at',)
