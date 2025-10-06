from rest_framework import serializers 
from commande_produits.models import CommandeProduit
 
class CommandeProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandeProduit
        fields = ['id', 'id_commande', 'id_produit', 'quantite', 'prix_unitaire']  # ← Incluez 'id'
        read_only_fields = ['id']  # ← Rendez l'id en lecture seule