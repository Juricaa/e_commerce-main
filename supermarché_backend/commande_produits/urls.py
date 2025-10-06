from django.urls import path
from commande_produits import services


urlpatterns = [
   path('', services.commande_produit_list),
    path('<int:pk>/', services.commande_produit_detail),
]
