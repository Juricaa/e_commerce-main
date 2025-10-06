# accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from clients.models import Client
def generate_custom_id():
    last = Commande.objects.order_by('-id_commande').first()
    if last and last.id_commande.startswith("CMD"):
        number = int(last.id_commande[3:]) + 1
    else:
        number = 1
    return f"CMD{number:04d}"

class Commande(models.Model):
    id_commande = models.AutoField(primary_key=True)
    id_client = models.ForeignKey(Client, on_delete=models.CASCADE, db_column='id_client', related_name='commandes')
    date_commande = models.DateTimeField(default=timezone.now)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    STATUT_CHOICES = [('en attente','en attente'),('payée','payée'),('livrée','livrée'),
                       ('expédiée','expédiée'),('annulée','annulée')]
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en attente')


    class Meta:
        db_table = 'commandes'