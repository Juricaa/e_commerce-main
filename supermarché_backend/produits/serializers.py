from rest_framework import serializers
from produits.models import Produit

class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = '__all__'

    image = serializers.JSONField(required=False)
   