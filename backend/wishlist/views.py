from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from products.models import Product
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)


class WishlistItemAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        item, created = WishlistItem.objects.get_or_create(wishlist=wishlist, product=product)

        return Response(
            WishlistSerializer(wishlist).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class WishlistToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        existing = WishlistItem.objects.filter(wishlist=wishlist, product=product).first()

        if existing:
            existing.delete()
            is_in_wishlist = False
            msg = "Removed from wishlist"
        else:
            WishlistItem.objects.create(wishlist=wishlist, product=product)
            is_in_wishlist = True
            msg = "Added to wishlist"

        return Response({
            "message": msg,
            "in_wishlist": is_in_wishlist,
            "wishlist": WishlistSerializer(wishlist).data
        })


class WishlistItemRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_or_product_id):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

        # Try to find by item id or by product id
        item = WishlistItem.objects.filter(wishlist=wishlist, id=item_or_product_id).first()
        if not item:
            item = WishlistItem.objects.filter(wishlist=wishlist, product_id=item_or_product_id).first()

        if not item:
            return Response({"detail": "Wishlist item not found."}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response(WishlistSerializer(wishlist).data)
