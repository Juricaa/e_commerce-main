import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setFeedback("Veuillez saisir votre email et votre mot de passe.");
      return;
    }

    setFeedback("");

    if (role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/delivery", { state: { operator: email.trim() } });
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
              />
            </label>

            {feedback ? <p className="auth-feedback">{feedback}</p> : null}

            <button className="auth-submit" type="submit">
              Continuer vers l'espace {role === "admin" ? "administrateur" : "livreur"}
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
