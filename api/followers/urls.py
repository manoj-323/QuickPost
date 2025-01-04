from . import views
from django.urls import path



urlpatterns = [
    path('follow/', views.FollowView.as_view(), name='follow_user'),  # Follow a user
    path('followers/', views.FollowerListView.as_view(), name='followers_list'),  # Get followers
    path('following/', views.FollowingListView.as_view(), name='following_list'),  # Get following
]