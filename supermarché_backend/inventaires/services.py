from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from inventaires.models import Inventaire
from inventaires.serializers import InventaireSerializer

@swagger_auto_schema(method='post', request_body=InventaireSerializer)
@api_view(['GET', 'POST', 'DELETE'])
def inventaire_list(request):
    if request.method == 'GET':
        inventaires = Inventaire.objects.all()
        serializer = InventaireSerializer(inventaires, many=True)
        return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = InventaireSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        count = Inventaire.objects.all().delete()
        return JsonResponse({'message': f'{count[0]} inventaires deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(method='put', request_body=InventaireSerializer)
@swagger_auto_schema(method='delete')
@api_view(['GET', 'PUT', 'DELETE'])
def inventaire_detail(request, pk):
    try:
        inventaire = Inventaire.objects.get(pk=pk)
    except Inventaire.DoesNotExist:
        return JsonResponse({'message': 'Inventaire not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InventaireSerializer(inventaire)
        return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = InventaireSerializer(inventaire, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        inventaire.delete()
        return JsonResponse({'message': 'Inventaire deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
