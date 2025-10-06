from rest_framework import serializers
from produits.models import Produit

class ProduitSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Produit
        fields = '__all__'
   