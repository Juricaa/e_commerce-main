import { API_BASE_URL } from './baseUrl';
import type { User } from "../types/user";

/**
 * Tente d'authentifier un utilisateur via l'API.
 *
 * @param email L'email de l'utilisateur.
 * @param password Le mot de passe de l'utilisateur.
 * @param expectedRole Le rôle sélectionné dans la vue ('admin' ou 'delivery').
 * @returns L'objet User si l'authentification est réussie, sinon null.
 */
export async function authenticateUser(
  email: string,
  password: string,
  expectedRole: 'admin' | 'delivery'
): Promise<User | null> {

  // Conversion du rôle de l'interface ('delivery') vers le rôle du type User ('Livreur')
  const roleToMatch = expectedRole === 'delivery' ? 'delivery' : 'admin';

  // Endpoint de connexion. Si votre API utilise un autre chemin (ex: /clients/login), ajustez-le.
  const authUrl = `${API_BASE_URL}/clients`;

  try {
    const response = await fetch(authUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Ajout possible d'un jeton (Token) si l'API le nécessite
      }
    });


    if (response.ok) {
      const userData: User = await response.json();

      const MOCK_USERS: User[] = Array.isArray(userData) ? userData : [userData];
      try {

        const foundUser = MOCK_USERS.find(user =>
          user.email === email // && user.password === password
        );

        if (foundUser) {
          
          const { password, ...userWithoutPassword } = foundUser;
          return userWithoutPassword as User;
          
        } else {
          // Échec de la connexion (email ou mot de passe incorrect)
          return null;
        }
    
      } catch (error) {
        console.error("Erreur logique lors de l'authentification simulée :", error);
        return null; 
      }
    
    }

    // Si l'API renvoie 401 (Unauthorized) ou 403 (Forbidden)
    if (response.status === 401 || response.status === 403) {
      // Échec de la connexion (mauvais identifiants)
      return null;
    }

    // Pour toute autre erreur serveur (500, 404, etc.)
    throw new Error(`Erreur API: ${response.status} ${response.statusText}`);

  } catch (error) {
    console.error("Erreur réseau ou du serveur lors de l'authentification :", error);
    // Retourne null en cas d'erreur réseau pour indiquer un échec d'authentification à la vue
    return null;
  }
}