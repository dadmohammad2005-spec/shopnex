from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import User
from products.models import Category, Product, ProductVariant
from coupons.models import Coupon
from cart.models import Cart, CartItem
from orders.models import Order


class ShopNexBackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='Password123!',
            first_name='Test',
            last_name='User'
        )
        self.category = Category.objects.create(
            name='Test Electronics',
            slug='test-electronics'
        )
        self.product = Product.objects.create(
            category=self.category,
            name='Test Product',
            sku='TEST-001',
            price=Decimal('100.00'),
            sale_price=Decimal('80.00'),
            stock=10,
            is_active=True
        )
        self.coupon = Coupon.objects.create(
            code='TEST10',
            discount_type='percent',
            discount_value=Decimal('10.00'),
            min_purchase_amount=Decimal('50.00'),
            is_active=True
        )

    # 1. Authentication Tests
    def test_user_registration(self):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'SecurePassword123!',
            'password_confirm': 'SecurePassword123!',
            'first_name': 'New',
            'last_name': 'Customer'
        }
        response = self.client.post('/api/accounts/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='new@example.com').exists())

    def test_user_login(self):
        response = self.client.post('/api/accounts/login/', {
            'email': 'test@example.com',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], 'test@example.com')

    def test_profile_requires_authentication(self):
        response = self.client.get('/api/accounts/profile/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/accounts/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')

    # 2. Product Tests
    def test_product_list_and_filter(self):
        response = self.client.get('/api/products/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_product_detail(self):
        response = self.client.get(f'/api/products/products/{self.product.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')
        self.assertEqual(Decimal(str(response.data['effective_price'])), Decimal('80.00'))

    # 3. Cart Tests
    def test_cart_add_and_update(self):
        # Add to cart
        response = self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 2
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 2)
        self.assertEqual(Decimal(str(response.data['subtotal'])), Decimal('160.00'))

        item_id = response.data['items'][0]['id']

        # Update cart quantity
        patch_response = self.client.patch(f'/api/cart/items/{item_id}/', {
            'quantity': 3
        })
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_response.data['total_items'], 3)
        self.assertEqual(Decimal(str(patch_response.data['subtotal'])), Decimal('240.00'))

    def test_cart_exceed_stock_rejection(self):
        response = self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 999
        })
        # Should restrict quantity to available stock (10)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 10)

    # 4. Coupon Validation Tests
    def test_coupon_validation(self):
        response = self.client.post('/api/coupons/validate/', {
            'code': 'TEST10',
            'subtotal': 100.00
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['valid'])
        self.assertEqual(Decimal(str(response.data['discount_amount'])), Decimal('10.00'))

    def test_coupon_below_minimum(self):
        response = self.client.post('/api/coupons/validate/', {
            'code': 'TEST10',
            'subtotal': 30.00
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['valid'])

    # 5. Order & Checkout Workflow
    def test_checkout_workflow_and_stock_deduction(self):
        # 1. Add product to cart
        self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 2
        })

        # 2. Place order
        initial_stock = self.product.stock
        order_data = {
            'customer_name': 'John Doe',
            'customer_email': 'john@example.com',
            'customer_phone': '+1 555-123-4567',
            'shipping_address': '123 Market St',
            'city': 'San Francisco',
            'state': 'CA',
            'postal_code': '94105',
            'country': 'United States',
            'payment_method': 'cod',
            'coupon_code': 'TEST10'
        }

        checkout_response = self.client.post('/api/orders/checkout/', order_data)
        self.assertEqual(checkout_response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(checkout_response.data['order_number'].startswith('SNX-'))

        # Verify prices calculated on backend:
        # 2 x 80.00 = 160.00 subtotal
        # 10% coupon = 16.00 discount
        # subtotal >= 100 -> shipping is 0
        # total = 160 - 16 = 144.00
        self.assertEqual(Decimal(str(checkout_response.data['subtotal'])), Decimal('160.00'))
        self.assertEqual(Decimal(str(checkout_response.data['discount_amount'])), Decimal('16.00'))
        self.assertEqual(Decimal(str(checkout_response.data['total_amount'])), Decimal('144.00'))

        # Verify stock was deducted safely
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, initial_stock - 2)

        # Verify cart is empty
        cart_response = self.client.get('/api/cart/')
        self.assertEqual(cart_response.data['total_items'], 0)
