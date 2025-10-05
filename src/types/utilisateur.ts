// types/utilisateur.ts
export type RoleUtilisateur = 'admin' | 'livreur';

export interface Utilisateur {
  id_utilisateur: string;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe?: string; // Optionnel car souvent caché
  role: RoleUtilisateur;
  date_creation: string;
  status: boolean;
}

export interface UtilisateurCreatePayload {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role: RoleUtilisateur;
  status?: boolean;
}

export interface UtilisateurUpdatePayload {
  nom?: string;
  prenom?: string;
  email?: string;
  mot_de_passe?: string;
  role?: RoleUtilisateur;
  status?: boolean;
}

export interface LoginPayload {
  email: string;
  mot_de_passe: string;
}

export interface LoginResponse {
  success: boolean;
  data?: Utilisateur;
  message?: string;
}