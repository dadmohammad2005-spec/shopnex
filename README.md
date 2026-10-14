# shall_shoop — Professional Full-Stack E-Commerce Platform

shall_shoop is an international, enterprise-grade, full-stack e-commerce solution engineered with a decoupled architecture: a **Django REST Framework** backend and a high-performance **React.js + Vite** frontend styled with **Tailwind CSS**. It features a 100% dynamic store branding & settings engine allowing site names, logos, slogans, contact info, and policies to be managed centrally via API and Django Admin.

---

## 1. Project Architecture

The repository enforces complete separation between the backend service and the client application:

```
shall_shoop/
├── backend/
│   ├── config/              # Core Django project configuration & settings
│   ├── accounts/            # Custom User model, session auth, profiles
│   ├── products/            # Categories, products, variants, images, search
│   ├── cart/                # Persistent database cart & stock limits
│   ├── orders/              # Atomic checkout, order tracking, invoice snapshot
│   ├── coupons/             # Discount validation & usage management
│   ├── reviews/             # Customer ratings & reviews with verified badges
│   ├── wishlist/            # Customer wishlist management
│   ├── contact/             # Concierge contact inquiries
│   ├── core/                # Seeding command (`seed_db`) & test suite
│   ├── manage.py            # Django management CLI
│   ├── requirements.txt     # Python backend dependencies
│   ├── .env.example         # Backend environment template
│   ├── .env                 # Local development environment configuration
│   └── README.md            # Backend documentation
├── frontend/
│   ├── public/              # Static assets and brand favicon
│   ├── src/
│   │   ├── components/      # Common & home UI components (Navbar, Footer, ProductCard, etc.)
│   │   ├── context/         # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── pages/           # Home, Shop, ProductDetail, Cart, Checkout, Dashboard, Auth, etc.
│   │   ├── services/        # Centralized Axios API client with CSRF interceptor
│   │   ├── App.jsx          # React Router layout & application routes
│   │   ├── index.css        # Tailwind CSS and global style directives
│   │   └── main.jsx         # React application entrypoint
│   ├── package.json         # Node.js dependencies
│   ├── tailwind.config.js   # Tailwind theme customization
│   ├── vite.config.js       # Vite configuration
│   ├── .env.example         # Frontend environment template
│   ├── .env                 # Frontend local development configuration
│   └── README.md            # Frontend documentation
└── README.md                # Root project documentation
```

---

## 2. Technology Stack

### Frontend
- **React 19** with **Vite**
- **JavaScript (ES Modules)**
- **Tailwind CSS** (v3.4) with custom premium shadows, typography, and responsive grid
- **React Router DOM** (v7)
- **Axios** with automatic CSRF cookie interceptors and `withCredentials: true`
- **Lucide Icons**
- Responsive layout engineered for Mobile, Tablet, Laptop, and Ultra-wide Desktop displays

### Backend
- **Python 3.12**
- **Django 5.1**
- **Django REST Framework 3.17**
- **Django CORS Headers**
- **Django Authentication & Sessions** with HttpOnly session cookies
- **Pillow** for media image support
- **SQLite** for development; **PostgreSQL** compatibility for production
- **Django Admin Panel** customized for catalog and order management

---

## 3. Key Features Implemented

### Dynamic Branding & Store Configuration
- **Dynamic Site Settings Engine**: Store name (`shall_shoop`), tagline, contact emails, location, announcement banner, and currency are loaded dynamically from `/api/settings/` and managed in Django Admin.
- **Brand Part Splitter**: Automatically decomposes brand names into two-tone typography (e.g. `shall_shoop` into `shall` + `_shoop`) everywhere across the application.
- **Dynamic Meta & Titles**: Automatically reflects the store name in document title and policy notices.

