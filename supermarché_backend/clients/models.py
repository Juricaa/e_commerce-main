from django.utils import timezone
from django.db import models

def generate_custom_client_id():
    last = Client.objects.order_by('-id_client').first()
    if last and last.id_client.startswith("C"):
        number = int(last.id_client[3:]) + 1
    else:
        number = 1
    return f"C{number:04d}"
class Client(models.Model):
    id_client = models.CharField(primary_key=True,
        max_length=10,
        default=generate_custom_client_id,
        editable=False)
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.EmailField()
    telephone = models.CharField(max_length=50)
    adresse = models.TextField()
    date_inscription = models.DateField(default=timezone.now)

    class Meta:
        db_table = 'clients'  

    