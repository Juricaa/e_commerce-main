from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from produits.models import Produit
from produits.serializers import ProduitSerializer

from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(method='post', request_body=ProduitSerializer) # type: ignore
@api_view(['GET', 'POST', 'DELETE'])
def produit_list(request):
    # GET ALL
    if request.method == 'GET':
        produits = Produit.objects.all()
        lookup_field = 'id_produit' 
        
        name = request.GET.get('name', None)
        if name is not None:
            produits = produits.filter(name__icontains=name)
            
        location = request.GET.get('location', None)
        if location is not None:
            produits = produits.filter(location__icontains=location)
            
        type_heb = request.GET.get('type', None)
        if type_heb is not None:
            produits = produits.filter(type__iexact=type_heb)

        serializer = ProduitSerializer(produits, many=True)
        return JsonResponse(
                {
                    'success': True,
                    'data': serializer.data
                 
                 },status=status.HTTP_200_OK)

    # CREATE
    elif request.method == 'POST':
        serializer = ProduitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(
                {
                    'success': True,
                    'data': serializer.data

                 },status=status.HTTP_200_OK)
        print(serializer.errors)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE ALL
    elif request.method == 'DELETE':
        count = Produit.objects.all().delete()
        return JsonResponse(
            {'message': f'{count[0]} hroduits deleted successfully!'},
            status=status.HTTP_204_NO_CONTENT
        )
@swagger_auto_schema(method='put', request_body=ProduitSerializer, operation_description="Met à jour un client") # type: ignore
@swagger_auto_schema(method='delete', operation_description="Supprime un hebergment par ID") # type: ignore
@api_view(['GET', 'PUT', 'DELETE'])
def produit_detail(request, id_produit):
    try:
        produit = Produit.objects.get(id_produit=id_produit)
    except Produit.DoesNotExist:
        return JsonResponse(
            {'message': 'Hroduit not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    # GET ONE
    if request.method == 'GET':
        serializer = ProduitSerializer(produit)
        return JsonResponse(serializer.data)

    # UPDATE
    elif request.method == 'PUT':
        serializer = ProduitSerializer(produit, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
            {
                'success': True,
                'message': 'Hroduit deleted successfully!'
            }, 
            status=status.HTTP_200_OK
        )
            
        return Response(
            {
                'success': True,
                'errors': serializer.errors
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )
    # DELETE
    
    elif request.method == 'DELETE':
        produit.delete()
        return JsonResponse(
            {'message': 'Hroduit deleted successfully!'}, 
            status=status.HTTP_204_NO_CONTENT
        )