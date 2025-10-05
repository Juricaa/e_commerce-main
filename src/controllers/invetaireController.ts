import { API_BASE_URL } from './baseUrl';
import type { Inventory, InventoryCreatePayload } from '../types/inventaire';

const INVENTAIRE_API_URL = `${API_BASE_URL}/inventaires/`;

export interface InventaireFilters {
  id_produit?: string;
  mouvement?: 'ENTREE' | 'SORTIE';
  date_debut?: string;
  date_fin?: string;
}

// =======================================================
// READ : Récupérer tous les mouvements d'inventaire
// =======================================================
export async function getAllInventories(filters?: InventaireFilters): Promise<{ success: boolean; data: Inventory[] }> {
  const url = new URL(INVENTAIRE_API_URL);
  
  // Ajouter les filtres s'ils sont présents
  if (filters?.id_produit) {
    url.searchParams.append('id_produit', filters.id_produit);
  }
  if (filters?.mouvement) {
    url.searchParams.append('mouvement', filters.mouvement);
  }
  if (filters?.date_debut) {
    url.searchParams.append('date_debut', filters.date_debut);
  }
  if (filters?.date_fin) {
    url.searchParams.append('date_fin', filters.date_fin);
  }

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la récupération des inventaires');
    }

    return result;
  } catch (error) {
    console.error("Erreur lors de la récupération des inventaires:", error);
    throw error;
  }
}

// =======================================================
// READ : Récupérer un mouvement d'inventaire par ID
// =======================================================
export async function getInventoryById(id: number): Promise<{ success: boolean; data: Inventory }> {
  try {
    const response = await fetch(`${INVENTAIRE_API_URL}/${id}/`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'inventaire ${id}: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Inventaire non trouvé');
    }

    return result;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'inventaire ${id}:`, error);
    throw error;
  }
}

// =======================================================
// CREATE : Ajouter un nouveau mouvement
// =======================================================
export async function createInventory(newInventory: Omit<Inventory, 'id_inventaire'>): Promise<{ success: boolean; data: Inventory }> {
  console.log("Payload de création d'inventaire :", newInventory);
  
  try {
    const response = await fetch(INVENTAIRE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInventory),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Échec de la création de l'inventaire. Statut: ${response.status}. Détails: ${errorDetail}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la création de l\'inventaire');
    }

    return result;
  } catch (error) {
    console.error("Erreur lors de la création de l'inventaire:", error);
    throw error;
  }
}

// =======================================================
// UPDATE : Mettre à jour un mouvement existant
// =======================================================
export async function updateInventory(id: number, updatedData: Partial<Inventory>): Promise<{ success: boolean; data: Inventory }> {
  console.log("Mise à jour de l'inventaire", id, "avec les données:", updatedData);
  
  try {
    const response = await fetch(`${INVENTAIRE_API_URL}/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Échec de la mise à jour de l'inventaire ${id}. Statut: ${response.status}. Détails: ${errorDetail}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la mise à jour de l\'inventaire');
    }

    return result;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'inventaire ${id}:`, error);
    throw error;
  }
}

// =======================================================
// DELETE : Supprimer un mouvement
// =======================================================
export async function deleteInventory(id: number): Promise<void> {
  try {
    const response = await fetch(`${INVENTAIRE_API_URL}/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Échec de la suppression de l'inventaire ${id}. Statut: ${response.status}`);
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'inventaire ${id}:`, error);
    throw error;
  }
}

// =======================================================
// DELETE : Supprimer tous les mouvements d'inventaire
// =======================================================
export async function deleteAllInventories(): Promise<void> {
  try {
    const response = await fetch(INVENTAIRE_API_URL, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Échec de la suppression de tous les inventaires. Statut: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de tous les inventaires:", error);
    throw error;
  }
}

// =======================================================
// FONCTIONS SPÉCIALISÉES
// =======================================================

/**
 * Récupère les mouvements d'inventaire pour un produit spécifique
 */
export async function getInventoryByProduct(id_produit: string): Promise<{ success: boolean; data: Inventory[] }> {
  return getAllInventories({ id_produit });
}

/**
 * Récupère les entrées d'inventaire
 */
export async function getInventoryEntries(): Promise<{ success: boolean; data: Inventory[] }> {
  return getAllInventories({ mouvement: 'ENTREE' });
}

/**
 * Récupère les sorties d'inventaire
 */
export async function getInventoryExits(): Promise<{ success: boolean; data: Inventory[] }> {
  return getAllInventories({ mouvement: 'SORTIE' });
}

/**
 * Récupère les mouvements d'inventaire pour une période
 */
export async function getInventoryByDateRange(date_debut: string, date_fin: string): Promise<{ success: boolean; data: Inventory[] }> {
  return getAllInventories({ date_debut, date_fin });
}


export async function createInventoryEntryForNewProduct(
  id_produit: string, 
  quantite: number, 
  nom_produit: string
): Promise<{ success: boolean; data: any }> {
  
  const inventoryPayload: InventoryCreatePayload = {
    mouvement: 'ENTREE',
    quantite: quantite,
    id_produit: id_produit,
    commentaire: `Stock initial - ${nom_produit}`,
    date_mouvement: ''
  };

  return await createInventory(inventoryPayload);
}

/**
 * Crée un mouvement d'entrée en inventaire pour un réapprovisionnement
 */
export async function createInventoryEntryForStockUpdate(
  id_produit: string, 
  quantite_ajoutee: number, 
  ancien_stock: number,
  nouveau_stock: number,
  motif: string = 'Réapprovisionnement'
): Promise<{ success: boolean; data: any }> {
  
  const inventoryPayload: InventoryCreatePayload = {
    mouvement: 'ENTREE',
    quantite: quantite_ajoutee,
    id_produit: id_produit,
    commentaire: `${motif} - Stock: ${ancien_stock} → ${nouveau_stock} (+${quantite_ajoutee})`,
    date_mouvement: ''
  };

  return await createInventory(inventoryPayload);
}