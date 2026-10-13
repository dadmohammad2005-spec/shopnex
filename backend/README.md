# ShopNex — Backend API Service

ShopNex is an enterprise-grade Django REST Framework backend designed for modern, high-performance e-commerce platforms.

## Architecture

- **Framework**: Django 5.1 & Django REST Framework 3.17
- **Authentication**: Session Authentication with CSRF cookies and Django User credentials
- **Database**: SQLite (Development) / PostgreSQL-ready (Production)
- **Security**: Strict CORS headers, CSRF validation, server-side transaction-atomic price and inventory calculation

### Applications Structure

- `accounts/`: User registration, session login, logout, profile update, and password changes.
- `products/`: Product catalog, categories, gallery images, variants (size, color), and search suggestions.
- `cart/`: Shopping cart, quantity updates, stock limit enforcement, and user session synchronization.
- `orders/`: Atomic transaction checkout, automatic unique order number generation (`SNX-YYYYMMDD-XXXX`), server-calculated subtotal, coupon discounts, shipping costs, and inventory deduction.
- `coupons/`: Discount coupon validation (percentage, fixed amount, minimum purchase requirements, usage limits).
- `reviews/`: Product ratings (1-5 stars), text reviews, aggregate rating calculations, and verified buyer badges.
- `wishlist/`: Saved customer favorite products.
- `contact/`: Customer support contact inquiries.
- `core/`: Database seeding utility (`seed_db`) and comprehensive integration test suite.

---

## REST API Endpoints

### Authentication (`/api/accounts/`)
- `GET /api/accounts/csrf/`: Retrieve CSRF cookie and token.
- `POST /api/accounts/register/`: Register a new customer account.
- `POST /api/accounts/login/`: Authenticate user and initiate session.
- `POST /api/accounts/logout/`: Invalidate user session.
- `GET /api/accounts/profile/`: Fetch authenticated user profile.
- `PATCH /api/accounts/profile/`: Update personal profile information.
- `POST /api/accounts/change-password/`: Change account password.
- `GET /api/accounts/current-user/`: Check authentication state and current user info.

### Products & Categories (`/api/`)
- `GET /api/categories/`: List all active product categories.
- `GET /api/products/products/`: List products with pagination, search, category filters, and sorting.
- `GET /api/products/products/<slug_or_id>/`: Detailed product information with variants and gallery.
- `GET /api/products/products/<id>/related/`: Related products in the same category.
- `GET /api/products/suggestions/?q=<query>`: Fast search autocomplete suggestions.

### Cart (`/api/cart/`)
- `GET /api/cart/`: Fetch active user/guest cart, items, subtotal, and stock limits.
- `POST /api/cart/items/`: Add product/variant to cart with quantity validation.
- `PATCH /api/cart/items/<id>/`: Update item quantity in cart.
- `DELETE /api/cart/items/<id>/`: Remove item from cart.
- `POST /api/cart/clear/`: Remove all items from cart.

### Orders (`/api/orders/`)
- `POST /api/orders/checkout/`: Atomic checkout creation, stock deduction, and order placement.
- `GET /api/orders/`: List past orders for authenticated user.
- `GET /api/orders/<id_or_number>/`: Retrieve detailed order invoice.
- `POST /api/orders/<id>/cancel/`: Cancel pending order and restore stock.

### Coupons (`/api/coupons/`)
- `POST /api/coupons/validate/`: Validate coupon code against cart subtotal.

### Reviews (`/api/`)
- `GET /api/products/<id>/reviews/`: Approved product reviews.
- `POST /api/products/<id>/reviews/`: Submit product review and rating.

### Wishlist (`/api/wishlist/`)
- `GET /api/wishlist/`: List customer wishlist items.
- `POST /api/wishlist/toggle/`: Toggle product presence in wishlist.
- `DELETE /api/wishlist/items/<id>/`: Remove product from wishlist.

### Contact (`/api/contact/`)
- `POST /api/contact/`: Submit a customer inquiry.

---

## Local Setup & Running (Windows PowerShell)

1. Open PowerShell in `backend/`:
   ```powershell
   cd c:\Users\Dad Mohammad\Desktop\shopnex\backend
   ```
2. Activate Virtual Environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Copy environment configuration:
   ```powershell
   Copy-Item .env.example .env
   ```
5. Apply database migrations:
   ```powershell
   python manage.py migrate
   ```
6. Seed database with demo catalog:
   ```powershell
   python manage.py seed_db
   ```
7. Run the automated test suite:
   ```powershell
   python manage.py test core
   ```
8. Start development server:
   ```powershell
   python manage.py runserver 127.0.0.1:8000
   ```

### Default Credentials
- **Admin Panel (`http://127.0.0.1:8000/admin/`)**:
  - Email: `admin@shopnex.com`
  - Password: `Admin12345!`
- **Demo Customer**:
  - Email: `customer@shopnex.com`
  - Password: `Customer12345!`
