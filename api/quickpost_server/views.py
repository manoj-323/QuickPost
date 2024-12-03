from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination

from .serializers import PostSerializer, FeedSerializer
from .models import Post
from .pagination import FeedCursorPagination




class MakePost(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        user = self.request.user

        if user.is_anonymous:
            raise PermissionDenied("You must be logged-in to create post.")

        serializer.save(user=user)



class Home(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        qs = Post.objects.all()
        # Pass the `request` object in the serializer context
        serializer = PostSerializer(qs, many=True, context={'request': request})
        data = serializer.data
        return Response(data)



class Feed(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Post.objects.select_related('user__userprofile').all()
    serializer_class = FeedSerializer
    pagination_class = FeedCursorPagination