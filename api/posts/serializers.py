from rest_framework import serializers

from .models import Post, UserLiked

from profiles.models import UserProfile

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
    


class UserLikedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLiked
        fields = ('is_liked', )


