from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer
)


class StandardResultsPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50


class CategoryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(is_active=True).prefetch_related('products')


class ProductListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductListSerializer
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category')

        # Category filter (by slug or id)
        category = self.request.query_params.get('category')
        if category:
            if category.isdigit():
                queryset = queryset.filter(category_id=category)
            else:
                queryset = queryset.filter(category__slug=category)

        # Search query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(short_description__icontains=search) |
                Q(description__icontains=search) |
                Q(sku__icontains=search) |
                Q(category__name__icontains=search)
            )

        # Price range
        min_price = self.request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # In stock only
        in_stock = self.request.query_params.get('in_stock')
        if in_stock and in_stock.lower() in ('true', '1'):
            queryset = queryset.filter(stock__gt=0)

        # Featured, deals, new arrivals, bestsellers
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() in ('true', '1'):
            queryset = queryset.filter(is_featured=True)

        deals = self.request.query_params.get('deals')
        if deals and deals.lower() in ('true', '1'):
            queryset = queryset.filter(sale_price__isnull=False, sale_price__gt=0)

        new_arrivals = self.request.query_params.get('new_arrivals')
        if new_arrivals and new_arrivals.lower() in ('true', '1'):
            queryset = queryset.filter(is_new_arrival=True)

        bestsellers = self.request.query_params.get('bestsellers')
        if bestsellers and bestsellers.lower() in ('true', '1'):
            queryset = queryset.filter(is_bestseller=True)

        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        valid_orderings = {
            'price_asc': 'price',
            'price_desc': '-price',
            'newest': '-created_at',
            'rating': '-rating',
            'popularity': '-review_count',
        }
        order_field = valid_orderings.get(ordering, ordering)
        try:
            queryset = queryset.order_by(order_field)
        except Exception:
            queryset = queryset.order_by('-created_at')

        return queryset


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug_or_id):
        product = None
        if str(slug_or_id).isdigit():
            product = Product.objects.filter(id=slug_or_id, is_active=True).first()
        if not product:
            product = Product.objects.filter(slug=slug_or_id, is_active=True).first()

        if not product:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductDetailSerializer(product)
        return Response(serializer.data)


class RelatedProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, product_id):
        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            return Response([])

        related = Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product.id).select_related('category')[:4]

        serializer = ProductListSerializer(related, many=True)
        return Response(serializer.data)


class SearchSuggestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if len(query) < 2:
            return Response([])

        products = Product.objects.filter(
            is_active=True,
            name__icontains=query
        ).values('id', 'name', 'slug', 'price', 'sale_price', 'image_url')[:6]

        return Response(list(products))
