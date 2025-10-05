export type StatutCommande =  'livrée' | 'en attente' | 'payée' | 'expédiée' | 'annulée' ;
export interface Commande {
  id_commande: string;
  id_client: string;
  date_commande: string;
  total: number;
  statut: StatutCommande;
  client?: {  // Optionnel si vous incluez les données client
    id_client: string;
    nom: string;
    prenom: string;
    email: string;
  };
}