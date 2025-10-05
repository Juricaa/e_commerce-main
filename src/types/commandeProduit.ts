// types/commandeProduit.ts
export interface CommandeProduit {
  id?: number; // ID de la relation (clé primaire)
  id_commande: string; // Référence à la commande
  id_produit: string; // Référence au produit
  quantite: number;
  prix_unitaire: number;
  
  // Champs optionnels pour les données liées (si votre serializer les inclut)
  commande_details?: {
    id_commande: string;
    date_commande: string;
    total: number;
  };
  produit_details?: {
    id_produit: string;
    nom_produit: string;
    description: string;
  };
}

export interface CommandeProduitCreatePayload {
  id_commande: string;
  id_produit: string;
  quantite: number;
  prix_unitaire: number;
}