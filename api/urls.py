from django.urls import path
from . import views

urlpatterns = [
    path('accounts/<int:pk>/', views.user_detail_api),
    path('policyholders/', views.policyholders_api),
    path('policyholders/<int:pk>/', views.policyholder_api),
    path('vehicles/', views.vehicles_api),
    path('vehicles/<int:pk>/', views.vehicle_api),
    path('claims/', views.claims_api),
    path('claims/<int:pk>/', views.claim_api),
    path('claims/<int:pk>/media/', views.media_api),
    path('claims/<int:pk>/damages/', views.damages_api),
]
