from . import views
from django.urls import path



urlpatterns = [
    path('', views.Feed.as_view(), name='feed'),  # List posts (GET) and create posts (POST)
    path('create/', views.MakePost.as_view(), name='create_post'),  # Post creation
    path('like/', views.LikePostView.as_view(), name='like_post'),  # Like post
    # path('<int:post_id>/', views.PostDetailView.as_view(), name='post_detail'),  # Post detail view, update, delete
    path('profile/', views.UserPostsView.as_view(), name='current-user-posts'),
    path('user/<str:username>/', views.UserPostsView.as_view(), name='user_posts'),  # User's posts
]