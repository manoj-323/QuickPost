from django.db import models
from django.conf import settings


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
