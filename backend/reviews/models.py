from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Avg
from products.models import Product


class ProductReview(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5
    )
    title = models.CharField(max_length=150, blank=True, default='')
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('product', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating} stars)"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_product_rating()

    def delete(self, *args, **kwargs):
        product = self.product
        super().delete(*args, **kwargs)
        approved_reviews = product.reviews.filter(is_approved=True)
        count = approved_reviews.count()
        avg = approved_reviews.aggregate(Avg('rating'))['rating__avg'] or 0.00
        product.review_count = count
        product.rating = round(avg, 2)
        product.save(update_fields=['review_count', 'rating'])

    def update_product_rating(self):
        approved_reviews = self.product.reviews.filter(is_approved=True)
        count = approved_reviews.count()
        avg = approved_reviews.aggregate(Avg('rating'))['rating__avg'] or 0.00
        self.product.review_count = count
        self.product.rating = round(avg, 2)
        self.product.save(update_fields=['review_count', 'rating'])
