from django.db import models
from django.conf import settings

from followers.models import Follower



class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=True)
    bio = models.TextField(max_length=250, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_picture/", blank=True, default="profile_picture/default_pfp.png"
    )

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.user.username
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.user.username

    def follower_count(self):
        return Follower.objects.filter(followed=self.user).count()

    def following_count(self):
        return Follower.objects.filter(follower=self.user).count()
    
