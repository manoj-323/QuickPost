from django.db import transaction

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.generics import (ListAPIView, CreateAPIView)
from rest_framework.permissions import AllowAny, IsAuthenticated

from .pagination import FeedCursorPagination
from .serializers import PostSerializer, FeedSerializer
from .models import Post, UserLiked



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
