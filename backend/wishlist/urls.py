from django.urls import path
from .views import (
    WishlistView,
    WishlistItemAddView,
    WishlistToggleView,
    WishlistItemRemoveView,
)

app_name = 'wishlist'

urlpatterns = [
    path('', WishlistView.as_view(), name='wishlist_detail'),
    path('items/', WishlistItemAddView.as_view(), name='wishlist_add'),
    path('toggle/', WishlistToggleView.as_view(), name='wishlist_toggle'),
    path('items/<int:item_or_product_id>/', WishlistItemRemoveView.as_view(), name='wishlist_remove'),
]
