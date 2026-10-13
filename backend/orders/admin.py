from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'product_sku', 'variant_name', 'unit_price', 'quantity', 'total_price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number', 'customer_name', 'customer_email',
        'total_amount', 'payment_method', 'payment_status',
        'order_status', 'created_at'
    )
    list_filter = ('order_status', 'payment_status', 'payment_method', 'created_at')
    search_fields = ('order_number', 'customer_name', 'customer_email', 'customer_phone')
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'subtotal', 'shipping_cost', 'discount_amount', 'total_amount')
    inlines = [OrderItemInline]
    ordering = ('-created_at',)
