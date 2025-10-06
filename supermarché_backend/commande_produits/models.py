from django.db import models
from commande.models import Commande
from produits.models import Produit

def generate_custom_id():
    last = CommandeProduit.objects.order_by('-id').first()
    if last and str(last.id).startswith("CPR"):
        number = int(str(last.id)[3:]) + 1
    else:
        number = 1
    return f"CPR{number:04d}"


class CommandeProduit(models.Model):
    id = models.CharField(
        primary_key=True,
        max_length=10,
        default=generate_custom_id,
        editable=False
    )
    id_commande = models.ForeignKey(Commande, on_delete=models.CASCADE , db_column='id_commande', related_name='commande_produits')
    id_produit = models.ForeignKey(Produit, on_delete=models.CASCADE, db_column='id_produit', related_name='commande_produits')
    quantite = models.PositiveIntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)  # prix au moment de la commande

    class Meta:
        db_table = 'commande_produits'
        unique_together = ('id_commande', 'id_produit')  # un produit unique par commande

    def __str__(self):
        return f"{self.id_produit.nom_produit} x {self.quantite} (Commande {self.id_commande.id_commande})"
