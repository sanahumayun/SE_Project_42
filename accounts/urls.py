from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import accounts_home, UserViewSet, RegisterUserView, LoginUserView, LogoutUserView, TeacherOnlyView, AdminOnlyView, AuthLinksView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename="users")

urlpatterns = [
    path('', accounts_home, name='accounts-home'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('logout/', LogoutUserView.as_view(), name='logout'),
    path('teacher/', TeacherOnlyView.as_view(), name='teacher'),
    path('admin/', AdminOnlyView.as_view(), name='admin'),
    path('', include(router.urls)),
    path('authlinks/', AuthLinksView.as_view(), name='auth-links'),
]

urlpatterns += router.urls