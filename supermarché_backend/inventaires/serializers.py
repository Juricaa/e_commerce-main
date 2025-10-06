from rest_framework import serializers 
from inventaires.models import Inventaire
 
 
class InventaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventaire
        fields = '__all__'



    # lieu_depart= serializers.JSONField(required=False)
    # lieu_arrivee = serializers.JSONField(required=False)    
   