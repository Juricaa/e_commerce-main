from django.urls import path
from utilisateurs import services  # Assure-toi que services.py contient bien les fonctions ci-dessous

urlpatterns = [
    path('', services.utilisateur_list, name='utilisateur-list'),          # GET: liste, POST: créer
    path('login/', services.utilisateur_login, name='utilisateur-login'),      # POST: authentification
    path('<str:id_utilisateur>/', services.utilisateur_detail, name='utilisateur-detail'),  # GET, PUT, DELETE par ID
]
