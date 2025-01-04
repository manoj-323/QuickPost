from . import views
from django.urls import path


urlpatterns = [
    path('search/', views.UserSearchView.as_view(), name='search'),
    path('me/', views.AuthenticatedUserProfileView.as_view(), name='profile'),  # Current authenticated user's profile
    path('user/<str:username>/', views.UserProfileView.as_view(), name='user_profile'),  # Another user's profile
]
