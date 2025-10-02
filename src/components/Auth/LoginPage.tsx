// LoginPage.tsx
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Assurez-vous que le chemin d'importation est correct
import { authenticateUser } from "../../controllers/authController"; 
import "../../styles/auth.css";

type UserRole = "admin" | "delivery";

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
    value: "delivery",
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
      // Appel du Contrôleur pour l'authentification via API
      const user = await authenticateUser(email.trim(), password.trim(), role);

      if (user) {
        // Authentification réussie
        if (user.role === 'admin') {
          navigate("/admin");
        } else if (user.role === 'delivery') {
          // Note : Le rôle dans l'objet User est 'Livreur'
          navigate("/delivery", { state: { operator: user.email } });
        }
      } else {
      
        // Échec de l'authentification (identifiants invalides ou erreur API gérée)
        setFeedback("Échec de la connexion. Vérifiez votre email, votre mot de passe et le rôle sélectionné.");
      }
    } catch (error) {
      // Cas peu probable car le contrôleur catch déjà les erreurs, mais bonne pratique
      setFeedback("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
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

          <div className="auth-role-toggle" role="tablist" aria-label="Choisir un rôle">
            {roleOptions.map((option) => {
              const isSelected = option.value === role;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={isSelected ? "role-button selected" : "role-button"}
                  onClick={() => setRole(option.value)}
                  role="tab"
                  aria-selected={isSelected}
                  disabled={isLoading}
                >
                  <span className="role-label">{option.label}</span>
                  <span className="role-description">{option.description}</span>
                </button>
              );
            })}
          </div>

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
              />
            </label>

            {feedback ? <p className="auth-feedback">{feedback}</p> : null}

            <button 
              className="auth-submit" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading 
                ? "Connexion en cours..." 
                : `Continuer vers l'espace ${role === "admin" ? "administrateur" : "livreur"}`}
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