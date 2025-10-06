# accounts/urls.py
from django.urls import path
from . import services
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', services.commande_list, name='commande-list'),            # GET: liste, POST: créer
    path('<str:id_commande>/', services.commande_detail, name='commande_detail'),
    path('client/', services.get_or_create_client, name='get_or_create_client'),  # POST: get or create client

]
