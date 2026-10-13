from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
    CurrentUserView,
    CSRFTokenView,
)

app_name = 'accounts'

urlpatterns = [
    path('csrf/', CSRFTokenView.as_view(), name='csrf'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('current-user/', CurrentUserView.as_view(), name='current_user'),
]
