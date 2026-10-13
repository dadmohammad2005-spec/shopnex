from django.conf import settings
from django.db import models
from products.models import Product


class Wishlist(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='wishlist', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist of {self.user.username}"


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-added_at']
        unique_together = ('wishlist', 'product')

    def __str__(self):
        return f"{self.product.name} in {self.wishlist.user.username}'s wishlist"
