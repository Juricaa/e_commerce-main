import type { User } from './user'; // Assurez-vous que le chemin est correct
import type { CommandeProduit, CommandeProduitCreatePayload } from './commandeProduit'; // Assurez-vous que le chemin est correct
import type  { Paiement, PaiementCreatePayload } from './paiement'; // Assurez-vous que le chemin est correct

// Définition de l'énumération StatutCommande
export type StatutCommande = 
  'EN_ATTENTE' | 
  'PAYEE' | 
  'EXPEDIEE' | 
  'LIVREE' | 
  'ANNULEE' ;

  // Note: J'ai utilisé des majuscules avec underscore pour correspondre à EnumType.STRING de Java

export type Commande = {
  /** * L'identifiant unique de la commande (Long dans le backend devient number en TS).
   */
  idCommande: number;

  /**
   * L'objet User associé à cette commande (relation ManyToOne).
   */
  User: User;

  /**
   * La date de la commande (LocalDate dans le backend, souvent représenté par une string ISO en TS).
   * Format: "YYYY-MM-DD"
   */
  dateCommande: string;

  /**
   * Le statut actuel de la commande (Enum String dans le backend).
   */
  statut: StatutCommande;

  /**
   * Le montant total de la commande.
   */
  total: number;

  /**
   * La liste des articles (lignes de commande) inclus dans cette commande (relation OneToMany).
   */
  commandeProduits: CommandeProduit[];

  /**
   * La liste des paiements effectués pour cette commande (relation OneToMany).
   */
  paiements: Paiement[];
};

export type CommandeCreatePayload = {
    /** L'identifiant du client qui passe la commande. */
    idClient: number; // Remplace l'objet 'client' complet
  
    /**
     * Le statut initial de la commande (souvent 'EN_ATTENTE' ou 'PAYEE').
     * Peut être optionnel si le backend l'initialise.
     */
    statut?: StatutCommande; 
  
    /**
     * Le montant total de la commande (calculé sur le frontend et vérifié sur le backend).
     */
    total: number; 
    
    /**
     * La liste des produits inclus dans cette commande.
     */
    commandeProduits: CommandeProduitCreatePayload[];
  
    /**
     * Informations sur le paiement à effectuer pour cette commande (peut être une liste simple si un seul paiement est autorisé).
     */
    paiements: PaiementCreatePayload[];

    dateCommande?: string; // Optionnel, le backend peut l'assigner automatiquement
  };