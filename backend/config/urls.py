from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from products.views import CategoryListView
from core.views import ApiRootView, SiteSettingView

urlpatterns = [
    path('', ApiRootView.as_view(), name='root_landing'),
    path('api/', ApiRootView.as_view(), name='api_overview'),
    path('admin/', admin.site.urls),
    path('api/settings/', SiteSettingView.as_view(), name='api_settings'),
    path('api/accounts/', include('accounts.urls')),
    path('api/categories/', CategoryListView.as_view(), name='api_categories'),
    path('api/products/', include('products.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/coupons/', include('coupons.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path('api/', include('reviews.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
