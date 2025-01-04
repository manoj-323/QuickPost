from . import views
from django.urls import path



urlpatterns = [
    path('', views.CommentListView.as_view(), name='comment_list'),  # List comments
    path('create/', views.CommentPostView.as_view(), name='create_comment'),  # Create a new comment
    path('<int:comment_id>/', views.CommentUpdateView.as_view(), name='update_comment'),  # Update or delete a comment
]