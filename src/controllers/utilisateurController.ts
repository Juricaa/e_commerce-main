// controllers/utilisateurController.ts
import { API_BASE_URL } from './baseUrl';
import type { 
  Utilisateur, 
  UtilisateurCreatePayload, 
  UtilisateurUpdatePayload, 
  LoginPayload, 
  LoginResponse 
} from '../types/utilisateur';

const UTILISATEUR_API_URL = `${API_BASE_URL}/utilisateurs/`;

export interface UtilisateurFilters {
  nom?: string;
}

// =======================================================
// AUTHENTIFICATION
// =======================================================

/**
 * Authentifie un utilisateur
 */
export async function loginUtilisateur(loginData: LoginPayload): Promise<LoginResponse> {
  console.log("Tentative de connexion:", { email: loginData.email });
  
  try {
    const response = await fetch(`${UTILISATEUR_API_URL}login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de la connexion');
    }

    return result;

  } catch (error) {
    console.error("Erreur lors de l'authentification:", error);
    throw error;
  }
}

/**
 * Déconnecte l'utilisateur (nettoyage local)
 */
export function logoutUtilisateur(): void {
  // Supprimer le token ou les données de session du localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  console.log("Utilisateur déconnecté");
}

// =======================================================
// CRUD UTILISATEURS
// =======================================================

/**
 * Récupère tous les utilisateurs
 */
export async function getAllUtilisateurs(filters?: UtilisateurFilters): Promise<{ success: boolean; data: Utilisateur[] }> {
  const url = new URL(UTILISATEUR_API_URL);
  
  if (filters?.nom) {
    url.searchParams.append('nom', filters.nom);
  }

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    return result;

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUtilisateurById(id: string): Promise<{ success: boolean; data: Utilisateur }> {
  try {
    const response = await fetch(`${UTILISATEUR_API_URL}/${id}/`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'utilisateur ${id}: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Utilisateur non trouvé');
    }

    return result;

  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
    throw error;
  }
}

/**
 * Crée un nouvel utilisateur
 */
export async function createUtilisateur(utilisateurData: UtilisateurCreatePayload): Promise<{ success: boolean; data: Utilisateur }> {
  console.log("Création d'utilisateur:", utilisateurData);
  
  try {
    const response = await fetch(UTILISATEUR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(utilisateurData),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Échec de la création de l'utilisateur: ${response.status} - ${errorDetail}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la création de l\'utilisateur');
    }

    return result;

  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
}

/**
 * Met à jour un utilisateur existant
 */
export async function updateUtilisateur(id: string, updatedData: UtilisateurUpdatePayload): Promise<{ success: boolean; data: Utilisateur }> {
  console.log("Mise à jour de l'utilisateur", id, "avec:", updatedData);
  
  try {
    const response = await fetch(`${UTILISATEUR_API_URL}${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Échec de la mise à jour de l'utilisateur ${id}: ${response.status} - ${errorDetail}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    }

    return result;

  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
    throw error;
  }
}

/**
 * Supprime un utilisateur
 */
export async function deleteUtilisateur(id: string): Promise<void> {
  try {
    const response = await fetch(`${UTILISATEUR_API_URL}${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Échec de la suppression de l'utilisateur ${id}: ${response.status}`);
    }

  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
    throw error;
  }
}

// =======================================================
// FONCTIONS SPÉCIALISÉES
// =======================================================

/**
 * Recherche des utilisateurs par nom
 */
export async function searchUtilisateursByNom(nom: string): Promise<{ success: boolean; data: Utilisateur[] }> {
  return getAllUtilisateurs({ nom });
}

/**
 * Récupère les utilisateurs par rôle
 */
export async function getUtilisateursByRole(role: 'admin' | 'livreur'): Promise<{ success: boolean; data: Utilisateur[] }> {
  const allUtilisateurs = await getAllUtilisateurs();
  const filtered = allUtilisateurs.data.filter(user => user.role === role);
  return { success: true, data: filtered };
}

/**
 * Active/désactive un utilisateur
 */
export async function toggleUtilisateurStatus(id: string, status: boolean): Promise<{ success: boolean; data: Utilisateur }> {
  return updateUtilisateur(id, { status });
}

/**
 * Change le mot de passe d'un utilisateur
 */
export async function changeUtilisateurPassword(id: string, nouveauMotDePasse: string): Promise<{ success: boolean; data: Utilisateur }> {
  return updateUtilisateur(id, { mot_de_passe: nouveauMotDePasse });
}

// =======================================================
// GESTION DE SESSION
// =======================================================

/**
 * Sauvegarde l'utilisateur connecté dans le localStorage
 */
export function saveUserToLocalStorage(user: Utilisateur): void {
  localStorage.setItem('user', JSON.stringify(user));
  console.log("Utilisateur sauvegardé dans le localStorage");
}

/**
 * Récupère l'utilisateur connecté du localStorage
 */
export function getUserFromLocalStorage(): Utilisateur | null {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

/**
 * Vérifie si un utilisateur est connecté
 */
export function isUserLoggedIn(): boolean {
  return getUserFromLocalStorage() !== null;
}

/**
 * Vérifie si l'utilisateur connecté est admin
 */
export function isAdmin(): boolean {
  const user = getUserFromLocalStorage();
  return user ? user.role === 'admin' : false;
}

/**
 * Vérifie si l'utilisateur connecté est livreur
 */
export function isLivreur(): boolean {
  const user = getUserFromLocalStorage();
  return user ? user.role === 'livreur' : false;
}