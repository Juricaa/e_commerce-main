from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser # type: ignore
from rest_framework import status # type: ignore
from rest_framework.decorators import api_view # type: ignore

from commande_produits.models import CommandeProduit, Commande, Produit
from commande_produits.serializers import CommandeProduitSerializer
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(method='post', request_body=CommandeProduitSerializer)
@api_view(['GET', 'POST', 'DELETE'])
def commande_produit_list(request):
    """
    GET : Liste tous les produits de toutes les commandes.
    POST : Crée un produit dans une commande.
    DELETE : Supprime tous les produits de commandes.
    """
    if request.method == 'GET':
        commande_produits = CommandeProduit.objects.all()

        # Filtrage optionnel
        id_commande = request.GET.get('id_commande', None)
        id_produit = request.GET.get('id_produit', None)

        if id_commande:
            commande_produits = commande_produits.filter(id_commande=id_commande)
        if id_produit:
            commande_produits = commande_produits.filter(id_produit=id_produit)

        serializer = CommandeProduitSerializer(commande_produits, many=True)
        return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = CommandeProduitSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        count = CommandeProduit.objects.all().delete()
        return JsonResponse({'message': f'{count[0]} commande_produits deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(method='put', request_body=CommandeProduitSerializer)
@swagger_auto_schema(method='delete')
@api_view(['GET', 'PUT', 'DELETE'])
def commande_produit_detail(request, pk):
    """
    GET : Récupère un produit spécifique d'une commande.
    PUT : Met à jour la quantité ou le prix.
    DELETE : Supprime un produit spécifique d'une commande.
    """
    try:
        commande_produit = CommandeProduit.objects.get(pk=pk)
    except CommandeProduit.DoesNotExist:
        return JsonResponse({'message': 'CommandeProduit not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CommandeProduitSerializer(commande_produit)
        return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = CommandeProduitSerializer(commande_produit, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        commande_produit.delete()
        return JsonResponse({'message': 'CommandeProduit deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)