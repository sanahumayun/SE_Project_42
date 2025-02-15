from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
from .views import home_view 

def home(request):
    return HttpResponse("Welcome to the Django Backend API!")

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')), 
]