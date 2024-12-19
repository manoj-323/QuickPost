from .models import Post, Comment, UserProfile, Followers

from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.reverse import reverse




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')
        # fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'name', 'followers', 'user', 'bio', 'profilePicture')


class FollowersSerializer(serializers.ModelSerializer):
    follower = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    followed = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Followers
        fields = ['follower', 'followed']

class PostSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # Nested UserProfile data in Post

    class Meta:
        model = Post
        fields = ('id', 'user', 'text', 'image', 'upvote', 'created_at')

    def get_image_url(self, obj):
        request = self.context.get('request')  # To include domain (full URL)
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None




class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ('id', 'content', 'upvote', 'post', 'user')






class FeedSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    profile_pic = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'username', 'text', 'upvote', 'created_at', 'profile_pic', 'image')

    def get_username(self, obj):
        # Access username from the user profile
        return obj.user.username  # Assuming user is linked to a UserProfile through the 'userprofile' field

    def get_profile_pic(self, obj):
        # Access profile picture from the related UserProfile
        try:
            return obj.user.userprofile.profilePicture.url  # Access UserProfile's profilePicture
        except UserProfile.DoesNotExist:
            return None  # Return None if the UserProfile doesn't exist
