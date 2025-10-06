import { API_BASE_URL } from './baseUrl';
import type { Produit } from '../types/produit';
import { createInventoryEntryForNewProduct, createInventoryEntryForStockUpdate } from './invetaireController';

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
export async function getProductById(id: string | number): Promise<{ success: boolean; data: Produit }> {
  const url = `${PRODUIT_API_URL}${id}/`;
  
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
export async function createProduct(productData: NewProductData | FormData): Promise<{ success: boolean; data: Produit }> {
  console.log("Payload de création de produit :", productData);

  try {
    let headers: Record<string, string> = {};
    let body: string | FormData;

    if (productData instanceof FormData) {
      // For file uploads, don't set Content-Type header - let browser set it with boundary
      body = productData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(productData);
    }

    const response = await fetch(PRODUIT_API_URL, {
      method: 'POST',
      headers,
      body
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
export async function updateProduct(idProduit: string | number, productData: UpdateProductData): Promise<{ success: boolean; data: Produit }> {
  const url = `${PRODUIT_API_URL}${idProduit}/`;
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
export async function deleteProduct(idProduit: string | number): Promise<void> {
  const url = `${PRODUIT_API_URL}${idProduit}/`;
  
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

export async function createProductWithInventory(productData: NewProductData): Promise<{ success: boolean; data: Produit }> {
  console.log("Création de produit avec inventaire :", productData);
  
  try {
    // 1. Créer le produit
    const result = await createProduct(productData);
    
    // 2. Créer le mouvement d'inventaire pour le stock initial
    if (result.success && productData.stock > 0) {
      await createInventoryEntryForNewProduct(
        result.data.id_produit,
        productData.stock,
        productData.nom_produit
      );
    }
    
    return result;
    
  } catch (error) {
    console.error("Erreur lors de la création du produit avec inventaire:", error);
    throw error;
  }
}

/**
 * Met à jour un produit avec gestion d'inventaire pour les changements de stock
 */
export async function updateProductWithInventory(
  idProduit: string | number,
  productData: UpdateProductData,
  ancienProduit?: Produit
): Promise<{ success: boolean; data: Produit }> {
  console.log("Mise à jour de produit avec inventaire:", { idProduit, productData, ancienProduit });
  
  try {
    // Si on a l'ancien produit et qu'on modifie le stock
    if (ancienProduit && productData.stock !== undefined && productData.stock !== ancienProduit.stock) {
      const difference = productData.stock - ancienProduit.stock;
      
      if (difference > 0) {
        // Stock augmenté = entrée en inventaire
        await createInventoryEntryForStockUpdate(
          idProduit,
          difference,
          ancienProduit.stock,
          productData.stock,
          'Réapprovisionnement stock'
        );
      }
      // Note: Si différence < 0 (stock diminué), on ne crée pas de mouvement SORTIE
      // car les sorties sont gérées par les commandes
    }
    
    // Mettre à jour le produit
    return await updateProduct(idProduit, productData);
    
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit ${idProduit} avec inventaire:`, error);
    throw error;
  }
}

/**
 * Fonction utilitaire pour récupérer un produit avant mise à jour
 */
export async function getProductAndUpdateWithInventory(
  idProduit: string | number,
  productData: UpdateProductData
): Promise<{ success: boolean; data: Produit }> {
  
  try {
    // Récupérer l'ancien produit
    const ancienProduitResult = await getProductById(idProduit);
    
    // Mettre à jour avec gestion d'inventaire
    return await updateProductWithInventory(
      idProduit, 
      productData, 
      ancienProduitResult.data
    );
    
  } catch (error) {
    console.error(`Erreur lors de la mise à jour avec inventaire pour ${idProduit}:`, error);
    throw error;
  }
}

/**
 * Réapprovisionne un produit avec mouvement d'inventaire
 */
export async function restockProduct(
  idProduit: string | number,
  quantiteAjoutee: number,
  motif: string = 'Réapprovisionnement manuel'
): Promise<{ success: boolean; data: Produit }> {
  
  try {
    // 1. Récupérer le produit actuel
    const produitActuel = await getProductById(idProduit);
    const ancienStock = produitActuel.data.stock;
    const nouveauStock = ancienStock + quantiteAjoutee;
    
    // 2. Créer le mouvement d'inventaire
    await createInventoryEntryForStockUpdate(
      idProduit,
      quantiteAjoutee,
      ancienStock,
      nouveauStock,
      motif
    );
    
    // 3. Mettre à jour le stock du produit
    return await updateProduct(idProduit, {
      stock: nouveauStock
    });
    
  } catch (error) {
    console.error(`Erreur lors du réapprovisionnement du produit ${idProduit}:`, error);
    throw error;
  }
}