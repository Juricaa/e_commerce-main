import { API_BASE_URL } from './baseUrl';
import type { Commande, CommandeCreatePayload } from '../types/commande'; 

const COMMANDE_API_URL = `${API_BASE_URL}/commandes`;

/**
 * Récupère toutes les commandes.
 */
export async function getAllCommandes(): Promise<Commande[]> {
  const response = await fetch(COMMANDE_API_URL);
  if (!response.ok) {
    throw new Error(`Échec de la récupération des commandes : ${response.statusText}`);
  }
  return response.json();
}

/**
 * Récupère une commande par son ID.
 */
export async function getCommandeById(id: number): Promise<Commande> {
  const response = await fetch(`${COMMANDE_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Échec de la récupération de la commande ${id} : ${response.statusText}`);
  }
  return response.json();
}

/**
 * Crée une nouvelle commande.
 */
export async function createCommande(payload: CommandeCreatePayload): Promise<Commande> {
    console.log("Payload de création de commande :", payload); // Log du payload envoyé
    const response = await fetch(COMMANDE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la création de la commande : ${errorDetail}`);
  }

  return response.json(); // Retourne l'objet Commande créé avec son ID
}

/**
 * Supprime une commande par son ID.
 */
export async function deleteCommande(id: number): Promise<void> {
  const response = await fetch(`${COMMANDE_API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression de la commande ${id} : ${response.statusText}`);
  }
}