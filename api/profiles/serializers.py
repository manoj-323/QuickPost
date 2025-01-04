from django.contrib.auth.models import User

from rest_framework import serializers

from .models import UserProfile
from followers.models import Follower

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')


class AuthenticatedUserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')  # Accessing the 'username' of the related User model

    class Meta:
        model = UserProfile
        fields = ["id", "name", 'username', "follower_count", "following_count", "profile_picture", "bio"]




class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ["id", "name", 'username', "follower_count", "following_count", "profile_picture", "bio", "is_following"]

    def get_is_following(self, obj):
        request = self.context.get('request')
        # print("is authenticated: " , request.user.is_authenticated)
        # print("kjajdvkjvl ", request.user, obj.user)
        if request and request.user.is_authenticated:
            return Follower.objects.filter(follower=request.user, followed=obj.user).exists()
        return False