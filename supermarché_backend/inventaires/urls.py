from django.urls import path
from . import services

urlpatterns = [
    path('', services.inventaire_list),
    path('<int:pk>/', services.inventaire_detail),
]
