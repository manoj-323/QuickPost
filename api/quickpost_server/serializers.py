from .models import Post, Comment, UserProfile, Follower, UserLiked

from django.contrib.auth.models import User

from rest_framework import serializers




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')


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

class AuthenticatedUserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')  # Accessing the 'username' of the related User model

    class Meta:
        model = UserProfile
        fields = ["id", "name", 'username', "follower_count", "following_count", "profile_picture", "bio"]


class PostSerializer(serializers.ModelSerializer):
    is_liked = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'text', 'username', 'post_image', 'upvote', 'created_at', 'is_liked')

    def get_username(self, obj):
        # Access username from the user profile
        return obj.user.username

    def get_post_image(self, obj):
        request = self.context.get('request')  # To include domain (full URL)
        if obj.post_image:
            return request.build_absolute_uri(obj.post_image.url)
        return None
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        # Check if the user is authenticated
        if request and request.user.is_authenticated:
            # Check if the current user has liked this post
            like_obj = UserLiked.objects.filter(user=request.user, post=obj).first()
            return like_obj.is_liked if like_obj else False
        return False


class FollowerSerializer(serializers.ModelSerializer):
    follower_name = serializers.SerializerMethodField()
    class Meta:
        model = Follower
        fields = ["follower", "created_at", "follower_name"]

    def get_follower_name(self, obj):
        return str(obj.follower)


class FollowingSerializer(serializers.ModelSerializer):
    followed_name = serializers.SerializerMethodField()
    class Meta:
        model = Follower
        fields = ["followed", "created_at", "followed_name"]

    def get_followed_name(self, obj):
        return str(obj.followed)


class UserLikedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLiked
        fields = ('is_liked', )


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'text', 'post', 'user')



class FeedSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    profile_picture = serializers.SerializerMethodField(read_only=True)
    is_liked = serializers.SerializerMethodField()


    class Meta:
        model = Post
        fields = ('id', 'username', 'text', 'upvote', 'created_at', 'profile_picture', 'post_image', 'is_liked')

    def get_username(self, obj):
        # Access username from the user profile
        return obj.user.username  # Assuming user is linked to a UserProfile through the 'userprofile' field

    def get_profile_picture(self, obj):
        # Access profile picture from the related UserProfile
        try:
            return obj.user.userprofile.profile_picture.url  # Access UserProfile's profilePicture
        except UserProfile.DoesNotExist:
            return None  # Return None if the UserProfile doesn't exist
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        # Check if the user is authenticated
        if request and request.user.is_authenticated:
            # Check if the current user has liked this post
            like_obj = UserLiked.objects.filter(user=request.user, post=obj).first()
            return like_obj.is_liked if like_obj else False
        return False