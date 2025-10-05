// types/produit.ts
export interface Produit {
  id_produit: string;
  nom_produit: string;
  description: string;
  prix: number;
  stock: number;
  categorie: string;
  date_ajout: string;
  image?: string | null;
}