from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser # type: ignore
from rest_framework import status # type: ignore
from rest_framework.decorators import api_view # type: ignore
from django.contrib.auth.hashers import make_password, check_password

from utilisateurs.models import Utilisateur
from utilisateurs.serializers import LoginSerializer, UtilisateurSerializer
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(method='post', request_body=UtilisateurSerializer, responses={201: UtilisateurSerializer})
@api_view(['GET', 'POST'])
def utilisateur_list(request):
    """
    Liste tous les utilisateurs ou crée un nouvel utilisateur (avec mot de passe haché)
    """
    if request.method == 'GET':
        utilisateurs = Utilisateur.objects.all()
        nom = request.GET.get('nom', None)
        if nom is not None:
            utilisateurs = utilisateurs.filter(nom__icontains=nom)

        serializer = UtilisateurSerializer(utilisateurs, many=True)
        return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        # Hachage du mot de passe avant enregistrement
        if 'mot_de_passe' in data:
            data['mot_de_passe'] = make_password(data['mot_de_passe'])
        serializer = UtilisateurSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method='put', request_body=UtilisateurSerializer, operation_description="Met à jour un utilisateur")
@swagger_auto_schema(method='delete', operation_description="Supprime un utilisateur par ID")
@api_view(['GET', 'PUT', 'DELETE'])
def utilisateur_detail(request, id_utilisateur):
    """
    Récupère, met à jour ou supprime un utilisateur
    """
    try:
        utilisateur = Utilisateur.objects.get(id_utilisateur=id_utilisateur)
    except Utilisateur.DoesNotExist:
        return JsonResponse({'message': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UtilisateurSerializer(utilisateur)
        return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        # Si le mot de passe est modifié, on le re-hache
        if 'mot_de_passe' in data:
            data['mot_de_passe'] = make_password(data['mot_de_passe'])
        serializer = UtilisateurSerializer(utilisateur, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        utilisateur.delete()
        return JsonResponse({'message': 'Utilisateur supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(method='post', request_body=LoginSerializer, responses={200: UtilisateurSerializer})
@api_view(['POST'])
def utilisateur_login(request):
    """
    Authentifie un utilisateur (vérifie email et mot de passe)
    """
    try:
        data = JSONParser().parse(request)
        
        # Valider les données avec le LoginSerializer
        login_serializer = LoginSerializer(data=data)
        if not login_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'message': 'Données invalides',
                'errors': login_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        email = login_serializer.validated_data['email']
        mot_de_passe = login_serializer.validated_data['mot_de_passe']

        utilisateur = Utilisateur.objects.get(email=email)
        if check_password(mot_de_passe, utilisateur.mot_de_passe):
            # Utiliser le UtilisateurSerializer pour la réponse
            serializer = UtilisateurSerializer(utilisateur)
            return JsonResponse({
                'success': True, 
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return JsonResponse({
                'success': False, 
                'message': 'Mot de passe incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Utilisateur.DoesNotExist:
        return JsonResponse({
            'success': False, 
            'message': 'Utilisateur introuvable'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'message': f'Erreur serveur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)