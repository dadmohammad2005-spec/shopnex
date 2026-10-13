from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    RelatedProductsView,
    SearchSuggestionsView,
)

app_name = 'products'

urlpatterns = [
    path('', ProductListView.as_view(), name='product_list_root'),
    path('search/', ProductListView.as_view(), name='product_search_direct'),
    path('suggestions/', SearchSuggestionsView.as_view(), name='search_suggestions_direct'),
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/search/', ProductListView.as_view(), name='product_search'),
    path('products/suggestions/', SearchSuggestionsView.as_view(), name='search_suggestions'),
    path('<str:slug_or_id>/', ProductDetailView.as_view(), name='product_detail_direct'),
    path('products/<str:slug_or_id>/', ProductDetailView.as_view(), name='product_detail'),
    path('<int:product_id>/related/', RelatedProductsView.as_view(), name='product_related_direct'),
    path('products/<int:product_id>/related/', RelatedProductsView.as_view(), name='product_related'),
]
