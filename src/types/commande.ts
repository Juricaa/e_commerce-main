// types/commande.ts
export interface Commande {
  id_commande: number;
  id_client: string;
  date_commande: string;
  total: number;
  statut: 'en attente' | 'payée' | 'expédiée' | 'annulée';
  client?: {  // Optionnel si vous incluez les données client
    id_client: string;
    nom: string;
    prenom: string;
    email: string;
  };
}