### Customer Frontend Experience
- **Homepage**: Luxury promotional hero banner, shop by category cards, featured innovations, countdown flash deals section, customer favorites (best sellers), new arrivals, verified testimonials, and VIP newsletter subscription.
- **Product Listing (Shop)**: Responsive grid, multi-parameter filtering (by Category, Price range slider, In Stock only, Deals, Featured, New arrivals), multi-criteria sorting (Newest, Price ascending/descending, Customer rating, Popularity), real-time search with instant autocomplete suggestions, pagination, and skeleton loading states.
- **Product Detail**: Multi-image thumbnail gallery, live stock availability counter, variant selector (Size / Color / Edition), quantity limiter, Add to Cart with feedback, Buy Now instant checkout trigger, customer reviews tab with verified buyer badges, interactive "Write a Review" submission form, and related items carousel.
- **Shopping Cart**: Real-time quantity adjustment, item removal, free shipping progress bar ($100 threshold), coupon validation (`WELCOME10`, `SHALLSHOOP20`, `SAVE50`), subtotal calculations, and persistent state.
- **Secure Checkout**: Multi-field validated customer contact and shipping address forms, order snapshot review, **Cash on Delivery (COD)** functional payment method, transparently labeled sandbox card gateway placeholder, server-calculated totals, and database transaction atomic order placement.
- **Order Confirmation & Tracking**: Generated order identifier (`SNX-YYYYMMDD-XXXX`), 5-stage fulfillment timeline (Pending → Confirmed → Processing → Shipped → Delivered), itemized invoice receipt, and direct link to account dashboard.
- **Customer Dashboard**: Profile overview, editable shipping and personal details, order history with detailed receipt modals, order cancellation with automatic stock restoration, wishlist grid, and password update.
- **Informational Pages**: About Us, Contact Us (with functional message submission to backend API), Frequently Asked Questions with interactive accordions, and complete policy pages (Privacy Policy, Terms of Service, Shipping Policy, Return & Refund Policy).

### Backend Engineering & Security
- **Strict Server-Side Price & Inventory Calculation**: Never trusts submitted prices, subtotals, or discount amounts from the client.
- **Atomic Stock Deduction**: Uses `transaction.atomic()` and `select_for_update()` during checkout to eliminate race conditions and overselling.
- **Order Cancellation**: Automatically restores inventory count if an order is cancelled while in pending/confirmed status.
- **Session & CSRF Security**: Cookie-based authentication with `SESSION_COOKIE_HTTPONLY = True`, `SESSION_COOKIE_SAMESITE = 'Lax'`, and readable `csrftoken` header verification for cross-site request forgery prevention.

---

## 4. Running Instructions (Windows PowerShell)

Open two separate Windows PowerShell windows to run both applications simultaneously.

### Window 1: Backend Service (Django REST Framework)

```powershell
# 1. Navigate to the backend directory
cd "c:\Users\Dad Mohammad\Desktop\shopnex\backend"

# 2. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 3. (Optional) Install dependencies if setting up on a fresh machine
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Populate database with demo catalog, categories, reviews, and coupons
python manage.py seed_db

# 6. Run automated test suite
python manage.py test core

# 7. Start Django development server
python manage.py runserver 127.0.0.1:8000
```

> **Backend Service URL**: `http://127.0.0.1:8000`  
> **Django Admin Panel**: `http://127.0.0.1:8000/admin/`

---

### Window 2: Frontend Web Application (React + Vite)

```powershell
# 1. Navigate to the frontend directory
cd "c:\Users\Dad Mohammad\Desktop\shopnex\frontend"

# 2. (Optional) Install dependencies if setting up on a fresh machine
npm install

# 3. Start Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```

> **Frontend Application URL**: `http://127.0.0.1:5173/`

---

## 5. Seeded Credentials & Demo Accounts

The database seed command (`python manage.py seed_db`) automatically provisions the following accounts:

### Admin Superuser
- **Email**: `dadmohammad2005@gmail.com`
- **Password**: `Admin12345!`
- **Access**: Full access to Django Admin (`http://127.0.0.1:8000/admin/`) to manage store settings, products, categories, stock, orders, coupons, reviews, and customer inquiries.

### Demo Customer
- **Email**: `customer@shallshoop.com`
- **Password**: `Customer12345!`
- **Access**: Customer dashboard on the frontend (`http://127.0.0.1:5173/login`) with pre-configured shipping address and order history. (A 1-click **"Auto-fill"** button is also provided on the login page).

### Active Discount Coupons
- `WELCOME10`: 10% discount on all orders.
- `SHALLSHOOP20`: 20% discount on orders over $100.
- `SHOPNEX20`: 20% discount on orders over $100 (kept for backwards compatibility).
- `SAVE50`: $50 flat discount on orders over $250.

---

