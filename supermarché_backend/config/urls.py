from django.urls import path, include
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Configuration de la documentation Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="API e-commerce",
        default_version='v1',
        description="Documentation interactive de l'API TourOp",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="support@tour-op.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [ 

       path('api/produits/', include('produits.urls')),
       path('api/commandes/', include('commande.urls')),
       path('api/commande-produits/', include('commande_produits.urls')),
       path('api/inventaires/', include('inventaires.urls')),
       path('api/paiements/', include('paiements.urls')),
       path('api/utilisateurs/', include('utilisateurs.urls')),
       path('api/clients/', include('clients.urls')),

       re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'), # type: ignore
       path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), # type: ignore
       path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'), # type: ignore
]
