from django.contrib import admin
from .models import SiteSetting


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'site_tagline', 'contact_email', 'contact_phone', 'updated_at')
    fieldsets = (
        ('Brand & Identity', {
            'fields': ('site_name', 'site_tagline', 'site_description')
        }),
        ('Announcement & Header Banner', {
            'fields': ('announcement_text',)
        }),
        ('Contact Information & Location', {
            'fields': ('contact_email', 'contact_phone', 'address')
        }),
        ('Commerce & Shipping', {
            'fields': ('currency_symbol', 'currency_code', 'free_shipping_threshold')
        }),
        ('Footer & Social Links', {
            'fields': ('footer_copyright', 'facebook_url', 'instagram_url', 'twitter_url')
        }),
    )

    def has_add_permission(self, request):
        # Disallow creating more than 1 singleton settings instance
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        # Prevent accidental deletion of site configuration
        return False
