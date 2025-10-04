import type { FormEvent } from "react";
import { useMemo, useState, useEffect, useCallback } from "react"; 
import { Link } from "react-router-dom";
import { toDataURL } from "qrcode";
import "../../styles/storefront.css";
import logo from "../../assets/logo.png";

// Importation des types
import type { Produit } from "../../types/produit";
import type { CommandeCreatePayload, StatutCommande } from "../../types/commande";
import type { CommandeProduitCreatePayload } from "../../types/commandeProduit";
import type { PaiementCreatePayload, StatutPaiement } from "../../types/paiement";
// import type { StatutCommande } from "../../types/statuts";

// Importation des contrôleurs
import { getAllProducts } from "../../controllers/produitController";
import { createCommande } from "../../controllers/commandeController"; // Assurez-vous d'importer la fonction de création

// =======================================================
// TYPES LOCAUX ET CONSTANTES
// =======================================================

type JournalEntry = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
};

type CartLine = {
  product: Produit;
  quantity: number;
};

type CheckoutFeedback = {
  type: "success" | "error";
  message: string;
};

type OrderQr = {
  reference: string;
  dataUrl: string;
};

const currencyFormatter = new Intl.NumberFormat("fr-MG", {
  style: "currency",
  currency: "MGA",
});

const formatPrice = (value: number) => currencyFormatter.format(value);

// --- DONNÉES STATIQUES (Journal) ---
const journalHighlights: JournalEntry[] = [
  // ... (Journal entries)
  {
    id: "linen-care",
    title: "Linen Care: Keeping Fibers Soft",
    excerpt: "Three simple rituals to preserve the airy texture of your favorite linen pieces.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "atelier-story",
    title: "Inside the Atelier",
    excerpt: "Meet the artisans behind our hand-finished accessories and seasonal prints.",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "travel-lookbook",
    title: "Travel Lookbook",
    excerpt: "Curated outfits designed to move seamlessly from sunlit mornings to evening dinners.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
  },
];

// NOTE IMPORTANTE : ID client statique pour la démo. 
// À remplacer par l'ID de l'utilisateur connecté en production.
const DEFAULT_CLIENT_ID = 1; 

// =======================================================
// COMPOSANT STOREFRONT
// =======================================================

