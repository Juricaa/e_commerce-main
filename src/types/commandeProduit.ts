// types/commandeProduit.ts
export interface CommandeProduit {
  id?: number; // ID de la relation (clé primaire)
  id_commande: number; // Référence à la commande
  id_produit: number; // Référence au produit
  quantite: number;
  prix_unitaire: number;
  
  // Champs optionnels pour les données liées (si votre serializer les inclut)
  commande_details?: {
    id_commande: number;
    date_commande: string;
    total: number;
  };
  produit_details?: {
    id_produit: number;
    nom_produit: string;
    description: string;
  };
}

export interface CommandeProduitCreatePayload {
  id_commande: number;
  id_produit: number;
  quantite: number;
  prix_unitaire: number;
}