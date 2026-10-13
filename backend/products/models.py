from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=150, unique=True, blank=True)
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def display_image(self):
        if self.image:
            return self.image.url
        return self.image_url


class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    sku = models.CharField(max_length=50, unique=True)
    short_description = models.CharField(max_length=300, blank=True, default='')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, default='')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    review_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['price']),
            models.Index(fields=['is_active', 'is_featured']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            candidate = base_slug
            idx = 1
            while Product.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base_slug}-{idx}"
                idx += 1
            self.slug = candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def effective_price(self):
        if self.sale_price is not None and self.sale_price > 0 and self.sale_price < self.price:
            return self.sale_price
        return self.price

    @property
    def has_discount(self):
        return self.sale_price is not None and 0 < self.sale_price < self.price

    @property
    def discount_percent(self):
        if self.has_discount and self.price > 0:
            diff = self.price - self.sale_price
            return int(round((diff / self.price) * 100))
        return 0

    @property
    def is_in_stock(self):
        return self.stock > 0

    @property
    def display_image(self):
        if self.image:
            return self.image.url
        return self.image_url


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, default='')
    alt_text = models.CharField(max_length=200, blank=True, default='')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_primary', 'id']

    def __str__(self):
        return f"{self.product.name} Image ({self.id})"

    @property
    def display_url(self):
        if self.image:
            return self.image.url
        return self.image_url


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    variant_type = models.CharField(max_length=50, default='size')  # 'size', 'color', 'edition'
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, blank=True, default='')
    additional_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=10)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.product.name} - {self.name} ({self.variant_type})"
