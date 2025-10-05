import { API_BASE_URL } from './baseUrl';
import type { Produit } from '../types/produit';

const PRODUIT_API_URL = `${API_BASE_URL}/produits/`;

export interface ProduitFilters {
  nom_produit?: string;
  categorie?: string;
}

export type NewProductData = Omit<Produit, 'id_produit' | 'date_ajout'>;
export type UpdateProductData = Partial<Produit>;

/**
 * Récupère la liste complète des produits depuis l'API.
 */
export async function getAllProducts(filters?: ProduitFilters): Promise<{ success: boolean; data: Produit[] }> {
  const url = new URL(PRODUIT_API_URL);
  
  // Ajouter les filtres s'ils sont présents
  if (filters?.nom_produit) {
    url.searchParams.append('name/', filters.nom_produit);
  }
  if (filters?.categorie) {
    url.searchParams.append('type/', filters.categorie);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API lors de la récupération des produits: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la récupération des produits');
    }

    return result;

  } catch (error) {
    console.error("Erreur réseau ou API lors de la récupération de la liste des produits:", error);
    throw error;
  }
}

/**
 * Récupère un produit par son ID.
 */
export async function getProductById(id: string): Promise<{ success: boolean; data: Produit }> {
  const url = `${PRODUIT_API_URL}/${id}/`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API lors de la récupération du produit: ${response.status}`);
    }

    const produit = await response.json();
    return { success: true, data: produit };

  } catch (error) {
    console.error(`Erreur réseau ou API lors de la récupération du produit ${id}:`, error);
    throw error;
  }
}

/**
 * Crée un nouveau produit via l'API (POST).
 */
export async function createProduct(productData: NewProductData): Promise<{ success: boolean; data: Produit }> {
  console.log("Payload de création de produit :", productData);
  
  try {
    const response = await fetch(PRODUIT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Erreur API lors de la création du produit: ${response.status} - ${JSON.stringify(errorBody)}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la création du produit');
    }

    return result;

  } catch (error) {
    console.error("Erreur réseau ou API lors de la création du produit:", error);
    throw error;
  }
}

/**
 * Met à jour un produit existant via l'API (PUT).
 */
export async function updateProduct(idProduit: string, productData: UpdateProductData): Promise<{ success: boolean; data: Produit }> {
  const url = `${PRODUIT_API_URL}/${idProduit}/`;
  console.log("Updating product with data:", productData);
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      throw new Error(`Erreur API lors de la mise à jour du produit: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la mise à jour du produit');
    }

    return result;

  } catch (error) {
    console.error(`Erreur réseau ou API lors de la mise à jour du produit ${idProduit}:`, error);
    throw error;
  }
}

/**
 * Supprime un produit via l'API (DELETE).
 */
export async function deleteProduct(idProduit: string): Promise<void> {
  const url = `${PRODUIT_API_URL}/${idProduit}/`;
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Erreur API lors de la suppression du produit: ${response.status}`);
    }

  } catch (error) {
    console.error(`Erreur réseau ou API lors de la suppression du produit ${idProduit}:`, error);
    throw error;
  }
}

/**
 * Supprime tous les produits.
 */
export async function deleteAllProducts(): Promise<void> {
  try {
    const response = await fetch(PRODUIT_API_URL, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Erreur API lors de la suppression de tous les produits: ${response.status}`);
    }

  } catch (error) {
    console.error("Erreur réseau ou API lors de la suppression de tous les produits:", error);
    throw error;
  }
}

/**
 * Récupère les produits par catégorie.
 */
export async function getProductsByCategory(categorie: string): Promise<{ success: boolean; data: Produit[] }> {
  return getAllProducts({ categorie });
}

/**
 * Récupère les produits par nom (recherche).
 */
export async function searchProductsByName(nom_produit: string): Promise<{ success: boolean; data: Produit[] }> {
  return getAllProducts({ nom_produit });
}

/**
 * Récupère les produits par catégorie et nom.
 */
export async function searchProducts(categorie?: string, nom_produit?: string): Promise<{ success: boolean; data: Produit[] }> {
  return getAllProducts({ categorie, nom_produit });
}