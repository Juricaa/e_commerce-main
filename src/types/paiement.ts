import type { Commande } from './commande';

export type StatutPaiement = 
'EN_ATTENTE' | 'REUSSI' | 'ECHOUE' | 'REMBOURSE'; 
   
export type Paiement = {
  /**
   * L'identifiant unique du paiement (Long dans le backend devient number en TS).
   */
  idPaiement: number;

  /**
   * L'objet Commande auquel ce paiement est lié (relation ManyToOne).
   * Note : L'API peut envoyer l'objet Commande complet ou juste son ID.
   * Nous utilisons ici l'objet complet pour rester fidèle à la structure JPA.
   */
  commande: Commande; 

  /**
   * Le montant payé.
   */
  montant: number;

  /**
   * La méthode utilisée pour le paiement (ex: "CARTE", "PAYPAL", "VIREMENT").
   */
  methodePaiement: string;

  /**
   * Le statut actuel du paiement (ex: 'REUSSI', 'ECHOUE').
   */
  statutPaiement: StatutPaiement;

  /**
   * La date à laquelle le paiement a été effectué (LocalDate dans le backend, string ISO en TS).
   * Format: "YYYY-MM-DD"
   */
  datePaiement: string;
};

export type PaiementCreatePayload = {
  /** Le montant à payer. */
  idCommande: number; // L'ID de la commande associée
  montant: number;
  /** La méthode de paiement utilisée (ex: "CARTE", "VIREMENT"). */
  methodePaiement: string;
  /** Le statut initial du paiement (ex: 'EN_COURS' ou 'REUSSI'). */
  statutPaiement: StatutPaiement;
  // La date de paiement peut être omise si le backend utilise CURRENT_TIMESTAMP
  datePaiement?: string; // Format: "YYYY-MM-DD"
};