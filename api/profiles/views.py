from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import UserProfile
from .serializers import UserSerializer, AuthenticatedUserProfileSerializer, UserProfileSerializer



class UserSearchView(APIView):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username']
    permission_classes = [AllowAny]

    def post(self, request):
        search_query = request.data.get('search_query', {})
        filtered_users = User.objects.filter(username__icontains=search_query)[:10]
        serializer = UserSerializer(filtered_users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username=None):
        print("gettting a users profile")
        try:
            # If username is passed in the URL
            if username and username != request.user:
                profile = UserProfile.objects.get(user__username=username)
            elif username == request.user:

                profile = UserProfile.objects.get(user__username=request.user)
                # Pass the request object to the serializer context to build the absolute URL
                serializer = AuthenticatedUserProfileSerializer(profile, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'a username is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if request.user.is_authenticated:
                print('authenticated user')
            
            serializer = UserProfileSerializer(profile, context={'request': request})
            return Response(serializer.data, status=200)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=404)


class AuthenticatedUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("gettting autenticated users profile")
        # Get the profile of the currently authenticated user
        profile = UserProfile.objects.get(user__username=request.user)
        
        # Pass the request object to the serializer context to build the absolute URL
        serializer = AuthenticatedUserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Get the profile of the currently authenticated user
        user = request.user
        profile = UserProfile.objects.get(user=user)

        # Extract fields from the request data
        name = request.data.get("name", None)
        bio = request.data.get("bio", None)
        profile_picture = request.FILES.get("profilePicture", None)

        # Validate input fields
        if not name and not bio and not profile_picture:
            raise ValidationError("At least one of name, bio, or profile picture should be provided.")
        
        # Update the profile if data is provided
        if name:
            profile.name = name
        if bio:
            profile.bio = bio
        if profile_picture:
            profile.profilePicture = profile_picture

        # Save the updated profile
        profile.save()

        # Serialize the updated profile and return as response
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
