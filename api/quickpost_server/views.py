from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .serializers import (PostSerializer, FeedSerializer, UserProfileSerializer
                          , FollowersSerializer, UserSerializer)
from .models import Post, UserProfile, Followers
from .pagination import FeedCursorPagination

from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend


class Home(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        qs = Post.objects.all()
        # Pass the `request` object in the serializer context
        serializer = PostSerializer(qs, many=True, context={'request': request})
        data = serializer.data
        return Response(data)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.get(username='manish')
        profile = UserProfile.objects.get(user=user)
        
        serializer = UserProfileSerializer(profile)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        follower = request.user
        followed_id = request.data.get('followed')
        followed = User.objects.get(id=followed_id)

        if follower == followed:
            return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the follow relationship
        follow, created = Followers.objects.get_or_create(follower=follower, followed=followed)

        if not created:
            return Response({"error": "Already following this user."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(FollowersSerializer(follow).data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        follower = request.user
        followed_id = request.data.get('followed')
        followed = User.objects.get(id=followed_id)

        try:
            follow = Followers.objects.get(follower=follower, followed=followed)
            follow.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Followers.DoesNotExist:
            return Response({"error": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)


class FollowersListView(generics.ListAPIView):
    serializer_class = FollowersSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Followers.objects.filter(followed__id=user_id)

class Feed(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Post.objects.select_related('user__userprofile').all()
    serializer_class = FeedSerializer
    pagination_class = FeedCursorPagination


class MakePost(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        user = self.request.user

        if user.is_anonymous:
            raise PermissionDenied("You must be logged-in to create post.")

        serializer.save(user=user)

class UserSearchView(APIView):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username']
    permission_classes = [AllowAny]

    def post(self, request):
        search_query = request.data.get('search_query', {})
        filtered_users = User.objects.filter(username__icontains=search_query)
        serializer = UserSerializer(filtered_users, many=True)

        return Response(serializer.data[:10], status=status.HTTP_200_OK)
    
class UserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        print(username)
        user = User.objects.get(username=username)
        userprofile = UserProfile.objects.get(user=user)
        serializer = UserProfileSerializer(userprofile)

        return Response(serializer.data)