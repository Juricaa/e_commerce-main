from django.urls import path
from . import services

urlpatterns = [
    path('', services.paiement_list),
    path('<int:id_paiement>/', services.paiement_detail),
]
