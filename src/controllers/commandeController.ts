import { API_BASE_URL } from './baseUrl';
import type { Commande } from '../types/commande';

const COMMANDE_API_URL = `${API_BASE_URL}/commandes/`;

export interface ClientData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
}

export interface CreateCommandeData {
  client: ClientData;
  total: number;
  statut?: string;
}

/**
 * Récupère toutes les commandes avec filtres optionnels.
 */
export async function getAllCommandes(filters?: { 
  id_client?: string; 
  statut?: string;
}): Promise<{ success: boolean; data: Commande[] }> {
  const url = new URL(COMMANDE_API_URL);
  
  if (filters?.id_client) {
    url.searchParams.append('id_client/', filters.id_client);
  }
  if (filters?.statut) {
    url.searchParams.append('statut/', filters.statut);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Échec de la récupération des commandes : ${response.statusText}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la récupération des commandes');
  }
  
  return result;
}

/**
 * Récupère une commande par son ID.
 */
export async function getCommandeById(id: number): Promise<{ success: boolean; data: Commande }> {
  const response = await fetch(`${COMMANDE_API_URL}/${id}/`);
  if (!response.ok) {
    throw new Error(`Échec de la récupération de la commande ${id} : ${response.statusText}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error('Commande non trouvée');
  }
  
  return result;
}

/**
 * Crée une nouvelle commande.
 */
export async function createCommande(commandeData: CreateCommandeData): Promise<{ success: boolean; data: Commande }> {
  console.log("Payload de création de commande :", commandeData);
  
  const response = await fetch(COMMANDE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commandeData),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la création de la commande : ${errorDetail}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la création de la commande');
  }
  
  return result;
}

/**
 * Met à jour une commande existante.
 */
export async function updateCommande(id: number, updateData: Partial<Commande>): Promise<{ success: boolean; data: Commande }> {
  const response = await fetch(`${COMMANDE_API_URL}/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la mise à jour de la commande ${id} : ${errorDetail}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la mise à jour de la commande');
  }
  
  return result;
}

/**
 * Supprime une commande par son ID.
 */
export async function deleteCommande(id: number): Promise<void> {
  const response = await fetch(`${COMMANDE_API_URL}/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression de la commande ${id} : ${response.statusText}`);
  }
}

/**
 * Recherche ou crée un client par email.
 */
export async function getOrCreateClient(clientData: ClientData): Promise<{ 
  success: boolean; 
  id_client: string; 
  message: string;
}> {
  const response = await fetch(`${COMMANDE_API_URL}/client/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la recherche/création du client : ${errorDetail}`);
  }

  return response.json();
}