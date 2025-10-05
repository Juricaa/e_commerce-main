// LoginPage.tsx
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUtilisateur, saveUserToLocalStorage } from "../../controllers/utilisateurController"; 
import "../../styles/auth.css";

type UserRole = "admin" | "livreur";

type RoleOption = {
  value: UserRole;
  label: string;
  description: string;
};

const roleOptions: RoleOption[] = [
  {
    value: "admin",
    label: "Administrateur",
    description: "Gérez l'inventaire, les commandes et les rapports.",
  },
  {
    value: "livreur",
    label: "Livreur",
    description: "Scanner les QR codes pour récupérer les colis.",
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    if (!email.trim() || !password.trim()) {
      setFeedback("Veuillez saisir votre email et votre mot de passe.");
      return;
    }

    setFeedback("");
    setIsLoading(true);

    try {
      // Appel du contrôleur pour l'authentification via API Django
      const result = await loginUtilisateur({
        email: email.trim(),
        mot_de_passe: password.trim()
      });

      if (result.success && result.data) {
        const user = result.data;
        
        // Vérifier que le rôle de l'utilisateur correspond au rôle sélectionné
        // if (user.role !== role) {
        //   setFeedback(`Cet utilisateur n'a pas les droits ${role}. Rôle actuel: ${user.role}`);
        //   setIsLoading(false);
        //   return;
        // }

        // Vérifier que l'utilisateur est actif
        if (!user.status) {
          setFeedback("Votre compte est désactivé. Contactez l'administrateur.");
          setIsLoading(false);
          return;
        }

        // Sauvegarder l'utilisateur dans le localStorage
        saveUserToLocalStorage(user);

        // Redirection selon le rôle
        if (user.role === 'admin') {
          navigate("/admin");
        } else if (user.role === 'livreur') {
          navigate("/delivery", { state: { operator: user.email } });
        }
        
      } else {
        // Échec de l'authentification
        setFeedback(result.message || "Échec de la connexion. Vérifiez vos identifiants.");
      }
    } catch (error: any) {
      // Gestion des erreurs
      setFeedback(error.message || "Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFeedback("");
  };

  // Quand le rôle change, réinitialiser le formulaire
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    resetForm();
  };

  return (
    <div className="auth-page">
      <div className="auth-banner">
        <div className="auth-overlay" />
        <div className="auth-highlight">
          <span className="auth-brand">Élan Commerce</span>
          <p className="auth-tagline">
            Espace sécurisé pour l'équipe opérationnelle et les livreurs.
          </p>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Connexion</h1>
            <p>Sélectionnez votre rôle pour accéder aux outils dédiés.</p>
          </div>

          {/* <div className="auth-role-toggle" role="tablist" aria-label="Choisir un rôle">
            {roleOptions.map((option) => {
              const isSelected = option.value === role;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={isSelected ? "role-button selected" : "role-button"}
                  onClick={() => handleRoleChange(option.value)}
                  role="tab"
                  aria-selected={isSelected}
                  disabled={isLoading}
                >
                  <span className="role-label">{option.label}</span>
                  <span className="role-description">{option.description}</span>
                </button>
              );
            })}
          </div> */}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              Email professionnel
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="prenom.nom@entreprise.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </label>

            <label className="auth-label">
              Mot de passe
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Votre mot de passe"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </label>

            {feedback && (
              <div className={`auth-feedback ${feedback.includes("succès") ? "success" : "error"}`}>
                {feedback}
              </div>
            )}

            <button 
              className="auth-submit" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading 
                ? "Connexion en cours..." 
                : `Se connecter`}
            </button>
          </form>

          <div className="auth-footer">
            <Link className="auth-link" to="/">
              ← Retour à la boutique
            </Link>
            

          </div>
        </div>
      </div>
    </div>
  );
}