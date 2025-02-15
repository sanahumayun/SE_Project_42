from django.shortcuts import render
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from .serializers import UserSerializer, LoginSerializer
from .models import User
from .permissions import IsTeacher, IsAdmin 


User = get_user_model()

def accounts_home(request):
    return JsonResponse("Welcome to the Accounts API!")

class AuthLinksView(APIView):
    permission_classes = [AllowAny]  
    def get(self, request, *args, **kwargs):
        return Response({
            "register_url": "/accounts/register/",
            "login_url": "/accounts/login/",
            "logout_url": "/accounts/logout/",
            "teacher_url": "/accounts/teacher/",
            "admin_url": "/accounts/admin/"
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        return Response("Please use a POST request with username, email, password, and role to register.")


class LoginUserView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return Response("Please use a POST request with your username and password to log in.")

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response("Logged out successfully", status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class TeacherOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    
    def get(self, request):
        return Response("Hello, Teacher!", status=status.HTTP_200_OK)

class AdminOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request):
        return Response("Welcome, Admin!", status=status.HTTP_200_OK)
    
    