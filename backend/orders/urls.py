from django.urls import path
from .views import (
    CheckoutView,
    OrderListView,
    OrderDetailView,
    OrderCancelView,
)

app_name = 'orders'

urlpatterns = [
    path('', OrderListView.as_view(), name='order_list'),
    path('checkout/', CheckoutView.as_view(), name='order_checkout'),
    path('<str:order_identifier>/', OrderDetailView.as_view(), name='order_detail'),
    path('<int:order_id>/cancel/', OrderCancelView.as_view(), name='order_cancel'),
]
