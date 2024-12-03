from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import random



class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=True)
    bio = models.TextField(max_length=250, blank=True)
    followers = models.IntegerField(default=0, blank=True, null=True)
    profilePicture = models.ImageField(upload_to='media/profilePicture', blank=True, default='media/profilePicture/default-pfp.png')

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.user.username
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.user.username

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    text = models.TextField(max_length=500)
    image = models.CharField(max_length=100, blank=True, default=f"https://picsum.photos/{random.randint(200,400)}/{random.randint(200,400)}"
)
    upvote = models.IntegerField(default=0, null=True)

    def __str__(self) -> str:
        return self.user.username



class Comment(models.Model):
    text = models.TextField(max_length=100)
    upvote = models.IntegerField(null=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.user.username

