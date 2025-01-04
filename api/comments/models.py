from django.db import models
from django.conf import settings

from posts.models import Post


class Comment(models.Model):
    text = models.TextField(max_length=100)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.user.username
