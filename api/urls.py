from django.urls import path
from . import views

urlpatterns = [
    path('accounts/', views.users_api),
    path('accounts/<int:pk>/', views.user_detail_api),
    path('vehicles/', views.vehicles_api),
    path('vehicles/<int:pk>/', views.vehicle_api),
    path('parts/', views.parts_api),
    path('claims/', views.claims_api),
    path('claims/<int:pk>/', views.claim_api),
    path('claims/<int:pk>/media/', views.media_api),
    path('damages/', views.damages_api),
    path('auto-assess/', views.auto_assess_api),
    path('assistant/', views.assistant_api),
]
