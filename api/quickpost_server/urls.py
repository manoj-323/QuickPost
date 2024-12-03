from django.urls import path
from . import views



urlpatterns = [
    path('', views.Home.as_view()),
    path('post/', views.MakePost.as_view(), name='post'),
    path('feed/', views.Feed.as_view(), name='feed'),
]