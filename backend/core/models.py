from django.db import models
from django.core.cache import cache


class SiteSetting(models.Model):
    site_name = models.CharField(
        max_length=100,
        default='shall_shoop',
        help_text='Public name of the store / platform'
    )
    site_tagline = models.CharField(
        max_length=255,
        default='Premium Modern E-Commerce',
        help_text='Short slogan or motto'
    )
    site_description = models.TextField(
        default='shall_shoop curates premium international consumer electronics, designer apparel, artisan living goods, and active essentials for contemporary living.',
        help_text='Detailed description of the store for footer and about sections'
    )
    contact_email = models.EmailField(
        default='dadmohammad2005@gmail.com',
        help_text='Primary customer support & inquiries email'
    )
    contact_phone = models.CharField(
        max_length=50,
        default='+92 300 1234567',
        help_text='Contact phone number'
    )
    address = models.CharField(
        max_length=255,
        default='Quetta, Balochistan, Pakistan',
        help_text='Store operational address or headquarters location'
    )
    announcement_text = models.CharField(
        max_length=255,
        default='Complimentary Worldwide Shipping over $100 • Use code WELCOME10 for 10% off',
        help_text='Banner announcement shown in top navbar'
    )
    currency_symbol = models.CharField(
        max_length=10,
        default='$',
        help_text='Currency symbol displayed next to prices'
    )
    currency_code = models.CharField(
        max_length=10,
        default='USD',
        help_text='ISO currency code (e.g. USD, EUR, PKR)'
    )
    free_shipping_threshold = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=100.00,
        help_text='Subtotal required to qualify for complimentary free shipping'
    )
    footer_copyright = models.CharField(
        max_length=255,
        default='shall_shoop International Inc. All rights reserved.',
        help_text='Copyright statement displayed in footer'
    )
    facebook_url = models.URLField(blank=True, default='')
    instagram_url = models.URLField(blank=True, default='')
    twitter_url = models.URLField(blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Setting'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return f"{self.site_name} Configuration"

    def save(self, *args, **kwargs):
        # Enforce singleton pattern: primary key is always 1
        self.pk = 1
        super().save(*args, **kwargs)
        cache.delete('site_settings_cache')

    @classmethod
    def get_settings(cls):
        cached = cache.get('site_settings_cache')
        if cached:
            return cached
        try:
            settings, _ = cls.objects.get_or_create(
                pk=1,
                defaults={
                    'site_name': 'shall_shoop',
                    'site_tagline': 'Premium Modern E-Commerce',
                    'site_description': 'shall_shoop curates premium international consumer electronics, designer apparel, artisan living goods, and active essentials for contemporary living.',
                    'contact_email': 'dadmohammad2005@gmail.com',
                    'contact_phone': '+92 300 1234567',
                    'address': 'Quetta, Balochistan, Pakistan',
                    'announcement_text': 'Complimentary Worldwide Shipping over $100 • Use code WELCOME10 for 10% off',
                    'currency_symbol': '$',
                    'currency_code': 'USD',
                    'free_shipping_threshold': 100.00,
                    'footer_copyright': 'shall_shoop International Inc. All rights reserved.',
                }
            )
            cache.set('site_settings_cache', settings, 300)
            return settings
        except Exception:
            # Fallback if DB table has not migrated yet
            return cls(
                pk=1,
                site_name='shall_shoop',
                site_tagline='Premium Modern E-Commerce',
                site_description='shall_shoop curates premium international consumer electronics, designer apparel, artisan living goods, and active essentials for contemporary living.',
                contact_email='dadmohammad2005@gmail.com',
                contact_phone='+92 300 1234567',
                address='Quetta, Balochistan, Pakistan',
                announcement_text='Complimentary Worldwide Shipping over $100 • Use code WELCOME10 for 10% off',
                currency_symbol='$',
                currency_code='USD',
                free_shipping_threshold=100.00,
                footer_copyright='shall_shoop International Inc. All rights reserved.',
            )
