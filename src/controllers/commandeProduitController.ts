import { API_BASE_URL } from './baseUrl';
import type { CommandeProduit, CommandeProduitCreatePayload } from '../types/commandeProduit'; 

const COMMANDE_PRODUIT_API_URL = `${API_BASE_URL}/commande-produits`;

export interface CommandeProduitFilters {
  id_commande?: number;
  id_produit?: number;
}

// =======================================================
// READ : Récupérer toutes les lignes de commande avec filtres optionnels
// =======================================================
export async function getAllCommandeProduits(filters?: CommandeProduitFilters): Promise<{ success: boolean; data: CommandeProduit[] }> {
  const url = new URL(COMMANDE_PRODUIT_API_URL);
  
  // Ajouter les filtres s'ils sont présents
  if (filters?.id_commande) {
    url.searchParams.append('id_commande', filters.id_commande.toString());
  }
  if (filters?.id_produit) {
    url.searchParams.append('id_produit', filters.id_produit.toString());
  }

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Échec de la récupération des lignes de commande : ${response.statusText}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la récupération des lignes de commande');
  }
  
  return result;
}

// =======================================================
// READ : Récupérer une ligne de commande par son ID (clé primaire)
// =======================================================
export async function getCommandeProduitById(id: number): Promise<{ success: boolean; data: CommandeProduit }> {
  const url = `${COMMANDE_PRODUIT_API_URL}/${id}/`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Échec de la récupération de la ligne ${id} : ${response.statusText}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error('Ligne de commande non trouvée');
  }
  
  return result;
}

// =======================================================
// CREATE : Ajouter une nouvelle ligne
// =======================================================
export async function createCommandeProduit(payload: CommandeProduitCreatePayload): Promise<{ success: boolean; data: CommandeProduit }> {
  console.log("Payload de création de commande produit :", payload);
  
  const response = await fetch(COMMANDE_PRODUIT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la création de la ligne de produit : ${errorDetail}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la création de la ligne de commande');
  }

  return result;
}

// =======================================================
// UPDATE : Mettre à jour une ligne existante par son ID
// =======================================================
export async function updateCommandeProduit(id: number, updatedData: Partial<CommandeProduit>): Promise<{ success: boolean; data: CommandeProduit }> {
  const url = `${COMMANDE_PRODUIT_API_URL}/${id}/`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la mise à jour de la ligne ${id} : ${errorDetail}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la mise à jour de la ligne de commande');
  }

  return result;
}

// =======================================================
// DELETE : Supprimer une ligne par son ID
// =======================================================
export async function deleteCommandeProduit(id: number): Promise<void> {
  const url = `${COMMANDE_PRODUIT_API_URL}/${id}/`;
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression de la ligne ${id} : ${response.statusText}`);
  }
}

// =======================================================
// DELETE : Supprimer toutes les lignes de commande
// =======================================================
export async function deleteAllCommandeProduits(): Promise<void> {
  const response = await fetch(COMMANDE_PRODUIT_API_URL, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression de toutes les lignes : ${response.statusText}`);
  }
}