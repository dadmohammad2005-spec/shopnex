from rest_framework import serializers
from .models import ProductReview


class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'user', 'user_name',
            'rating', 'title', 'comment', 'is_verified_purchase',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified_purchase', 'created_at']

    def get_user_name(self, obj):
        return obj.user.full_name or obj.user.username


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ['rating', 'title', 'comment']
