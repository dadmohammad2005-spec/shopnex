import re
from rest_framework import serializers
from .models import SiteSetting


def split_brand_name(name):
    """
    Split brand name into two parts for two-tone UI rendering.
    Examples:
      - 'shall_shoop' -> ('shall', '_shoop')
      - 'Shall Shoop' -> ('Shall', 'Shoop')
      - 'ShallShoop'  -> ('Shall', 'Shoop')
      - 'ShopNex'     -> ('Shop', 'Nex')
    """
    name = (name or '').strip()
    if not name:
        return {'first': 'shall', 'second': '_shoop'}

    # If there is an underscore, e.g. shall_shoop
    if '_' in name:
        parts = name.split('_', 1)
        return {'first': parts[0], 'second': f"_{parts[1]}"}

    # If there is a space, e.g. 'Shall Shoop'
    if ' ' in name:
        parts = name.split(' ', 1)
        return {'first': parts[0], 'second': f" {parts[1]}"}

    # If PascalCase or camelCase, e.g. ShallShoop or ShopNex
    match = re.match(r'^([A-Z]?[a-z0-9]+)([A-Z].*)$', name)
    if match:
        return {'first': match.group(1), 'second': match.group(2)}

    # Fallback: split roughly at halfway
    half = len(name) // 2
    return {'first': name[:half], 'second': name[half:]}


class SiteSettingSerializer(serializers.ModelSerializer):
    brand_parts = serializers.SerializerMethodField()

    class Meta:
        model = SiteSetting
        fields = [
            'id',
            'site_name',
            'site_tagline',
            'site_description',
            'contact_email',
            'contact_phone',
            'address',
            'announcement_text',
            'currency_symbol',
            'currency_code',
            'free_shipping_threshold',
            'footer_copyright',
            'facebook_url',
            'instagram_url',
            'twitter_url',
            'brand_parts',
            'updated_at',
        ]
        read_only_fields = ['id', 'brand_parts', 'updated_at']

    def get_brand_parts(self, obj):
        return split_brand_name(obj.site_name)
