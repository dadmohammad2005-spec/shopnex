from django.urls import path
from .views import (
    CartView,
    CartItemAddView,
    CartItemUpdateView,
    CartClearView,
)

app_name = 'cart'

urlpatterns = [
    path('', CartView.as_view(), name='cart_detail'),
    path('items/', CartItemAddView.as_view(), name='cart_add'),
    path('items/<int:item_id>/', CartItemUpdateView.as_view(), name='cart_item_update'),
    path('clear/', CartClearView.as_view(), name='cart_clear'),
]
