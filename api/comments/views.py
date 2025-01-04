from django.db import transaction

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import Comment
from .serializers import CommentSerializer

from posts.models import Post





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