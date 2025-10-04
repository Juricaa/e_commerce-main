import { API_BASE_URL } from './baseUrl';
import type { CommandeProduit, CommandeProduitCreatePayload } from '../types/commandeProduit'; 

const COMMANDE_PRODUIT_API_URL = `${API_BASE_URL}/commande-produits`;

// =======================================================
// READ : Récupérer toutes les lignes de commande (GET /api/commande-produits)
// =======================================================
export async function getAllCommandeProduits(): Promise<CommandeProduit[]> {
  const response = await fetch(COMMANDE_PRODUIT_API_URL);
  
  if (!response.ok) {
    throw new Error(`Échec de la récupération des lignes de commande : ${response.statusText}`);
  }
  return response.json();
}

// =======================================================
// READ : Récupérer une ligne de commande par clé composée (GET /api/commande-produits/commande/{commandeId}/produit/{produitId})
// =======================================================
export async function getCommandeProduitByIds(commandeId: number, produitId: number): Promise<CommandeProduit> {
  const url = `${COMMANDE_PRODUIT_API_URL}/commande/${commandeId}/produit/${produitId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Échec de la récupération de la ligne (${commandeId}, ${produitId}) : ${response.statusText}`);
  }
  return response.json();
}

// =======================================================
// CREATE : Ajouter une nouvelle ligne (POST /api/commande-produits)
// =======================================================
// Nous utilisons ici le type Payload qui contient les IDs nécessaires (idCommande, idProduit, etc.)
export async function createCommandeProduit(payload: CommandeProduitCreatePayload): Promise<CommandeProduit> {
  const response = await fetch(COMMANDE_PRODUIT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la création de la ligne de produit : ${errorDetail}`);
  }

  return response.json(); // Retourne l'objet CommandeProduit créé
}

// =======================================================
// UPDATE : Mettre à jour une ligne existante (PUT /api/commande-produits/commande/{commandeId}/produit/{produitId})
// =======================================================
// On utilise 'Partial' car on n'a besoin que des champs à modifier (quantite, prixUnitaire)
export async function updateCommandeProduit(commandeId: number, produitId: number, updatedData: Partial<CommandeProduit>): Promise<CommandeProduit> {
  const url = `${COMMANDE_PRODUIT_API_URL}/commande/${commandeId}/produit/${produitId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la mise à jour de la ligne (${commandeId}, ${produitId}) : ${errorDetail}`);
  }

  return response.json();
}

// =======================================================
// DELETE : Supprimer une ligne par clé composée (DELETE /api/commande-produits/commande/{commandeId}/produit/{produitId})
// =======================================================
export async function deleteCommandeProduit(commandeId: number, produitId: number): Promise<void> {
  const url = `${COMMANDE_PRODUIT_API_URL}/commande/${commandeId}/produit/${produitId}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression de la ligne (${commandeId}, ${produitId}) : ${response.statusText}`);
  }
  // Si la suppression réussit, la fonction ne retourne rien (void)
}