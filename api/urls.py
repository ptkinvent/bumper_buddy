from django.urls import path
from . import views

urlpatterns = [
    path('accounts/<int:pk>/', views.user_detail_api),
]
