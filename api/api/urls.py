from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('auth_api.urls')),  # Authentication endpoints
    path('api/posts/', include('posts.urls')),  # Post-related endpoints
    path('api/profiles/', include('profiles.urls')),  # Profile-related endpoints
    path('api/comments/', include('comments.urls')),  # Comment-related endpoints
    path('api/followers/', include('followers.urls')),  # Follow-related endpoints
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)