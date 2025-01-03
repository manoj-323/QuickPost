from django.db import transaction
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound

from .serializers import (PostSerializer, FeedSerializer, UserProfileSerializer
                          , FollowerSerializer, UserSerializer, CommentSerializer, AuthenticatedUserProfileSerializer
                          , FollowingSerializer)
from .models import Post, UserProfile, Follower, UserLiked, Comment
from .pagination import FeedCursorPagination





class Feed(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Post.objects.select_related('user__userprofile').all()
    serializer_class = FeedSerializer
    pagination_class = FeedCursorPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # Add the request to the context so that it's available in the serializer
        context['request'] = self.request
        return context


class MakePost(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        # Save the post with the authenticated user
        serializer.save(user=self.request.user)


class UserSearchView(APIView):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username']
    permission_classes = [AllowAny]

    def post(self, request):
        search_query = request.data.get('search_query', {})
        filtered_users = User.objects.filter(username__icontains=search_query)[:10]
        serializer = UserSerializer(filtered_users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username=None):
        print("gettting a users profile")
        try:
            # If username is passed in the URL
            if username and username != request.user:
                profile = UserProfile.objects.get(user__username=username)
            elif username == request.user:

                profile = UserProfile.objects.get(user__username=request.user)
                # Pass the request object to the serializer context to build the absolute URL
                serializer = AuthenticatedUserProfileSerializer(profile, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'a username is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if request.user.is_authenticated:
                print('authenticated user')
            
            serializer = UserProfileSerializer(profile, context={'request': request})
            return Response(serializer.data, status=200)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=404)


class AuthenticatedUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("gettting autenticated users profile")
        # Get the profile of the currently authenticated user
        profile = UserProfile.objects.get(user__username=request.user)
        
        # Pass the request object to the serializer context to build the absolute URL
        serializer = AuthenticatedUserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Get the profile of the currently authenticated user
        user = request.user
        profile = UserProfile.objects.get(user=user)

        # Extract fields from the request data
        name = request.data.get("name", None)
        bio = request.data.get("bio", None)
        profile_picture = request.FILES.get("profilePicture", None)

        # Validate input fields
        if not name and not bio and not profile_picture:
            raise ValidationError("At least one of name, bio, or profile picture should be provided.")
        
        # Update the profile if data is provided
        if name:
            profile.name = name
        if bio:
            profile.bio = bio
        if profile_picture:
            profile.profilePicture = profile_picture

        # Save the updated profile
        profile.save()

        # Serialize the updated profile and return as response
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserPostsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username=None):
        try:
            if username:
                # Fetch posts for a user by username
                posts = Post.objects.filter(user__username=username)
            else:
                # Fetch posts for the current authenticated user
                posts = Post.objects.filter(user=request.user)

            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response(serializer.data, status=200)
        except Post.DoesNotExist:
            return Response({'error': 'No posts found for this user'}, status=404)


class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        followed_id = request.data.get("followed_id")
        try:
            followed_user = User.objects.get(id=followed_id)
            if followed_user == request.user:
                return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

            follow, created = Follower.objects.get_or_create(
                follower=request.user, followed=followed_user
            )

            if created:
                return Response({"message": "Successfully followed.", 'is_following': True}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "You are already following this user."}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        followed_id = request.data.get("followed_id")
        try:
            followed_user = User.objects.get(id=followed_id)
            follow = Follower.objects.get(follower=request.user, followed=followed_user)
            follow.delete()
            return Response({"message": "Successfull.", 'is_following': False}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Follower.DoesNotExist:
            return Response({"error": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)
        

class FollowerListView(generics.ListAPIView):
    serializer_class = FollowerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("getting follower")
        user_id = self.request.query_params.get("user_id")
        if user_id:
            return Follower.objects.filter(followed__id=user_id)
        return Follower.objects.none()


class FollowingListView(generics.ListAPIView):
    serializer_class = FollowingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("getting following")
        user_id = self.request.query_params.get("user_id")
        if user_id:
            return Follower.objects.filter(follower__id=user_id)
        return Follower.objects.none()
    


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        post_id = request.data.get('post_id')
        if not post_id:
            return Response({'error': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                qs = Post.objects.get(id=post_id)
                obj, created = UserLiked.objects.get_or_create(user=request.user, post=qs)
                
                if not created and obj.is_liked:
                    qs.upvote -= 1
                    obj.is_liked = False
                else:
                    qs.upvote += 1
                    obj.is_liked = True
                
                qs.save()
                obj.save()
        except Post.DoesNotExist:
            raise NotFound(detail='Post not found')
        
        return Response({'message': 'Success', 'upvote': qs.upvote, 'is_liked': obj.is_liked}, status=status.HTTP_200_OK)


class CommentPostView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        post_id = request.data.get('post_id')
        comment_text = request.data.get('comment_text')

        if not post_id:
            return Response({'message': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not comment_text:
            return Response({'message': 'comment_text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                post = Post.objects.get(id=post_id)
                Comment.objects.create(user=request.user, post=post, text=comment_text)

                return Response({'message': 'comment added successfully', }, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({'message': 'post not found'}, status=status.HTTP_404_NOT_FOUND)


class CommentListView(ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = []  # No authentication required for GET requests

    def get_queryset(self):
        """
        Optionally filter the comments by post_id if provided.
        """
        post_id = self.request.query_params.get('post_id')
        if post_id:
            return Comment.objects.filter(post_id=post_id)
        return Comment.objects.all()



class CommentUpdateView(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        comment_id = self.kwargs['comment_id']
        try:
            comment = Comment.objects.get(id=comment_id, user=self.request.user)
            return comment
        except Comment.DoesNotExist:
            raise NotFound(detail='Comment not found or does not belong to the authenticated user')
        
    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        comment_text = request.data.get('comment_text')

        if not comment_text:
            return Response({'message': 'comment_text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        comment.text = comment_text
        comment.save()

        return Response({'message': 'comment updated successfully'}, status=status.HTTP_200_OK)