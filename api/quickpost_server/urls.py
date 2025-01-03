from . import views
from django.urls import path


urlpatterns = [
    # path('', views.Home.as_view()),
    path('feed/', views.Feed.as_view(), name='feed'),

    path('profile/', views.AuthenticatedUserProfileView.as_view(), name='profile'),
    path('profile/posts/', views.UserPostsView.as_view(), name='current-user-posts'),
    path('user/<str:username>/', views.UserProfileView.as_view(), name='user'),
    path('user/<str:username>/posts/', views.UserPostsView.as_view(), name='user-posts'),

    path('follow/', views.FollowView.as_view(), name='follow'),
    path('get-followers/', views.FollowerListView.as_view(), name='get-followers'),
    path('get-following/', views.FollowingListView.as_view(), name='get-following'),

    path('search/', views.UserSearchView.as_view(), name='search'),

    path('post/', views.MakePost.as_view(), name='post'),
    path('like/', views.LikePostView.as_view(), name='like_post'),
    path('comments/', views.CommentListView.as_view(), name='comment_list'),
    path('make-comment/', views.CommentPostView.as_view(), name='comment_post'),
    path('comment/update/<int:comment_id>/', views.CommentUpdateView.as_view(), name='comment_update'),
]