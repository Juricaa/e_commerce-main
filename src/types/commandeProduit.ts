import type { Produit } from './produit'; // Le type du Produit (que vous avez déjà défini)
import type { Commande } from './commande'; // Le type de la commande (que nous avons défini précédemment)

/**
 * Représente une ligne de détail dans une commande (un article spécifique commandé).
 */
export type CommandeProduit = {
  /**
   * L'objet Commande auquel cette ligne appartient.
   * Souvent inclus lors de la récupération d'une ligne spécifique, mais parfois juste l'ID est suffisant.
   */
  commande: Commande;

  /**
   * L'objet Produit commandé.
   * Contient les détails du Produit au moment de la commande (relation ManyToOne).
   */
  Produit: Produit;

  /**
   * La quantité commandée de ce Produit.
   */
  quantite: number;

  /**
   * Le prix auquel ce Produit a été vendu pour cette commande (très important : il doit être fixe).
   */
  prixUnitaire: number;
};

export type CommandeProduitCreatePayload = {
    // Les IDs qui forment la clé composée
    idCommande: number;
    idProduit: number; 
  
    // Les données de la ligne
    quantite: number;
    prixUnitaire: number;
  };