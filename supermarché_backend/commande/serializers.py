# accounts/serializers.py
from rest_framework import serializers
from commande.models import Commande
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

class CommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commande
        fields = '__all__'
