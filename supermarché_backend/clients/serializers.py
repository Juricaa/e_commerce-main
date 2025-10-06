from rest_framework import serializers 
from clients.models import Client  
 
 
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

        email = serializers.EmailField(required=False)
        prenom = serializers.CharField(required=False)
        nom = serializers.CharField(required=False)
