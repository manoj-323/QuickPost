from .models import Comment

from profiles.serializers import UserSerializer

from rest_framework import serializers



class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'text', 'post', 'user')