export function Storefront() {
  // --- États des produits et du chargement ---
  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- États du panier et du formulaire ---
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNumero, setCustomerNumero] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  
  // --- États du processus de commande ---
  const [feedback, setFeedback] = useState<CheckoutFeedback | null>(null);
  const [orderQr, setOrderQr] = useState<OrderQr | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIQUE DE RÉCUPÉRATION DES PRODUITS (existante) ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const productList = await getAllProducts();
      setProducts(productList);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      // Gérer l'erreur si besoin
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- LOGIQUE DU PANIER (existante) ---
  const cartCount = useMemo(
    () => cartItems.reduce((total, line) => total + line.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, line) => total + line.product.prix * line.quantity, 0),
    [cartItems],
  );

  const handleAddToCart = (product: Produit) => {
    setCartItems((previous) => {
      const existingLine = previous.find((line) => line.product.idProduit === product.idProduit);
      if (existingLine) {
        return previous.map((line) =>
          line.product.idProduit === product.idProduit
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...previous, { product, quantity: 1 }];
    });
    setFeedback(null);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCartItems((previous) =>
      previous
        .map((line) =>
          line.product.idProduit === productId
            ? { ...line, quantity: Math.max(1, line.quantity + delta) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems((previous) => previous.filter((line) => line.product.idProduit !== productId));
  };

  const resetCheckoutForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerNumero("");
    setCustomerAddress("");
    setCustomerNote("");
  };

  // =======================================================
  // LOGIQUE DE COMMANDE MISE À JOUR (Intégration API)
  // =======================================================

  // const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (cartItems.length === 0) {
  //     setFeedback({ type: "error", message: "Votre panier est vide." });
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setFeedback(null);
  //   setOrderQr(null); // Réinitialiser le QR code précédent

  //   // 1. Préparation des données pour CommandeProduitCreatePayload
  //   const commandeProduitsPayload: CommandeProduitCreatePayload[] = cartItems.map((line) => ({
  //     idProduit: line.product.idProduit,
  //     quantite: line.quantity,
  //     prixUnitaire: line.product.prix, // Utiliser le prix au moment de l'ajout au panier
  //     idCommande: 0, // Temporaire, sera remplacé par l'ID réel de la commande par le backend
  //   }));

  //   // 2. Préparation des données pour PaiementCreatePayload (Simulation d'un paiement à la livraison)
  //   const paiementPayload: PaiementCreatePayload = {
  //     montant: cartTotal,
  //     methodePaiement: "PAIEMENT_LIVRAISON", // Assurez-vous que cette valeur est acceptée par votre ENUM Java
  //     statutPaiement: "EN_ATTENTE" as StatutPaiement, // Le paiement est en attente de la livraison
  //     idCommande: 0, // Temporaire, sera remplacé par l'ID réel de la commande par le backend
  //   };
    
  //   // 3. Construction du CommandeCreatePayload final
  //   const commandePayload: CommandeCreatePayload = {
  //     idClient: DEFAULT_CLIENT_ID, // Utilisation de l'ID statique pour la démo
  //     statut: "EN_ATTENTE" as StatutCommande, // Statut initial
  //     total: cartTotal,
  //     commandeProduits: commandeProduitsPayload,
  //     paiements: [paiementPayload], // On envoie le paiement dans une liste
  //   };

  //   try {
  //     // 4. Appel de l'API de création de commande
  //     const nouvelleCommande = await createCommande(commandePayload);
      
  //     // 5. Génération du QR code basé sur les données de la commande créée
  //     const reference = `CDE-${nouvelleCommande.idCommande}`; 
      
  //     // Inclusion des données importantes pour le livreur (Nom, Référence, Total)
  //     const qrData = JSON.stringify({
  //         ref: reference, 
  //         idCde: nouvelleCommande.idCommande, 
  //         nom: customerName.trim(), 
  //         num: customerNumero.trim(),
  //         total: cartTotal
  //     });

  //     const dataUrl = await toDataURL(qrData, {
  //       errorCorrectionLevel: "M",
  //       width: 320,
  //     });

  //     // 6. Succès et mise à jour de l'état
  //     setOrderQr({ reference, dataUrl });
  //     setFeedback({
  //       type: "success",
  //       message: `Commande #${reference} confirmée ! Présentez ce QR code au livreur lors de la livraison.`,
  //     });
  //     setCartItems([]);
  //     resetCheckoutForm();
  //   } catch (error) {
  //     console.error("Erreur lors de la validation de la commande API:", error);
  //     setFeedback({
  //       type: "error",
  //       message: "Échec de la validation de la commande. Veuillez vérifier vos informations et réessayer.",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (cartItems.length === 0) {
    setFeedback({ type: "error", message: "Votre panier est vide." });
    return;
  }

  setIsSubmitting(true);
  setFeedback(null);
  setOrderQr(null);

  // Générer la date du jour au format AAAA-MM-JJ
  const today = new Date().toISOString().split("T")[0];

  // 1️⃣ Préparation des produits de la commande
  const commandeProduitsPayload: CommandeProduitCreatePayload[] = cartItems.map((line) => {
    const produitPayload = {
      idProduit: line.product.idProduit,
      nomProduit: line.product.nomProduit,
      description: line.product.description,
      prix: line.product.prix,
      stock: line.product.stock,
      // categorie: "string", // valeur placeholder, à remplacer si le backend attend une vraie catégorie
      dateAjout: today,
      // commandeProduits: ["string"],
      inventaires: [
        {
          idInventaire: 0,
          produit: line.product.idProduit,
          mouvement: "ENTREE",
          quantite: 0,
          dateMouvement: today,
          commentaire: "string",
        },
      ],
    };

    return {
      commande: "string",
      produit: produitPayload as any,
      quantite: line.quantity,
      prixUnitaire: line.product.prix,
    };
  });

  // 2️⃣ Préparation du paiement
  const paiementPayload: PaiementCreatePayload = {
    // idPaiement: 0,
    commande: "string",
    montant: cartTotal,
    methodePaiement: "PAIEMENT_LIVRAISON",
    statutPaiement: "EN_ATTENTE",
    datePaiement: today,
  };

  // 3️⃣ Construction de la commande complète (structure conforme à ton DTO)
  const commandePayload: CommandeCreatePayload = {
    idCommande: 0, // valeur par défaut, sera remplacée par le backend
    client: 1,
    dateCommande: today,
    statut: "EN_ATTENTE",
    total: cartTotal,
    commandeProduits: commandeProduitsPayload,
    paiements: [paiementPayload],
  };

  try {
    // 4️⃣ Appel API pour créer la commande
    const nouvelleCommande = await createCommande(commandePayload);

    // 5️⃣ Génération du QR code après création
    const reference = `CDE-${nouvelleCommande.idCommande}`;
    const qrData = JSON.stringify({
      ref: reference,
      idCde: nouvelleCommande.idCommande,
      nom: customerName.trim(),
      num: customerNumero.trim(),
      total: cartTotal,
    });

    const dataUrl = await toDataURL(qrData, {
      errorCorrectionLevel: "M",
      width: 320,
    });

    // 6️⃣ Mise à jour des états après succès
    setOrderQr({ reference, dataUrl });
    setFeedback({
      type: "success",
      message: `Commande #${reference} confirmée ! Présentez ce QR code au livreur lors de la livraison.`,
    });
    setCartItems([]);
    resetCheckoutForm();

  } catch (error) {
    console.error("Erreur lors de la validation de la commande API:", error);
    setFeedback({
      type: "error",
      message: "Échec de la validation de la commande. Veuillez vérifier vos informations et réessayer.",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="storefront-page">
      <header className="storefront-navbar">
        <div className="navbar-branding">
          <span className="brand-mark"><img src={logo} alt="logo" style={{ width: "120px", height: "auto" }}/>
</span>
          <nav className="navbar-links" aria-label="Primary">
            <a className="navbar-link" href="#collections">
              Produits
            </a>
            <a className="navbar-link" href="#story">
              Notre histoire
            </a>
            <a className="navbar-link" href="#journal">
              Journal
            </a>
            <a className="navbar-link" href="#contact">
              Contact
            </a>
          </nav>
        </div>
        <div className="navbar-actions">
          <a className="cart-link" href="#checkout">
            Panier ({cartCount})
          </a>
          <Link className="account-link" to="/login">
            Connexion équipe
          </Link>
        </div>
      </header>

      <main>
      <section className="storefront-hero" id="home">
          <div className="hero-content">
            <p className="hero-eyebrow">Nouvelle collection</p>
            <h1 className="hero-title">Elevated essentials for brighter days.</h1>
            <p className="hero-description">
              Discover coastal-inspired silhouettes crafted with premium fabrics, neutral tones,
              and thoughtful details made to live beyond the season.
            </p>
            <div className="hero-actions">
              <a className="hero-primary" href="#collections">
                Découvrir les nouveautés
              </a>
              <a className="hero-secondary" href="#story">
                En savoir plus
              </a>
            </div>
            <dl className="hero-stats">
              <div className="hero-stat">
                <dt>40+</dt>
                <dd>Artisans indépendants représentés cette saison.</dd>
              </div>
              <div className="hero-stat">
                <dt>100% naturel</dt>
                <dd>Tissus traçables et certifiés durables.</dd>
              </div>
            </dl>
          </div>
            <img
              className="hero-image primary"
              src="https://media.istockphoto.com/id/1253950596/fr/vectoriel/illustration-de-boutique-en-ligne-e-commerce-dans-le-design-plat.jpg?s=170667a&w=0&k=20&c=VI2xB9iSnwB0T9F8Qi2PeOBfrlsrKxamuZ0GClO6Dw0="
              alt="Model wearing a linen shirt"
            />
        </section>      
        <section className="product-showcase" id="collections">
        <div className="section-header">
            <div>
              <p className="section-eyebrow">Pièces phares</p>
              <h2 className="section-title">Sélection de nos stylistes</h2>
            </div>
            <p className="section-description">
              Six silhouettes choisies pour leur savoir-faire, leur polyvalence et leur design durable.
            </p>
          </div>
        {isLoading ? (
          <div className="loading-message">Chargement des produits...</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <article key={product.idProduit} className="product-card">
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.nomProduit} />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.nomProduit}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.prix)}</span>
                    <button
                      className="product-action"
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? "Ajouter au panier" : "Indisponible"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Section de Checkout */}
      <section className="checkout-section" id="checkout">
      <div className="section-header">
            <div>
              <p className="section-eyebrow">Commande</p>
              <h2 className="section-title">Finalisez votre achat</h2>
            </div>
            <p className="section-description">
              Sauvegardez votre commande grâce à un QR code à présenter au livreur lors de la livraison.
            </p>
          </div>

          <div className="checkout-grid">
            <div className="cart-summary">
              <h3>Votre panier</h3>
              {cartItems.length === 0 ? (
                <p className="cart-empty">Ajoutez vos pièces favorites pour continuer.</p>
              ) : (
                <ul className="cart-list">
                  {cartItems.map((line) => (
                    <li key={line.product.idProduit} className="cart-item">
                      <div className="cart-item-details">
                        <h4>{line.product.nomProduit}</h4>
                        <p>{formatPrice(line.product.prix)}</p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-controls" aria-label="Modifier la quantité">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.product.idProduit, -1)}
                            aria-label="Diminuer la quantité"
                          >
                            −
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.product.idProduit, 1)}
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="remove-item"
                          type="button"
                          onClick={() => removeFromCart(line.product.idProduit)}
                        >
                          Retirer
                        </button>
                        <span className="line-total">
                          {formatPrice(line.product.prix * line.quantity)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="cart-total">
                <span>Total</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
            </div>

          <form className="checkout-form" onSubmit={handleCheckout}>
            {/* ... (Formulaire client) ... */}
            <label className="checkout-label">
              Nom complet
              <input
                className="checkout-input"
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Marie Dupont"
                required
              />
            </label>
            <label className="checkout-label">
              Numéro Mobile
              <input
                className="checkout-input"
                type="text"
                value={customerNumero}
                onChange={(event) => setCustomerNumero(event.target.value)}
                placeholder="+261 xx xxx xx"
                required
              />
            </label>
            <label className="checkout-label">
              Email
              <input
                className="checkout-input"
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="marie.dupont@email.com"
                required
              />
            </label>
            <label className="checkout-label">
              Adresse de livraison
              <textarea
                className="checkout-textarea"
                value={customerAddress}
                onChange={(event) => setCustomerAddress(event.target.value)}
                placeholder="12 rue Paradis, Antananarivo"
                rows={3}
                required
              />
            </label>
            <label className="checkout-label">
              Instructions (optionnel)
              <textarea
                className="checkout-textarea"
                value={customerNote}
                onChange={(event) => setCustomerNote(event.target.value)}
                placeholder="Code porte, étage, préférences de livraison…"
                rows={2}
              />
            </label>
            <button className="checkout-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Validation de la commande..." : "Confirmer la commande"}
            </button>
            {feedback ? (
              <p className={feedback.type === "success" ? "checkout-feedback success" : "checkout-feedback error"}>
                {feedback.message}
              </p>
            ) : null}
            </form>

            <div className="qr-panel">
              <h3>QR code de commande</h3>
              {orderQr ? (
                <div className="qr-display">
                  <img
                    src={orderQr.dataUrl}
                    alt={`QR code de la commande ${orderQr.reference}`}
                  />
                  <p className="qr-reference">Référence : {orderQr.reference}</p>
                  <a
                    className="qr-download"
                    href={orderQr.dataUrl}
                    download={`commande-${orderQr.reference}.png`}
                  >
                    Télécharger le QR code
                  </a>
                </div>
              ) : (
                <p className="qr-placeholder">
                  Une fois votre commande validée, un QR code sécurisé sera généré ici. Conservez-le
                  pour la récupération auprès de notre équipe de livraison.
                </p>
              )}
            </div>
          </div>
        </section>

      </main>

      <footer className="storefront-footer" id="contact">
        <div className="footer-branding">
           <span className="brand-mark"><img src={logo} alt="logo" style={{ width: "120px", height: "auto" }}/>
</span>
          <p className="footer-description">
            Thoughtful pieces designed in Marseille, shipping worldwide with plastic-free packaging.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <p className="footer-heading">Service client</p>
            <a className="footer-link" href="mailto:bonjour@elan.studio">
              bonjour@elan.studio
            </a>
            <a className="footer-link" href="tel:+33176070345">
              +33 1 76 07 03 45
            </a>
          </div>
          <div>
            <p className="footer-heading">Visitez-nous</p>
            <p className="footer-link">12 Rue Paradis, Marseille</p>
            <p className="footer-link">Lun - Sam, 10h à 19h</p>
          </div>
          <div>
            <p className="footer-heading">Suivez-nous</p>
            <a className="footer-link" href="https://www.instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="footer-link" href="https://www.pinterest.com" target="_blank" rel="noreferrer">
              Pinterest
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}