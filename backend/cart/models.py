from decimal import Decimal
from django.conf import settings
from django.db import models
from products.models import Product, ProductVariant


class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='carts'
    )
    session_key = models.CharField(max_length=40, blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Guest Cart ({self.session_key})"

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        total = Decimal('0.00')
        for item in self.items.select_related('product', 'variant'):
            total += item.total_price
        return total


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, null=True, blank=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('cart', 'product', 'variant')

    def __str__(self):
        return f"{self.quantity}x {self.product.name} ({self.variant.name if self.variant else 'Default'})"

    @property
    def unit_price(self):
        base = self.product.effective_price
        if self.variant and self.variant.additional_price:
            base += self.variant.additional_price
        return base

    @property
    def total_price(self):
        return self.unit_price * self.quantity
