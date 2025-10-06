from django.db import models
from django.utils import timezone
from commande.models import Commande

class Paiement(models.Model):
    STATUT_CHOICES = [
        ('en attente', 'En attente'),
        ('effectué', 'Effectué'),
        ('payée','Payée'),
        ('échoué', 'Échoué'),
        ('remboursé', 'Remboursé'),
    ]

    id_paiement = models.AutoField(primary_key=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    methode_paiement = models.CharField(max_length=50)  # ex: 'Carte', 'Paypal', 'Virement'
    statut_paiement = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en attente')
    date_paiement = models.DateTimeField(default=timezone.now)
    id_commande = models.ForeignKey(Commande, on_delete=models.CASCADE, related_name='paiements')

    class Meta:
        db_table = 'paiements'

    
