from rest_framework import serializers 
from utilisateurs.models import Utilisateur
 
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    mot_de_passe = serializers.CharField(required=True, write_only=True)

 
class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = '__all__'


    # prenom = serializers.JSONField(required=False)