from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from paiements.models import Paiement
from paiements.serializers import PaiementSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import JSONParser

@swagger_auto_schema(method='post', request_body=PaiementSerializer)
@api_view(['GET', 'POST', 'DELETE'])
def paiement_list(request):
    if request.method == 'GET':
        paiements = Paiement.objects.all()
        serializer = PaiementSerializer(paiements, many=True)
        return Response({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = PaiementSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        count = Paiement.objects.all().delete()
        return Response({'message': f'{count[0]} paiements deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

@swagger_auto_schema(method='put', request_body=PaiementSerializer)
@api_view(['GET', 'PUT', 'DELETE'])
def paiement_detail(request, id_paiement):
    try:
        paiement = Paiement.objects.get(id_paiement=id_paiement)
    except Paiement.DoesNotExist:
        return Response({'message': 'Paiement not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PaiementSerializer(paiement)
        return Response({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = PaiementSerializer(paiement, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        paiement.delete()
        return Response({'message': 'Paiement deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
