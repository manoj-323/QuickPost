from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views


urlpatterns =[
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register_user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
]