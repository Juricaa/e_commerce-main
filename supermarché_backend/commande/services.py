from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema

from commande.models import Commande
from commande.serializers import CommandeSerializer
from clients.models import Client
from clients.serializers import ClientSerializer


@swagger_auto_schema(method='post', request_body=ClientSerializer)
@api_view(['POST'])
def get_or_create_client(request):
    """
    Recherche un client par email. 
    S'il existe → retourne son id_client.
    Sinon → crée un nouveau client et retourne son id.
    """
    data = JSONParser().parse(request)
    email = data.get('email', None)

    if not email:
        return JsonResponse({'success': False, 'message': 'Email requis !'}, status=400)

    try:
        client = Client.objects.get(email=email)
        return JsonResponse({
            'success': True,
            'id_client': client.id_client,
            'message': 'Client existant trouvé.'
        }, status=200)
    except Client.DoesNotExist:
        serializer = ClientSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
                'success': True,
                'id_client': serializer.data['id_client'],
                'message': 'Nouveau client créé.'
            }, status=201)
        return JsonResponse({'success': False, 'errors': serializer.errors}, status=400)


@swagger_auto_schema(method='post', request_body=CommandeSerializer)
@api_view(['GET', 'POST', 'DELETE'])
def commande_list(request):
    """
    GET → Liste les commandes
    POST → Crée une commande (client inclus)
    DELETE → Supprime toutes les commandes
    """
    if request.method == 'GET':
        commandes = Commande.objects.all()

        client_id = request.GET.get('id_client', None)
        statut = request.GET.get('statut', None)

        if client_id:
            commandes = commandes.filter(id_client=client_id)
        if statut:
            commandes = commandes.filter(statut__iexact=statut)

        serializer = CommandeSerializer(commandes, many=True)
        return JsonResponse({'success': True, 'data': serializer.data}, status=200)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        client_data = data.get('client', None)

        if not client_data:
            return JsonResponse({'success': False, 'message': 'Informations client manquantes.'}, status=400)

        # Étape 1 : Recherche ou création du client
        email = client_data.get('email')
        try:
            client = Client.objects.get(email=email)
        except Client.DoesNotExist:
            client_serializer = ClientSerializer(data=client_data)
            if client_serializer.is_valid():
                client = client_serializer.save()
            else:
                return JsonResponse({'success': False, 'errors': client_serializer.errors}, status=400)

        # Étape 2 : Attacher l'ID client à la commande
        data['id_client'] = client.id_client

        # Étape 3 : Création de la commande
        serializer = CommandeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'data': serializer.data}, status=201)

        return JsonResponse({'success': False, 'errors': serializer.errors}, status=400)

    elif request.method == 'DELETE':
        count = Commande.objects.all().delete()
        return JsonResponse({'message': f'{count[0]} commandes supprimées.'}, status=204)


@swagger_auto_schema(method='put', request_body=CommandeSerializer)  # type: ignore
@swagger_auto_schema(method='delete')  # type: ignore
@api_view(['GET', 'PUT', 'DELETE'])
def commande_detail(request, id_commande):
    try:
        commande = Commande.objects.get(id_commande=id_commande)
    except Commande.DoesNotExist:
        return JsonResponse({'message': 'Commande not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CommandeSerializer(commande)
        return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = CommandeSerializer(commande, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        commande.delete()
        return JsonResponse({'message': 'Commande deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
