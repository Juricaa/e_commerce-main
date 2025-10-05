// types/inventaire.ts
export interface Inventory {
  id_inventaire: number;
  mouvement: 'ENTREE' | 'SORTIE';
  quantite: number;
  date_mouvement: string;
  commentaire?: string | null;
  id_produit: string;
  
  // Champs optionnels pour les données liées (si votre serializer les inclut)
  produit_details?: {
    id_produit: string;
    nom_produit: string;
    prix: number;
    stock: number;
  };
}

export type InventoryCreatePayload = Omit<Inventory, 'id_inventaire'>;
export type InventoryUpdatePayload = Partial<Inventory>;