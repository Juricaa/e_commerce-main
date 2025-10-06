
from django.db import models

from django.utils import timezone

def generate_custom_id():
    last = Produit.objects.order_by('-id_produit').first()
    if last and last.id_produit.startswith("PRO"):
        number = int(last.id_produit[3:]) + 1
    else:
        number = 1
    return f"PRO{number:04d}"


class Produit(models.Model):
    id_produit = models.CharField(
        primary_key=True,
        max_length=10,
        default=generate_custom_id,
        editable=False
    )
    nom_produit = models.CharField(max_length=255)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    categorie = models.CharField(max_length=100)
    date_ajout = models.DateTimeField(default=timezone.now)
    image = models.ImageField(upload_to='images/', blank=True, null=True)

    class Meta:
        db_table = 'produits'