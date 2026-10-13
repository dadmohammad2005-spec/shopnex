from decimal import Decimal
from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    DISCOUNT_TYPES = (
        ('percent', 'Percentage Discount'),
        ('fixed', 'Fixed Amount Discount'),
    )

    code = models.CharField(max_length=30, unique=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES, default='percent')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_purchase_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valid_from = models.DateTimeField(null=True, blank=True)
    valid_to = models.DateTimeField(null=True, blank=True)
    max_uses = models.PositiveIntegerField(default=1000)
    current_uses = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} ({self.discount_value}{'%' if self.discount_type == 'percent' else '$'})"

    def is_valid(self, subtotal=Decimal('0.00')):
        now = timezone.now()
        if not self.is_active:
            return False, "This coupon is no longer active."
        if self.valid_from and now < self.valid_from:
            return False, "This coupon is not valid yet."
        if self.valid_to and now > self.valid_to:
            return False, "This coupon has expired."
        if self.current_uses >= self.max_uses:
            return False, "This coupon has reached its maximum usage limit."
        if subtotal < self.min_purchase_amount:
            return False, f"Minimum purchase amount of ${self.min_purchase_amount:.2f} required for this coupon."
        return True, ""

    def calculate_discount(self, subtotal):
        valid, msg = self.is_valid(subtotal)
        if not valid:
            return Decimal('0.00')

        if self.discount_type == 'percent':
            discount = (subtotal * self.discount_value) / Decimal('100.00')
            if self.max_discount_amount and discount > self.max_discount_amount:
                discount = self.max_discount_amount
        else:
            discount = min(self.discount_value, subtotal)

        return round(discount, 2)
