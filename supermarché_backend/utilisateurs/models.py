from django.db import models

def generate_custom_id():
    Last = Utilisateur.objects.order_by('-id_utilisateur').first()
    if Last and Last.id_utilisateur.startswith("U"): 
      number = int(Last.id_utilisateur[3:]) + 1
    else:
      number = 1
    return f"U{number:04d}"


class Utilisateur(models.Model):
    id_utilisateur = models.CharField(
        primary_key=True,
        max_length=10,
        default=generate_custom_id,
        editable=False
    )
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.EmailField()
   
    role = models.CharField(max_length=50)
    date_creation = models.DateTimeField(auto_now_add=True)
    mot_de_passe = models.CharField(max_length=255)
    status = models.BooleanField(default=True)
    ROLE_CHOICES =  [('admin','admin'), ('livreur','livreur')]

    class Meta:
        db_table = 'utilisateurs'
