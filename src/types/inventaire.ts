export type Inventory = {
    id_inventaire: number;
    id_produit: string;
    mouvement: 'entrée' | 'sortie' | 'ajustement';
    quantite: number;
    date_mouvement: string; 
    commentaire: string;
  };