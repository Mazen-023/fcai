from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import UserSerializer, RegisterSerializers, ProfileSerializer
from .models import User


# Create your views here.
@csrf_exempt
@api_view(['POST'])
def login_view(request):

    # Logged user in should be via POST
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=status.HTTP_400_BAD_REQUEST)

    # Store requested data
    username = request.data.get('username')
    password = request.data.get('password')

    # Attempt to sign user in
    user = authenticate(request, username=username, password=password)

    # Check if authentication successful
    if user is not None:
        login(request, user)
        return Response({"message": "Login successful", "id": user.id}, status=status.HTTP_200_OK)
    return Response({"message": "Invalid credentials"}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['POST'])
def logout_view(request):
    # Logged user out should be via POST
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=status.HTTP_400_BAD_REQUEST)
    
    logout(request)
    return Response(status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET', 'POST'])
def register(request):
    
    # Access all available users should be via GET
    if request.method == 'GET':
        # Return all users that are registered
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({'users': serializer.data})
    
    # User registrations should be via POST
    if request.method == 'POST':
        serializer = RegisterSerializers(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return Response({"message": "Registration successful", "id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    Get or update user profile
    """
    try:
        user = request.user
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProfileSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)