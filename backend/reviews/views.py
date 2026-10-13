from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from products.models import Product
from orders.models import OrderItem
from .models import ProductReview
from .serializers import ProductReviewSerializer, CreateReviewSerializer


class ProductReviewListView(generics.ListCreateAPIView):
    serializer_class = ProductReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return ProductReview.objects.filter(
            product_id=product_id,
            is_approved=True
        ).select_related('user').order_by('-created_at')

    def create(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id')
        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateReviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Check if user previously bought this product
        has_purchased = OrderItem.objects.filter(
            order__user=request.user,
            product=product
        ).exists()

        review, created = ProductReview.objects.update_or_create(
            product=product,
            user=request.user,
            defaults={
                'rating': serializer.validated_data['rating'],
                'title': serializer.validated_data.get('title', ''),
                'comment': serializer.validated_data['comment'],
                'is_verified_purchase': has_purchased,
                'is_approved': True,
            }
        )

        return Response(
            ProductReviewSerializer(review).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
