from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('register/', views.RegistrationAPIView.as_view(), name="user-register"), # noqa
    path('logout/', views.LogoutAPIView.as_view(), name="user-logout"),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # noqa

    path('profile/view/', views.UserProfileView.as_view(), name='user_profile'), # noqa

    path('messages/', views.UserMessageView.as_view(), name='user-messages'), # noqa
]
