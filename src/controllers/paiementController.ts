import { API_BASE_URL } from './baseUrl';
import type { Paiement, PaiementCreatePayload } from '../types/paiement';

const PAIEMENT_API_URL = `${API_BASE_URL}/paiements/`;

/**
 * Récupère tous les paiements.
 */
export async function getAllPaiements(): Promise<{ success: boolean; data: Paiement[] }> {
  const response = await fetch(PAIEMENT_API_URL);
  
  if (!response.ok) {
    throw new Error(`Échec de la récupération des paiements : ${response.statusText}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la récupération des paiements');
  }
  
  return result;
}

/**
 * Récupère un paiement par son ID.
 */
export async function getPaiementById(id: number): Promise<{ success: boolean; data: Paiement }> {
  const response = await fetch(`${PAIEMENT_API_URL}${id}/`);
  
  if (!response.ok) {
    throw new Error(`Échec de la récupération du paiement ${id} : ${response.statusText}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error('Paiement non trouvé');
  }
  
  return result;
}

/**
 * Crée un nouveau paiement.
 */
export async function createPaiement(payload: PaiementCreatePayload): Promise<{ success: boolean; data: Paiement }> {
  console.log("Payload de création de paiement :", payload);
  
  const response = await fetch(PAIEMENT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la création du paiement : ${errorDetail}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la création du paiement');
  }

  return result;
}

/**
 * Met à jour un paiement existant.
 */
export async function updatePaiement(id: number, updatedData: Partial<Paiement>): Promise<{ success: boolean; data: Paiement }> {
  const response = await fetch(`${PAIEMENT_API_URL}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la mise à jour du paiement ${id} : ${errorDetail}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error('Erreur lors de la mise à jour du paiement');
  }

  return result;
}

/**
 * Supprime un paiement.
 */
export async function deletePaiement(id: number): Promise<void> {
  const response = await fetch(`${PAIEMENT_API_URL}${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression du paiement ${id} : ${response.statusText}`);
  }
}

/**
 * Supprime tous les paiements.
 */
export async function deleteAllPaiements(): Promise<void> {
  const response = await fetch(PAIEMENT_API_URL, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression de tous les paiements : ${response.statusText}`);
  }
}