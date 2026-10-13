# ShopNex — Frontend Web Application

ShopNex is a modern, responsive, high-performance e-commerce frontend built with React, Vite, and Tailwind CSS.

## Architecture

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM (Declarative client-side routing)
- **Styling**: Tailwind CSS with custom brand palette, typography, and responsive breakpoints
- **Icons**: Lucide Icons
- **HTTP Client**: Axios configured with central API interceptor, cross-origin credentials (`withCredentials: true`), and automatic Django CSRF cookie handling.
- **State Management**: React Context architecture:
  - `AuthContext`: Authentication lifecycle, session status, user profile, password change.
  - `CartContext`: Cart items, quantity updates, inventory limits, coupon codes, and server-side pricing.
  - `WishlistContext`: Real-time wishlist toggling and live counter badge.
  - `ToastContext`: Floating non-blocking feedback notifications.

---

## Folder Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── StarRating.jsx
│   │   └── home/
│   │       ├── HeroBanner.jsx
│   │       ├── CategoryGrid.jsx
│   │       ├── DealsSection.jsx
│   │       └── Testimonials.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── WishlistContext.jsx
│   │   └── ToastContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── FAQ.jsx
│   │   ├── Policy.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .env
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

## Local Setup & Running (Windows PowerShell)

1. Open PowerShell and navigate to `frontend/`:
   ```powershell
   cd c:\Users\Dad Mohammad\Desktop\shopnex\frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Copy environment configuration:
   ```powershell
   Copy-Item .env.example .env
   ```
4. Start the Vite development server:
   ```powershell
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
5. Production Build verification:
   ```powershell
   npm run build
   ```
