import { API_BASE_URL } from './baseUrl'; // Assurez-vous que ce chemin est correct

// Définition du type Product basé sur votre code front-end
import type { Product } from '../types/produit'; // Assurez-vous que le chemin est correct

// Type pour la création d'un produit (pas d'ID, la dateAjout est gérée par le back-end ou le front-end)
export type NewProductData = Omit<Product, 'idProduit' | 'dateAjout'>;

// Type pour la mise à jour d'un produit (tous les champs sont optionnels)
export type UpdateProductData = Partial<Product>;



/**
 * Récupère la liste complète des produits depuis l'API.
 * @returns Promesse résolue avec la liste des Product, ou une liste vide en cas d'erreur.
 */
export async function getAllProducts(): Promise<Product[]> {
    const url = `${API_BASE_URL}/produits`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // Jeton si nécessaire
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur API lors de la récupération des produits: ${response.status}`);
        }

        const data: Product[] = await response.json();
        return data;

    } catch (error) {
        console.error("Erreur réseau ou API lors de la récupération de la liste des produits:", error);
        return [];
    }
}

/**
 * Crée un nouveau produit via l'API (POST).
 * @param productData Les données du nouveau produit.
 * @returns Promesse résolue avec l'objet Product créé, ou null en cas d'échec.
 */
export async function createProduct(productData: NewProductData): Promise<Product | null> {
    const url = `${API_BASE_URL}/produits`;
    try {
        const payloadWithDate = {
            ...productData,
            // Assurez-vous d'envoyer la date d'ajout correctement formatée si l'API l'exige
            dateAjout: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadWithDate)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erreur API lors de la création du produit: ${response.status} - ${errorBody.message || response.statusText}`);
        }

        const newProduct: Product = await response.json();
        return newProduct;

    } catch (error) {
        console.error("Erreur réseau ou API lors de la création du produit:", error);
        return null;
    }
}

/**
 * Met à jour un produit existant via l'API (PUT).
 * @param idProduit L'ID du produit à mettre à jour.
 * @param productData Les données partielles du produit à mettre à jour.
 * @returns Promesse résolue avec l'objet Product mis à jour, ou null en cas d'échec.
 */
export async function updateProduct(idProduit: number, productData: UpdateProductData): Promise<Product | null> {
    const url = `${API_BASE_URL}/produits/${idProduit}`;
    console.log("Updating product with data:", productData); // Log pour débogage
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error(`Erreur API lors de la mise à jour du produit: ${response.status}`);
        }

        const updatedProduct: Product = await response.json();
        return updatedProduct;

    } catch (error) {
        console.error(`Erreur réseau ou API lors de la mise à jour du produit ${idProduit}:`, error);
        return null;
    }
}


/**
 * Supprime un produit via l'API (DELETE).
 * @param idProduit L'ID du produit à supprimer.
 * @returns Promesse résolue à true si la suppression réussit, false sinon.
 */
export async function deleteProduct(idProduit: number): Promise<boolean> {
    const url = `${API_BASE_URL}/produits/${idProduit}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            // headers: { 'Authorization': `Bearer ${token}` } // Jeton si nécessaire
        });

        if (response.status === 204 || response.ok) {
            return true;
        }

        throw new Error(`Erreur API lors de la suppression du produit: ${response.status}`);

    } catch (error) {
        console.error(`Erreur réseau ou API lors de la suppression du produit ${idProduit}:`, error);
        return false;
    }
}