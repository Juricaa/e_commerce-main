from django.db import models
from produits.models import Produit
from django.utils import timezone

MOUVEMENT_CHOICES = [
    ('ENTREE', 'Entrée'),
    ('SORTIE', 'Sortie'),
]



class Inventaire(models.Model):
    id_inventaire = models.AutoField(primary_key=True,)
    mouvement = models.CharField(max_length=10, choices=MOUVEMENT_CHOICES)
    quantite = models.PositiveIntegerField()
    date_mouvement = models.DateTimeField(default=timezone.now)
    commentaire = models.TextField(blank=True, null=True)
    id_produit = models.ForeignKey(Produit, on_delete=models.CASCADE, db_column='id_produit', related_name='inventaires')

    class Meta:
        db_table = 'inventaires'

   