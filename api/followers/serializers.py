from rest_framework import serializers

from .models import Follower



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