// types/paiement.ts
export type StatutPaiement = 'en attente' | 'effectué' | 'échoué' | 'remboursé';

export interface Paiement {
  id_paiement: number;
  montant: number;
  methode_paiement: string;
  statut_paiement: StatutPaiement;
  date_paiement: string;
  id_commande: number;
  
  // Champs optionnels pour les données liées (si votre serializer les inclut)
  commande_details?: {
    id_commande: number;
    date_commande: string;
    total: number;
    statut: string;
  };
}

export interface PaiementCreatePayload {
  montant: number;
  methode_paiement: string;
  statut_paiement?: StatutPaiement; // Optionnel, default = 'en attente'
  id_commande: number;
}