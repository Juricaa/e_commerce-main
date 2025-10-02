import { API_BASE_URL } from './baseUrl'; 
import type { User } from "../types/user"; 


/**
 * Récupère la liste complète des clients depuis l'API.
 * @returns Promesse résolue avec la liste des User, ou une liste vide en cas d'erreur.
 */
export async function getAllClients(): Promise<User[]> {
    const url = `${API_BASE_URL}/clients`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Ajoutez ici l'en-tête d'autorisation (Bearer Token) si nécessaire
                // 'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur API lors de la récupération des clients: ${response.status}`);
        }

        const data: User[] = await response.json();
        return data;

    } catch (error) {
        console.error("Erreur réseau ou API lors de la récupération de la liste des clients:", error);
        return [];
    }
}


type NewClientData = Omit<User, 'idClient' | 'date_inscription' | 'commandes'> & { password: string };

/**
 * Crée un nouveau client via l'API (POST).
 * @param clientData Les données du nouveau client, y compris un mot de passe.
 * @returns Promesse résolue avec l'objet User créé (avec son nouvel idClient), ou null en cas d'échec.
 */
export async function createClient(clientData: NewClientData): Promise<User | null> {
    const url = `${API_BASE_URL}/clients`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Ajoutez ici l'en-tête d'autorisation (Bearer Token) si nécessaire
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) {
            // L'API peut renvoyer 400 pour des données invalides (ex: email déjà utilisé)
            const errorBody = await response.json();
            throw new Error(`Erreur API lors de la création du client: ${response.status} - ${errorBody.message || response.statusText}`);
        }

        const newClient: User = await response.json();
        return newClient;

    } catch (error) {
        console.error("Erreur réseau ou API lors de la création du client:", error);
        return null;
    }
}

type UpdateClientData = Partial<NewClientData>;

/**
 * Met à jour un client existant via l'API (PUT).
 * @param idClient L'ID du client à mettre à jour.
 * @param clientData Les données partielles du client à mettre à jour.
 * @returns Promesse résolue avec l'objet User mis à jour, ou null en cas d'échec.
 */
export async function updateClient(idClient: number, clientData: UpdateClientData): Promise<User | null> {
    const url = `${API_BASE_URL}/clients/${idClient}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Ajoutez ici l'en-tête d'autorisation (Bearer Token) si nécessaire
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) {
            throw new Error(`Erreur API lors de la mise à jour du client: ${response.status}`);
        }

        // L'API devrait idéalement retourner l'objet mis à jour
        const updatedClient: User = await response.json();
        return updatedClient;

    } catch (error) {
        console.error(`Erreur réseau ou API lors de la mise à jour du client ${idClient}:`, error);
        return null;
    }
}


/**
 * Supprime un client via l'API (DELETE).
 * @param idClient L'ID du client à supprimer.
 * @returns Promesse résolue à true si la suppression réussit, false sinon.
 */
export async function deleteClient(idClient: number): Promise<boolean> {
    const url = `${API_BASE_URL}/clients/${idClient}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                // Ajoutez ici l'en-tête d'autorisation (Bearer Token) si nécessaire
            }
        });

        if (response.status === 204 || response.ok) {
            // 204 No Content est la réponse DELETE standard
            return true;
        }

        throw new Error(`Erreur API lors de la suppression du client: ${response.status}`);

    } catch (error) {
        console.error(`Erreur réseau ou API lors de la suppression du client ${idClient}:`, error);
        return false;
    }
}