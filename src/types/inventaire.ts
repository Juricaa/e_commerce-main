export type Inventory = {
    idInventaire: number;
    produit: string;
    mouvement: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT';
    quantite: number;
    dateMouvement: string; 
    commentaire: string;
  };