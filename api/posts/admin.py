from django.contrib import admin
from .models import Post, UserLiked

class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')


admin.site.register(Post, PostAdmin)
admin.site.register(UserLiked)