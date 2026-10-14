from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User
from products.models import Category, Product, ProductImage, ProductVariant
from coupons.models import Coupon
from reviews.models import ProductReview
from core.models import SiteSetting


class Command(BaseCommand):
    help = 'Seeds database with realistic demo categories, products, reviews, coupons, and users'

    def handle(self, *args, **options):
        self.stdout.write("Starting shall_shoop database seeding...")

        # 0. Site Setting (Dynamic store configuration)
        site_setting = SiteSetting.get_settings()
        site_setting.site_name = 'shall_shoop'
        site_setting.site_tagline = 'Premium Modern E-Commerce'
        site_setting.site_description = 'shall_shoop curates premium international consumer electronics, designer apparel, artisan living goods, and active essentials for contemporary living.'
        site_setting.contact_email = 'dadmohammad2005@gmail.com'
        site_setting.contact_phone = '+92 300 1234567'
        site_setting.address = 'Quetta, Balochistan, Pakistan'
        site_setting.announcement_text = 'Complimentary Worldwide Shipping over $100 • Use code WELCOME10 for 10% off'
        site_setting.free_shipping_threshold = Decimal('100.00')
        site_setting.footer_copyright = 'shall_shoop International Inc. All rights reserved.'
        site_setting.save()
        self.stdout.write(self.style.SUCCESS("[OK] Site settings initialized for: shall_shoop"))

        # 1. Superuser
        admin_user = User.objects.filter(username='admin').first()
        if admin_user:
            admin_user.email = 'dadmohammad2005@gmail.com'
            admin_user.first_name = 'Dad'
            admin_user.last_name = 'Mohammad'
            admin_user.phone_number = '+92 300 0000000'
            admin_user.address = 'Main Market'
            admin_user.city = 'Quetta'
            admin_user.state = 'Balochistan'
            admin_user.country = 'Pakistan'
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.set_password('Admin12345!')
            admin_user.save()
        else:
            admin_user = User.objects.create_superuser(
                username='admin',
                email='dadmohammad2005@gmail.com',
                password='Admin12345!',
                first_name='Dad',
                last_name='Mohammad',
                phone_number='+92 300 0000000',
                address='Main Market',
                city='Quetta',
                state='Balochistan',
                country='Pakistan',
            )
        self.stdout.write(self.style.SUCCESS("[OK] Admin user configured: dadmohammad2005@gmail.com / Admin12345!"))

        # 2. Demo Customer
        demo_user = User.objects.filter(email='customer@shallshoop.com').first()
        if not demo_user:
            demo_user = User.objects.filter(email='customer@shopnex.com').first()
        if not demo_user:
            demo_user = User.objects.filter(username='alex_morgan').first()

        if demo_user:
            demo_user.email = 'customer@shallshoop.com'
            demo_user.username = 'alex_morgan'
            demo_user.first_name = 'Alex'
            demo_user.last_name = 'Morgan'
            demo_user.phone_number = '+92 300 1234567'
            demo_user.address = 'Gulshan Street'
            demo_user.city = 'Quetta'
            demo_user.state = 'Balochistan'
            demo_user.postal_code = '87300'
            demo_user.country = 'Pakistan'
            demo_user.set_password('Customer12345!')
            demo_user.save()
        else:
            demo_user = User.objects.create_user(
                username='alex_morgan',
                email='customer@shallshoop.com',
                password='Customer12345!',
                first_name='Alex',
                last_name='Morgan',
                phone_number='+92 300 1234567',
                address='Gulshan Street',
                city='Quetta',
                state='Balochistan',
                postal_code='87300',
                country='Pakistan',
            )
        self.stdout.write(self.style.SUCCESS("[OK] Demo customer configured: customer@shallshoop.com / Customer12345!"))

        # Secondary reviewer user
        reviewer_user, _ = User.objects.get_or_create(
            email='sarah.connor@example.com',
            defaults={
                'username': 'sarah_c',
                'first_name': 'Sarah',
                'last_name': 'Connor',
            }
        )
        if not reviewer_user.has_usable_password():
            reviewer_user.set_password('Customer12345!')
            reviewer_user.save()

        # 3. Categories
        categories_data = [
            {
                'name': 'Electronics & Gadgets',
                'slug': 'electronics-gadgets',
                'description': 'Cutting-edge consumer technology, wireless audio, smart gear, and premium computing accessories.',
                'image_url': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80',
            },
            {
                'name': 'Fashion & Apparel',
                'slug': 'fashion-apparel',
                'description': 'Contemporary designer clothing, luxury outerwear, footwear, and timeless everyday essentials.',
                'image_url': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
            },
            {
                'name': 'Home & Living',
                'slug': 'home-living',
                'description': 'Modern minimalist furniture, smart home appliances, artisan tableware, and ambient living decor.',
                'image_url': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
            },
            {
                'name': 'Beauty & Wellness',
                'slug': 'beauty-wellness',
                'description': 'Botanical skincare, clean cosmetics, luxury fragrances, and holistic personal wellness items.',
                'image_url': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
            },
            {
                'name': 'Sports & Outdoors',
                'slug': 'sports-outdoors',
                'description': 'High-performance athletic apparel, camping gear, fitness technology, and active lifestyle gear.',
                'image_url': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
            },
        ]

        category_objs = {}
        for cat_data in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            category_objs[cat.slug] = cat
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(category_objs)} categories."))

        # 4. Products Data
        products_data = [
            # Electronics
            {
                'name': 'AeroSound Pro Wireless ANC Headphones',
                'slug': 'aerosound-pro-wireless-anc-headphones',
                'category': category_objs['electronics-gadgets'],
                'sku': 'SNX-AUD-001',
                'short_description': 'Industry-leading active noise cancellation with 40-hour battery life and spatial audio immersion.',
                'description': (
                    'Engineered for discerning audiophiles and frequent travelers, the AeroSound Pro features custom 45mm beryllium drivers '
                    'calibrated for studio-grade clarity. Dual hybrid microphones actively filter ambient noise up to 38dB. Enjoy ultra-soft memory '
                    'foam earcups, multi-point Bluetooth 5.3 connectivity, and rapid USB-C charging that delivers 5 hours of playback in just 10 minutes.'
                ),
                'price': Decimal('299.00'),
                'sale_price': Decimal('249.00'),
                'stock': 35,
                'is_featured': True,
                'is_bestseller': True,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
                ],
                'variants': [
                    {'type': 'color', 'name': 'Midnight Matte Black', 'sku': 'SNX-AUD-001-BLK', 'price_diff': Decimal('0.00'), 'stock': 18},
                    {'type': 'color', 'name': 'Silver Platinum', 'sku': 'SNX-AUD-001-SLV', 'price_diff': Decimal('0.00'), 'stock': 12},
                    {'type': 'color', 'name': 'Midnight Navy', 'sku': 'SNX-AUD-001-NVY', 'price_diff': Decimal('10.00'), 'stock': 5},
                ]
            },
            {
                'name': 'Apex Horizon Ultra Smartwatch 2.0',
                'slug': 'apex-horizon-ultra-smartwatch-2',
                'category': category_objs['electronics-gadgets'],
                'sku': 'SNX-WTC-002',
                'short_description': 'Titanium aerospace casing, sapphire crystal OLED display, and comprehensive biometrics tracking.',
                'description': (
                    'The Apex Horizon Ultra combines surgical-grade durability with elite athletic tracking. Featuring a 1.96-inch Always-On Retina OLED, '
                    'continuous ECG and SpO2 monitoring, dual-band precision GPS, and water resistance up to 50 meters. Built for both boardrooms and marathon courses.'
                ),
                'price': Decimal('399.00'),
                'sale_price': Decimal('349.00'),
                'stock': 22,
                'is_featured': True,
                'is_bestseller': False,
                'is_new_arrival': True,
                'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
                ],
                'variants': [
                    {'type': 'color', 'name': 'Aerospace Titanium 44mm', 'sku': 'SNX-WTC-002-44', 'price_diff': Decimal('0.00'), 'stock': 12},
                    {'type': 'color', 'name': 'Ceramic Black 48mm', 'sku': 'SNX-WTC-002-48', 'price_diff': Decimal('30.00'), 'stock': 10},
                ]
            },
            {
                'name': 'Lumina 4K Wireless Mirrorless Camera Body',
                'slug': 'lumina-4k-wireless-mirrorless-camera',
                'category': category_objs['electronics-gadgets'],
                'sku': 'SNX-CAM-003',
                'short_description': '33MP full-frame BSI sensor, 4K60p 10-bit recording, and real-time AI subject eye autofocus.',
                'description': (
                    'Unleash your visual storytelling with the Lumina 4K mirrorless camera. Packed with exceptional dynamic range, 5-axis in-body image stabilization, '
                    'and wireless content streaming right to cloud storage. Crafted in a lightweight weather-sealed magnesium chassis.'
                ),
                'price': Decimal('1299.00'),
                'sale_price': Decimal('1199.00'),
                'stock': 14,
                'is_featured': False,
                'is_bestseller': False,
                'is_new_arrival': True,
                'image_url': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': []
            },
            {
                'name': 'Zenith Pro Mechanical Ergonomic Keyboard',
                'slug': 'zenith-pro-mechanical-ergonomic-keyboard',
                'category': category_objs['electronics-gadgets'],
                'sku': 'SNX-KEY-004',
                'short_description': 'Hot-swappable custom lubricated linear switches, CNC aluminum chassis, and RGB acoustic dampening.',
                'description': (
                    'Typing perfection reimagined. The Zenith Pro features a gasket-mounted interior with five layers of sound-absorbing poron foam. '
                    'Equipped with pre-lubed Gateron switches, Bluetooth 5.2/2.4GHz tri-mode wireless, and double-shot PBT keycaps.'
                ),
                'price': Decimal('179.00'),
                'sale_price': Decimal('149.00'),
                'stock': 40,
                'is_featured': True,
                'is_bestseller': True,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': [
                    {'type': 'edition', 'name': 'Linear Quiet Switches', 'sku': 'SNX-KEY-004-LIN', 'price_diff': Decimal('0.00'), 'stock': 20},
                    {'type': 'edition', 'name': 'Tactile Brown Switches', 'sku': 'SNX-KEY-004-TAC', 'price_diff': Decimal('0.00'), 'stock': 20},
                ]
            },

            # Fashion
            {
                'name': 'Nordic Heritage Cashmere Overcoat',
                'slug': 'nordic-heritage-cashmere-overcoat',
                'category': category_objs['fashion-apparel'],
                'sku': 'SNX-FSH-005',
                'short_description': 'Handcrafted from 100% sustainably sourced virgin Mongolian cashmere with structured tailored shoulders.',
                'description': (
                    'A timeless centerpiece for winter elegance. Tailored with clean single-breasted lines, genuine horn buttons, and silk lining. '
                    'Provides warmth without bulk while draping effortlessly over formal or smart casual attire.'
                ),
                'price': Decimal('489.00'),
                'sale_price': Decimal('419.00'),
                'stock': 19,
                'is_featured': True,
                'is_bestseller': True,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
                ],
                'variants': [
                    {'type': 'size', 'name': 'Size S (38)', 'sku': 'SNX-FSH-005-S', 'price_diff': Decimal('0.00'), 'stock': 5},
                    {'type': 'size', 'name': 'Size M (40)', 'sku': 'SNX-FSH-005-M', 'price_diff': Decimal('0.00'), 'stock': 8},
                    {'type': 'size', 'name': 'Size L (42)', 'sku': 'SNX-FSH-005-L', 'price_diff': Decimal('0.00'), 'stock': 6},
                ]
            },
            {
                'name': 'Vanguard Minimalist Italian Leather Sneaker',
                'slug': 'vanguard-minimalist-italian-leather-sneaker',
                'category': category_objs['fashion-apparel'],
                'sku': 'SNX-SH-006',
                'short_description': 'Full-grain Tuscan calfskin leather with Margom rubber vulcanized soles and memory foam insoles.',
                'description': (
                    'The quintessential clean low-top sneaker. Hand-finished in Italy with buttery calfskin leather that molds to your feet over time. '
                    'Includes waxed cotton laces and reinforced heel counters.'
                ),
                'price': Decimal('225.00'),
                'sale_price': None,
                'stock': 28,
                'is_featured': False,
                'is_bestseller': True,
                'is_new_arrival': True,
                'image_url': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': [
                    {'type': 'size', 'name': 'US 9 / EU 42', 'sku': 'SNX-SH-006-42', 'price_diff': Decimal('0.00'), 'stock': 10},
                    {'type': 'size', 'name': 'US 10 / EU 43', 'sku': 'SNX-SH-006-43', 'price_diff': Decimal('0.00'), 'stock': 10},
                    {'type': 'size', 'name': 'US 11 / EU 44', 'sku': 'SNX-SH-006-44', 'price_diff': Decimal('0.00'), 'stock': 8},
                ]
            },
            {
                'name': 'Artisan Full-Grain Leather Weekender Bag',
                'slug': 'artisan-full-grain-leather-weekender-bag',
                'category': category_objs['fashion-apparel'],
                'sku': 'SNX-BAG-007',
                'short_description': 'Vegetable-tanned full grain leather with solid brass YKK zippers and padded laptop compartment.',
                'description': (
                    'Built to last decades. Sized strictly to meet international flight carry-on requirements, this travel duffel features '
                    'reinforced riveted handles, an adjustable wool shoulder strap, and waterproof ballistic lining.'
                ),
                'price': Decimal('340.00'),
                'sale_price': Decimal('289.00'),
                'stock': 16,
                'is_featured': True,
                'is_bestseller': False,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': []
            },

            # Home & Living
            {
                'name': 'Barista Artisan Touch Espresso Machine',
                'slug': 'barista-artisan-touch-espresso-machine',
                'category': category_objs['home-living'],
                'sku': 'SNX-COF-008',
                'short_description': 'Dual thermo-block PID temperature control, 15-bar Italian pressure pump, and microfoam steam wand.',
                'description': (
                    'Bring third-wave specialty cafe brewing into your kitchen. Features intuitive digital touch extraction timers, '
                    'precise 58mm stainless steel commercial portafilter, integrated conical burr grinder with 30 grind levels, and rapid 3-second heat-up.'
                ),
                'price': Decimal('699.00'),
                'sale_price': Decimal('599.00'),
                'stock': 15,
                'is_featured': True,
                'is_bestseller': True,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                ],
                'variants': [
                    {'type': 'color', 'name': 'Brushed Stainless Steel', 'sku': 'SNX-COF-008-SS', 'price_diff': Decimal('0.00'), 'stock': 10},
                    {'type': 'color', 'name': 'Matte Onyx Black', 'sku': 'SNX-COF-008-BLK', 'price_diff': Decimal('20.00'), 'stock': 5},
                ]
            },
            {
                'name': 'ErgoRest Sovereign Executive Mesh Chair',
                'slug': 'ergorest-sovereign-executive-mesh-chair',
                'category': category_objs['home-living'],
                'sku': 'SNX-CHR-009',
                'short_description': '4D dynamic lumbar support, breathable German elastomer mesh, and aluminum alloy synchronized tilt.',
                'description': (
                    'Engineered for 12+ hours of posture health and zero fatigue. Dynamic backrest tracks your spinal movement, '
                    'while multi-directional armrests and pneumatic seat depth adjustment alleviate pressure points.'
                ),
                'price': Decimal('449.00'),
                'sale_price': None,
                'stock': 25,
                'is_featured': False,
                'is_bestseller': True,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1580481077195-c22ae00f6889?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': []
            },
            {
                'name': 'Aura Ambient Sculptural Ceramic Table Lamp',
                'slug': 'aura-ambient-sculptural-ceramic-lamp',
                'category': category_objs['home-living'],
                'sku': 'SNX-LMP-010',
                'short_description': 'Hand-thrown terracotta ceramic base with natural linen lampshade and stepless touch dimmer.',
                'description': (
                    'An architectural piece of luminous warmth. Crafted by master ceramicists with natural textured matte glazes. '
                    'Includes an energy-efficient warm 2700K LED bulb that casts a relaxing golden glow.'
                ),
                'price': Decimal('135.00'),
                'sale_price': Decimal('115.00'),
                'stock': 30,
                'is_featured': False,
                'is_bestseller': False,
                'is_new_arrival': True,
                'image_url': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': []
            },

            # Beauty & Wellness
            {
                'name': 'Celestial Botanics Radiance Elixir Facial Serum',
                'slug': 'celestial-botanics-radiance-elixir-serum',
                'category': category_objs['beauty-wellness'],
                'sku': 'SNX-BTY-011',
                'short_description': 'Cold-pressed squalane, 15% stabilized vitamin C, and hyaluronic acid multi-molecular complex.',
                'description': (
                    'Restore youthful elasticity and radiant glow with our dermatologist-approved vegan facial nectar. '
                    'Deeply hydrates, balances skin tone, and protects against environmental oxidants without greasy residue.'
                ),
                'price': Decimal('78.00'),
                'sale_price': Decimal('62.00'),
                'stock': 50,
                'is_featured': True,
                'is_bestseller': True,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1608248597359-548480d5d288?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': [
                    {'type': 'size', 'name': '30ml Travel Edition', 'sku': 'SNX-BTY-011-30', 'price_diff': Decimal('0.00'), 'stock': 25},
                    {'type': 'size', 'name': '60ml Full Size', 'sku': 'SNX-BTY-011-60', 'price_diff': Decimal('40.00'), 'stock': 25},
                ]
            },
            {
                'name': 'Santal & Amberwood Eau De Parfum (100ml)',
                'slug': 'santal-amberwood-eau-de-parfum',
                'category': category_objs['beauty-wellness'],
                'sku': 'SNX-BTY-012',
                'short_description': 'Top notes of cardamom and violet leaf over Australian sandalwood, cedar, and smoky amber.',
                'description': (
                    'An intoxicating, evocative unisex signature fragrance. Compounded in Grasse, France with premium organic essential oils '
                    'for 14-hour longevity and mesmerizing sillage.'
                ),
                'price': Decimal('165.00'),
                'sale_price': None,
                'stock': 32,
                'is_featured': False,
                'is_bestseller': False,
                'is_new_arrival': True,
                'image_url': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': []
            },

            # Sports & Outdoors
            {
                'name': 'Velocity Carbon Pro Gravel Road Bike',
                'slug': 'velocity-carbon-pro-gravel-bike',
                'category': category_objs['sports-outdoors'],
                'sku': 'SNX-BIK-013',
                'short_description': 'Toray T800 monocoque carbon frame, Shimano GRX 1x12 electronic shifting, and hydraulic disc brakes.',
                'description': (
                    'Conquer gravel backcountry roads and paved sprints alike. Weighing under 8.4kg, the Velocity Carbon Pro absorbs vibrations '
                    'while converting every watt of pedal force into thrilling momentum.'
                ),
                'price': Decimal('2499.00'),
                'sale_price': Decimal('2199.00'),
                'stock': 8,
                'is_featured': True,
                'is_bestseller': False,
                'is_new_arrival': True,
                'image_url': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': [
                    {'type': 'size', 'name': 'Frame 52cm (Small)', 'sku': 'SNX-BIK-013-S', 'price_diff': Decimal('0.00'), 'stock': 3},
                    {'type': 'size', 'name': 'Frame 56cm (Medium)', 'sku': 'SNX-BIK-013-M', 'price_diff': Decimal('0.00'), 'stock': 3},
                    {'type': 'size', 'name': 'Frame 60cm (Large)', 'sku': 'SNX-BIK-013-L', 'price_diff': Decimal('0.00'), 'stock': 2},
                ]
            },
            {
                'name': 'Summit Expedition Thermal Insulated Flask (32oz)',
                'slug': 'summit-expedition-thermal-insulated-flask',
                'category': category_objs['sports-outdoors'],
                'sku': 'SNX-OUT-014',
                'short_description': 'Double-wall vacuum 18/8 pro-grade stainless steel keeps beverages cold 24h or piping hot 12h.',
                'description': (
                    'BPA-free powder-coated grip designed to withstand mountain drops. Leak-proof chug cap with wide mouth opening for ice cubes.'
                ),
                'price': Decimal('45.00'),
                'sale_price': Decimal('36.00'),
                'stock': 75,
                'is_featured': False,
                'is_bestseller': True,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': [
                    {'type': 'color', 'name': 'Alpine White', 'sku': 'SNX-OUT-014-WHT', 'price_diff': Decimal('0.00'), 'stock': 25},
                    {'type': 'color', 'name': 'Forest Green', 'sku': 'SNX-OUT-014-GRN', 'price_diff': Decimal('0.00'), 'stock': 25},
                    {'type': 'color', 'name': 'Volcanic Charcoal', 'sku': 'SNX-OUT-014-CHR', 'price_diff': Decimal('0.00'), 'stock': 25},
                ]
            },
            {
                'name': 'PulseFit Recovery Percussion Muscle Gun',
                'slug': 'pulsefit-recovery-percussion-muscle-gun',
                'category': category_objs['sports-outdoors'],
                'sku': 'SNX-FIT-015',
                'short_description': 'Brushless high-torque motor with 14mm amplitude, 6 interchangeable heads, and whisper-quiet operation.',
                'description': (
                    'Relieve muscle soreness and accelerate post-workout recovery. Features 5 speed settings up to 3200 RPM and a 3400mAh battery '
                    'providing 6 hours of continuous therapy on a single charge.'
                ),
                'price': Decimal('189.00'),
                'sale_price': Decimal('149.00'),
                'stock': 34,
                'is_featured': False,
                'is_bestseller': True,
                'is_new_arrival': False,
                'image_url': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
                'gallery': [],
                'variants': []
            },
        ]

        # Seed products
        seeded_products = []
        for pdata in products_data:
            gallery = pdata.pop('gallery', [])
            variants = pdata.pop('variants', [])
            prod, _ = Product.objects.update_or_create(
                slug=pdata['slug'],
                defaults=pdata
            )
            seeded_products.append(prod)

            # Seed gallery images
            for g_url in gallery:
                ProductImage.objects.get_or_create(
                    product=prod,
                    image_url=g_url,
                    defaults={'alt_text': prod.name, 'is_primary': False}
                )

            # Seed variants
            for v_data in variants:
                ProductVariant.objects.get_or_create(
                    product=prod,
                    name=v_data['name'],
                    defaults={
                        'variant_type': v_data['type'],
                        'sku': v_data['sku'],
                        'additional_price': v_data['price_diff'],
                        'stock': v_data['stock'],
                    }
                )

        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(seeded_products)} products with variants and galleries."))

        # 5. Seed Reviews
        sample_reviews = [
            {
                'product': seeded_products[0],
                'user': demo_user,
                'rating': 5,
                'title': 'The ANC is genuinely incredible',
                'comment': 'I commute daily on the subway and these completely silence the trains. Audio fidelity is crisp with deep, controlled bass.',
                'is_verified': True
            },
            {
                'product': seeded_products[0],
                'user': reviewer_user,
                'rating': 5,
                'title': 'Best headphones I have ever owned',
                'comment': 'The battery lasts through my entire 4-day trip without needing a recharge. Highly recommended!',
                'is_verified': True
            },
            {
                'product': seeded_products[1],
                'user': demo_user,
                'rating': 5,
                'title': 'Exceptional build quality',
                'comment': 'The titanium casing feels premium and lightweight. GPS tracking is accurate to within a meter on trail runs.',
                'is_verified': True
            },
            {
                'product': seeded_products[3],
                'user': reviewer_user,
                'rating': 5,
                'title': 'Dream keyboard for coding',
                'comment': 'The sound profile has a gentle thock with no ping. Hot-swap sockets made switch customization effortless.',
                'is_verified': True
            },
            {
                'product': seeded_products[4],
                'user': demo_user,
                'rating': 5,
                'title': 'Pure luxury cashmere',
                'comment': 'Wore this in 20-degree weather in Chicago and stayed warm while getting compliments from strangers.',
                'is_verified': True
            },
            {
                'product': seeded_products[7],
                'user': demo_user,
                'rating': 5,
                'title': 'Cafe quality espresso at home',
                'comment': 'Heats up almost instantly. The steam wand produces silky microfoam perfect for latte art.',
                'is_verified': True
            },
        ]

        for r_data in sample_reviews:
            ProductReview.objects.update_or_create(
                product=r_data['product'],
                user=r_data['user'],
                defaults={
                    'rating': r_data['rating'],
                    'title': r_data['title'],
                    'comment': r_data['comment'],
                    'is_verified_purchase': r_data['is_verified'],
                    'is_approved': True,
                }
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(sample_reviews)} customer reviews."))

        # 6. Seed Coupons
        coupons_data = [
            {
                'code': 'WELCOME10',
                'discount_type': 'percent',
                'discount_value': Decimal('10.00'),
                'min_purchase_amount': Decimal('0.00'),
                'max_discount_amount': Decimal('50.00'),
                'max_uses': 1000,
                'is_active': True,
            },
            {
                'code': 'SHALLSHOOP20',
                'discount_type': 'percent',
                'discount_value': Decimal('20.00'),
                'min_purchase_amount': Decimal('100.00'),
                'max_discount_amount': Decimal('150.00'),
                'max_uses': 500,
                'is_active': True,
            },
            {
                'code': 'SHOPNEX20',
                'discount_type': 'percent',
                'discount_value': Decimal('20.00'),
                'min_purchase_amount': Decimal('100.00'),
                'max_discount_amount': Decimal('150.00'),
                'max_uses': 500,
                'is_active': True,
            },
            {
                'code': 'SAVE50',
                'discount_type': 'fixed',
                'discount_value': Decimal('50.00'),
                'min_purchase_amount': Decimal('250.00'),
                'max_uses': 200,
                'is_active': True,
            },
        ]

        for c_data in coupons_data:
            Coupon.objects.update_or_create(
                code=c_data['code'],
                defaults=c_data
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(coupons_data)} promotional coupons."))

        self.stdout.write(self.style.SUCCESS("[SUCCESS] shall_shoop database seeding completed successfully!"))

