from django.contrib import admin
from .models import Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'min_purchase_amount', 'current_uses', 'max_uses', 'is_active', 'valid_to')
    list_filter = ('discount_type', 'is_active')
    search_fields = ('code',)
