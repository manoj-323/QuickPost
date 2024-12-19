from django.urls import path
from . import views



urlpatterns = [
    path('', views.Home.as_view()),
    path('post/', views.MakePost.as_view(), name='post'),
    path('feed/', views.Feed.as_view(), name='feed'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('user/<str:username>/', views.UserView.as_view(), name='user'),
    path('follow/', views.FollowersView.as_view(), name='follow'),
    path('search/', views.UserSearchView.as_view(), name='search'),
]