from django.urls import path
from . import services
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', services, basename='produit')

urlpatterns = [
    path('', services.produit_list),
    path('<str:id_produit>/', services.produit_detail),


]