## 6. REST API Documentation

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/settings/` | Retrieve dynamic store settings & branding | No |
| `PATCH` | `/api/settings/` | Update store configuration dynamically | Staff / Admin |
| `GET` | `/api/accounts/csrf/` | Retrieve CSRF cookie & token | No |
| `POST` | `/api/accounts/register/` | Register new user & establish session | No |
| `POST` | `/api/accounts/login/` | Sign in with email/username & password | No |
| `POST` | `/api/accounts/logout/` | Sign out and invalidate session | Yes |
| `GET` | `/api/accounts/current-user/` | Check active session state | No |
| `GET` | `/api/accounts/profile/` | Retrieve authenticated profile | Yes |
| `PATCH` | `/api/accounts/profile/` | Update profile information | Yes |
| `POST` | `/api/accounts/change-password/` | Update user password | Yes |
| `GET` | `/api/categories/` | List all active product categories | No |
| `GET` | `/api/products/products/` | Filter, search, and paginate products | No |
| `GET` | `/api/products/products/<slug_or_id>/` | Detailed product specifications | No |
| `GET` | `/api/products/products/<id>/related/` | Related products in same category | No |
| `GET` | `/api/products/suggestions/?q=<term>` | Search autocomplete dropdown | No |
| `GET` | `/api/cart/` | Retrieve current cart items & subtotal | No |
| `POST` | `/api/cart/items/` | Add item/variant to cart with stock validation | No |
| `PATCH` | `/api/cart/items/<id>/` | Update item quantity in cart | No |
| `DELETE` | `/api/cart/items/<id>/` | Remove item from cart | No |
| `POST` | `/api/cart/clear/` | Clear all items from cart | No |
| `POST` | `/api/coupons/validate/` | Validate coupon against cart subtotal | No |
| `POST` | `/api/orders/checkout/` | Atomic transaction checkout & stock deduction | No |
| `GET` | `/api/orders/` | Order history for authenticated user | Yes |
| `GET` | `/api/orders/<id_or_number>/` | Order invoice & timeline details | No (Owner/Staff) |
| `POST` | `/api/orders/<id>/cancel/` | Cancel pending order & restore stock | Yes |
| `GET` | `/api/products/<id>/reviews/` | List approved customer reviews | No |
| `POST` | `/api/products/<id>/reviews/` | Submit review and rating for product | Yes |
| `GET` | `/api/wishlist/` | Customer saved wishlist items | Yes |
| `POST` | `/api/wishlist/toggle/` | Toggle product presence in wishlist | Yes |
| `DELETE` | `/api/wishlist/items/<id>/` | Remove product from wishlist | Yes |
| `POST` | `/api/contact/` | Submit concierge contact message | No |

---

## 7. Verification & Test Results

The backend includes 10 automated unit and integration tests verifying all critical paths:

```
Creating test database for alias 'default'...
Found 10 test(s).
System check identified no issues (0 silenced).
..........
----------------------------------------------------------------------
Ran 10 tests in 9.097s

OK
Destroying test database for alias 'default'...
```

The frontend production build was verified using Vite:
```
✓ 2000 modules transformed.
rendering chunks...
dist/index.html                   0.79 kB
dist/assets/index-DjYyvzpI.css   39.07 kB
dist/assets/index-Bu-JM1WY.js   482.64 kB
✓ built in 1.73s
```

---

## 8. Production Deployment Guide

### Backend Deployment (Gunicorn / Nginx / PostgreSQL)
1. **Database**: Provision a managed PostgreSQL instance and set `DATABASE_URL` in `.env`.
2. **Environment Variables**:
   ```env
   DJANGO_SECRET_KEY=generate-a-strong-random-50-character-secret
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=api.yourdomain.com
   CORS_ALLOWED_ORIGINS=https://yourdomain.com
   CSRF_TRUSTED_ORIGINS=https://yourdomain.com
   ```
3. **Static & Media Collection**:
   ```bash
   python manage.py collectstatic --noinput
   ```
4. **WSGI Server**: Run via Gunicorn behind Nginx with SSL certificates:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
   ```

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages / AWS S3)
1. Set environment variable:
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```
2. Build command:
   ```bash
   npm run build
   ```
3. Output directory:
   ```
   dist
   ```
4. Configure SPA rewrite rules for `index.html` fallback on unknown routes.
