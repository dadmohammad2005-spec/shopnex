from django.http import JsonResponse, HttpResponse
from django.views import View

class ApiRootView(View):
    def get(self, request, *args, **kwargs):
        accept_header = request.META.get('HTTP_ACCEPT', '')
        
        # If requested by a web browser, return a premium HTML landing page
        if 'text/html' in accept_header:
            html_content = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ShopNex — REST API Server</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #0f172a;
                        color: #f8fafc;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 24px;
                    }
                    .container {
                        max-width: 800px;
                        width: 100%;
                        background: #1e293b;
                        border: 1px solid #334155;
                        border-radius: 24px;
                        padding: 40px;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        background: rgba(16, 185, 129, 0.15);
                        color: #34d399;
                        border: 1px solid rgba(16, 185, 129, 0.3);
                        font-size: 12px;
                        font-weight: 700;
                        padding: 4px 12px;
                        border-radius: 9999px;
                        margin-bottom: 16px;
                    }
                    .badge-dot {
                        width: 8px;
                        height: 8px;
                        background: #34d399;
                        border-radius: 50%;
                    }
                    h1 {
                        font-size: 32px;
                        font-weight: 800;
                        letter-spacing: -0.02em;
                        margin-bottom: 10px;
                    }
                    h1 span { color: #38bdf8; }
                    p.sub {
                        color: #94a3b8;
                        font-size: 15px;
                        line-height: 1.6;
                        margin-bottom: 32px;
                    }
                    .card-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 16px;
                        margin-bottom: 32px;
                    }
                    .card {
                        background: #0f172a;
                        border: 1px solid #334155;
                        border-radius: 16px;
                        padding: 20px;
                        transition: all 0.2s;
                    }
                    .card:hover {
                        border-color: #38bdf8;
                        transform: translateY(-2px);
                    }
                    .card h3 {
                        font-size: 16px;
                        font-weight: 700;
                        margin-bottom: 6px;
                    }
                    .card p {
                        font-size: 13px;
                        color: #94a3b8;
                        margin-bottom: 16px;
                        line-height: 1.5;
                    }
                    .btn {
                        display: inline-block;
                        text-decoration: none;
                        font-size: 13px;
                        font-weight: 700;
                        padding: 8px 16px;
                        border-radius: 10px;
                        transition: all 0.2s;
                    }
                    .btn-primary {
                        background: #2563eb;
                        color: #ffffff;
                    }
                    .btn-primary:hover { background: #1d4ed8; }
                    .btn-secondary {
                        background: #334155;
                        color: #f8fafc;
                    }
                    .btn-secondary:hover { background: #475569; }
                    .endpoints {
                        background: #0f172a;
                        border: 1px solid #334155;
                        border-radius: 16px;
                        padding: 20px;
                    }
                    .endpoints h4 {
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        color: #64748b;
                        margin-bottom: 14px;
                    }
                    .endpoint-list {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                        gap: 10px;
                    }
                    .endpoint-item {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 13px;
                        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
                    }
                    .method {
                        font-size: 10px;
                        font-weight: 800;
                        padding: 2px 6px;
                        border-radius: 4px;
                        background: rgba(56, 189, 248, 0.15);
                        color: #38bdf8;
                    }
                    .endpoint-item a {
                        color: #cbd5e1;
                        text-decoration: none;
                    }
                    .endpoint-item a:hover {
                        color: #38bdf8;
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="badge">
                        <div class="badge-dot"></div>
                        Django REST API Server Online
                    </div>
                    <h1>Shop<span>Nex</span> Backend API</h1>
                    <p class="sub">
                        This is the Django REST Framework API service running on port 8000. 
                        The customer shopping storefront is served by the React client on port 5173.
                    </p>

                    <div class="card-grid">
                        <div class="card">
                            <h3>🛍️ React Frontend Storefront</h3>
                            <p>Open the modern, responsive shopping website with products, cart, wishlist, and checkout.</p>
                            <a href="http://127.0.0.1:5173/" target="_blank" class="btn btn-primary">Open Storefront &rarr;</a>
                        </div>
                        <div class="card">
                            <h3>⚙️ Django Admin Panel</h3>
                            <p>Manage product catalog, stock, orders, coupons, customer reviews, and contact messages.</p>
                            <a href="/admin/" class="btn btn-secondary">Open Django Admin &rarr;</a>
                        </div>
                    </div>

                    <div style="margin-bottom: 24px; padding: 16px; background: #0f172a; border-radius: 12px; font-size: 13px; color: #94a3b8; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <div>📍 <strong>Location:</strong> Quetta, Balochistan, Pakistan</div>
                        <div>✉️ <strong>Contact:</strong> <a href="mailto:dadmohammad2005@gmail.com" style="color: #38bdf8; text-decoration: none;">dadmohammad2005@gmail.com</a></div>
                    </div>

                    <div class="endpoints">
                        <h4>Explore Core REST Endpoints (JSON)</h4>
                        <div class="endpoint-list">
                            <div class="endpoint-item">
                                <span class="method">GET</span>
                                <a href="/api/products/products/">/api/products/products/</a>
                            </div>
                            <div class="endpoint-item">
                                <span class="method">GET</span>
                                <a href="/api/categories/">/api/categories/</a>
                            </div>
                            <div class="endpoint-item">
                                <span class="method">GET</span>
                                <a href="/api/cart/">/api/cart/</a>
                            </div>
                            <div class="endpoint-item">
                                <span class="method">GET</span>
                                <a href="/api/accounts/current-user/">/api/accounts/current-user/</a>
                            </div>
                            <div class="endpoint-item">
                                <span class="method">GET</span>
                                <a href="/api/wishlist/">/api/wishlist/</a>
                            </div>
                            <div class="endpoint-item">
                                <span class="method">POST</span>
                                <a href="/api/coupons/validate/">/api/coupons/validate/</a>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """
            return HttpResponse(html_content, content_type='text/html')

        # Otherwise return JSON
        return JsonResponse({
            "service": "ShopNex REST API",
            "status": "online",
            "version": "1.0.0",
            "location": "Quetta, Balochistan, Pakistan",
            "contact_email": "dadmohammad2005@gmail.com",
            "frontend_url": "http://127.0.0.1:5173/",
            "admin_url": "/admin/",
            "endpoints": {
                "categories": "/api/categories/",
                "products": "/api/products/products/",
                "cart": "/api/cart/",
                "orders": "/api/orders/",
                "coupons_validate": "/api/coupons/validate/",
                "accounts": "/api/accounts/",
                "contact": "/api/contact/",
                "wishlist": "/api/wishlist/",
            }
        })
