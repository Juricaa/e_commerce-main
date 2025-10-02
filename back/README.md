# Supermarché en Ligne - Backend Spring Boot

Ce projet est une application backend Spring Boot pour la gestion d'un supermarché en ligne avec une base de données PostgreSQL.

## Fonctionnalités principales
- Gestion des clients, produits, commandes, paiements, inventaire
- API REST CRUD pour chaque entité
- Documentation Swagger UI accessible à `/swagger-ui.html`
- Relations JPA complètes et utilisation de Lombok

## Démarrage rapide

1. **Configurer PostgreSQL**
   - Créez une base de données nommée `supermarche_en_ligne`.
   - Modifiez le fichier `src/main/resources/application.properties` si besoin (utilisateur/mot de passe).

2. **Construire et lancer l'application**
   ```shell
   mvn clean install
   mvn spring-boot:run
   ```

3. **Accéder à l'API**
   - Swagger UI : [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Structure des entités
- `Client`, `Produit`, `Commande`, `CommandeProduit`, `Paiement`, `Inventaire`
- Relations JPA et enums pour les statuts et mouvements

## Dépendances principales
- Spring Boot, Spring Data JPA, PostgreSQL, Lombok, Springdoc OpenAPI

## Auteur
- Généré automatiquement
