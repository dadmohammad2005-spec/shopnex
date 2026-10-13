from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'phone_number', 'address', 'city', 'state',
            'postal_code', 'country', 'is_staff', 'date_joined'
        ]
        read_only_fields = ['id', 'username', 'email', 'is_staff', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone_number'
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email_or_user = data.get('email', '').strip()
        password = data.get('password', '')

        # Check if email belongs to a user
        user = None
        user_by_email = User.objects.filter(email__iexact=email_or_user).first()
        if user_by_email:
            user = authenticate(username=user_by_email.email, password=password)
            if not user:
                # Fallback to username
                user = authenticate(username=user_by_email.username, password=password)
        else:
            user = authenticate(username=email_or_user, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email/username or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account has been disabled.")

        data['user'] = user
        return data


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number',
            'address', 'city', 'state', 'postal_code', 'country'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is not correct.")
        return value
