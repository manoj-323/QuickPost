from django.db import models
from django.conf import settings



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



class Follower(models.Model):
    # User who is following
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="following", on_delete=models.CASCADE
    )
    # User who is being followed
    followed = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="followed_by", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["follower", "followed"], name="unique_follow_relationship")
        ]

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"



class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(max_length=500)
    post_image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    upvote = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.user.username


class UserLiked(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    is_liked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='unique_user_post')
        ]


class Comment(models.Model):
    text = models.TextField(max_length=100)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.user.username
