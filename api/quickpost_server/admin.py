from django.contrib import admin
from .models import Post, Comment, UserProfile, UserLiked, Follower

class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')


admin.site.register(Post, PostAdmin)
admin.site.register(Comment)
admin.site.register(UserProfile)
admin.site.register(UserLiked)
admin.site.register(Follower)
