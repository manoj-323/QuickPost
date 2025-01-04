from django.contrib.auth.models import User

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Follower
from .serializers import FollowingSerializer, FollowerSerializer





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
    