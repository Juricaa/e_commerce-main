import { API_BASE_URL } from './baseUrl';
import type { Inventory } from '../types/inventaire'; // Assurez-vous que le chemin vers votre type est correct

const INVENTAIRE_API_URL = `${API_BASE_URL}/inventaires`;

// =======================================================
// READ : Récupérer tous les mouvements d'inventaire (GET /api/inventaires)
// =======================================================
export async function getAllInventories(): Promise<Inventory[]> {
  try {
    const response = await fetch(INVENTAIRE_API_URL);
    
    if (!response.ok) {
      // Gérer les erreurs HTTP (ex: 404, 500)
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data: Inventory[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des inventaires:", error);
    // Optionnel: lancer une erreur plus spécifique ou retourner un tableau vide
    return []; 
  }
}

// =======================================================
// READ : Récupérer un mouvement d'inventaire par ID (GET /api/inventaires/{id})
// =======================================================
export async function getInventoryById(id: number): Promise<Inventory> {
  try {
    const response = await fetch(`${INVENTAIRE_API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'inventaire ${id}: ${response.statusText}`);
    }

    const data: Inventory = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'inventaire ${id}:`, error);
    throw error; // Renvoyer l'erreur pour la gestion côté composant
  }
}


// =======================================================
// CREATE : Ajouter un nouveau mouvement (POST /api/inventaires)
// =======================================================
export async function createInventory(newInventory: Omit<Inventory, 'idInventaire'>): Promise<Inventory> {
  try {
    const response = await fetch(INVENTAIRE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez ici votre jeton d'authentification si nécessaire (Authorization: Bearer ...)
      },
      body: JSON.stringify(newInventory),
    });

    if (!response.ok) {
      // Tenter de lire le message d'erreur du backend
      const errorDetail = await response.text();
      throw new Error(`Échec de la création de l'inventaire. Statut: ${response.status}. Détails: ${errorDetail}`);
    }

    // Le backend renvoie généralement l'objet créé avec l'ID
    const createdInventory: Inventory = await response.json();
    return createdInventory;
  } catch (error) {
    console.error("Erreur lors de la création de l'inventaire:", error);
    throw error;
  }
}

// =======================================================
// UPDATE : Mettre à jour un mouvement existant (PUT /api/inventaires/{id})
// =======================================================
export async function updateInventory(id: number, updatedData: Partial<Inventory>): Promise<Inventory> {
  try {
    const response = await fetch(`${INVENTAIRE_API_URL}/${id}`, {
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

    // Le backend renvoie souvent l'objet mis à jour
    const updatedInventory: Inventory = await response.json();
    return updatedInventory;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'inventaire ${id}:`, error);
    throw error;
  }
}

// =======================================================
// DELETE : Supprimer un mouvement (DELETE /api/inventaires/{id})
// =======================================================
export async function deleteInventory(id: number): Promise<void> {
  try {
    const response = await fetch(`${INVENTAIRE_API_URL}/${id}`, {
      method: 'DELETE',
      // Les headers ne sont pas toujours nécessaires pour DELETE, mais peuvent l'être pour l'authentification
    });

    if (!response.ok) {
      throw new Error(`Échec de la suppression de l'inventaire ${id}. Statut: ${response.status}`);
    }
    // Si la suppression réussit, la fonction ne retourne rien (void)
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'inventaire ${id}:`, error);
    throw error;
  }
}