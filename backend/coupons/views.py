from decimal import Decimal
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Coupon


class ValidateCouponView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        if not code:
            return Response({"valid": False, "detail": "Coupon code is required."}, status=status.HTTP_400_BAD_REQUEST)

        subtotal_raw = request.data.get('subtotal', 0)
        try:
            subtotal = Decimal(str(subtotal_raw))
        except Exception:
            subtotal = Decimal('0.00')

        coupon = Coupon.objects.filter(code__iexact=code).first()
        if not coupon:
            return Response({"valid": False, "detail": "Invalid coupon code."}, status=status.HTTP_400_BAD_REQUEST)

        is_valid, error_msg = coupon.is_valid(subtotal)
        if not is_valid:
            return Response({"valid": False, "detail": error_msg}, status=status.HTTP_400_BAD_REQUEST)

        discount_amount = coupon.calculate_discount(subtotal)

        return Response({
            "valid": True,
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount_value": coupon.discount_value,
            "discount_amount": discount_amount,
            "message": f"Coupon {coupon.code} applied successfully!"
        })
