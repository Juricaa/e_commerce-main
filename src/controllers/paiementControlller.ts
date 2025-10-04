import { API_BASE_URL } from './baseUrl';
import type { Paiement, PaiementCreatePayload } from '../types/paiement';

const PAIEMENT_API_URL = `${API_BASE_URL}/paiements`;

/**
 * Récupère un paiement par son ID.
 */
export async function getPaiementById(id: number): Promise<Paiement> {
  const response = await fetch(`${PAIEMENT_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Échec de la récupération du paiement ${id} : ${response.statusText}`);
  }
  return response.json();
}

/**
 * Crée un nouveau paiement.
 * (Souvent utilisé pour enregistrer une transaction après le processus de paiement externe)
 */
export async function createPaiement(payload: PaiementCreatePayload): Promise<Paiement> {
  const response = await fetch(PAIEMENT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la création du paiement : ${errorDetail}`);
  }

  return response.json();
}

/**
 * Met à jour un paiement existant (utile pour changer le statut, ex: de 'EN_COURS' à 'REUSSI').
 */
export async function updatePaiement(id: number, updatedData: Partial<Paiement>): Promise<Paiement> {
  const response = await fetch(`${PAIEMENT_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Échec de la mise à jour du paiement ${id} : ${errorDetail}`);
  }

  return response.json();
}

/**
 * Supprime un paiement.
 */
export async function deletePaiement(id: number): Promise<void> {
  const response = await fetch(`${PAIEMENT_API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression du paiement ${id} : ${response.statusText}`);
  }
}