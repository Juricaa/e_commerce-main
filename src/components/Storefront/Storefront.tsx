import type { FormEvent } from "react";
import { useMemo, useState, useEffect, useCallback } from "react"; 
import { Link } from "react-router-dom";
import { toDataURL } from "qrcode";
import "../../styles/storefront.css";
import logo from "../../assets/logo.png";

// Importation des types
import type { Produit } from "../../types/produit";
import type { Commande } from "../../types/commande";
import type { StatutCommande } from "../../types/commande";
import type { StatutPaiement } from "../../types/paiement";
import type { CommandeProduitCreatePayload } from "../../types/commandeProduit";

// Importation des contrôleurs
import { getAllProducts } from "../../controllers/produitController";
import { createCommande } from "../../controllers/commandeController";
import { createCommandeProduit } from "../../controllers/commandeProduitController";
import { createPaiement } from "../../controllers/paiementController";

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

  // --- LOGIQUE DE RÉCUPÉRATION DES PRODUITS ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const productList = await getAllProducts();
      setProducts(productList.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      setFeedback({ type: "error", message: "Erreur lors du chargement des produits" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- LOGIQUE DU PANIER ---
  const cartCount = useMemo(
    () => cartItems.reduce((total, line) => total + line.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, line) => total + line.product.prix * line.quantity, 0),
    [cartItems],
  );

  const handleAddToCart = (product: Produit) => {
    if (product.stock <= 0) {
      setFeedback({ type: "error", message: "Ce produit est en rupture de stock" });
      return;
    }

    setCartItems((previous) => {
      const existingLine = previous.find((line) => line.product.id_produit === product.id_produit);
      if (existingLine) {
        // Vérifier si la nouvelle quantité dépasse le stock
        const newQuantity = existingLine.quantity + 1;
        if (newQuantity > product.stock) {
          setFeedback({ type: "error", message: `Stock insuffisant. Il reste ${product.stock} unités` });
          return previous;
        }
        return previous.map((line) =>
          line.product.id_produit === product.id_produit
            ? { ...line, quantity: newQuantity }
            : line,
        );
      }
      return [...previous, { product, quantity: 1 }];
    });
    setFeedback(null);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((previous) =>
      previous
        .map((line) => {
          if (line.product.id_produit === productId) {
            const newQuantity = Math.max(1, line.quantity + delta);
            // Vérifier le stock
            if (newQuantity > line.product.stock) {
              setFeedback({ type: "error", message: `Stock insuffisant. Il reste ${line.product.stock} unités` });
              return line;
            }
            return { ...line, quantity: newQuantity };
          }
          return line;
        })
        .filter((line) => line.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((previous) => previous.filter((line) => line.product.id_produit !== productId));
  };

  const resetCheckoutForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerNumero("");
    setCustomerAddress("");
    setCustomerNote("");
  };

  // =======================================================
  // LOGIQUE DE COMMANDE CORRIGÉE
  // =======================================================

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (cartItems.length === 0) {
      setFeedback({ type: "error", message: "Votre panier est vide." });
      return;
    }
  
    // Validation des informations client
    if (!customerName.trim() || !customerEmail.trim() || !customerNumero.trim() || !customerAddress.trim()) {
      setFeedback({ type: "error", message: "Veuillez remplir tous les champs obligatoires." });
      return;
    }
  
    // Vérification du stock avant commande
    for (const line of cartItems) {
      if (line.quantity > line.product.stock) {
        setFeedback({ 
          type: "error", 
          message: `Stock insuffisant pour "${line.product.nom_produit}". Il reste ${line.product.stock} unités.` 
        });
        return;
      }
    }
  
    setIsSubmitting(true);
    setFeedback(null);
    setOrderQr(null);
  
    try {
      // 1️⃣ Préparer les données client
      const clientPayload = {
        nom: customerName.trim(),
        prenom: "test", // Optionnel selon votre modèle
        email: customerEmail.trim(),
        telephone: customerNumero.trim(),
        adresse: customerAddress.trim(),
      };
  
      // 2️⃣ Créer la commande avec le client
      const commandePayload = {
        client: clientPayload,
        total: cartTotal,
        statut: "en attente" as StatutCommande,
      };
  
      console.log("Création de la commande...", commandePayload);
      const nouvelleCommande = await createCommande(commandePayload);
      console.log("Commande créée:", nouvelleCommande);
  
      // 3️⃣ Créer les lignes de commande (commande_produits)
      const commandeProduitsPromises = cartItems.map((line) => {
        const payload: CommandeProduitCreatePayload = {
          id_commande: nouvelleCommande.data.id_commande,
          id_produit: line.product.id_produit,
          quantite: line.quantity,
          prix_unitaire: line.product.prix,
        };
        return createCommandeProduit(payload);
      });
  
      console.log("Création des lignes de commande...");
      await Promise.all(commandeProduitsPromises);
  
      // 4️⃣ Créer le paiement
      const paiementPayload = {
        montant: cartTotal,
        methode_paiement: "CASH",
        statut_paiement: "en attente" as StatutPaiement,
        id_commande: nouvelleCommande.data.id_commande,
      };
  
      console.log("Création du paiement...", paiementPayload);
      const paiementResult = await createPaiement(paiementPayload);
      const id_paiement = paiementResult.data?.id_paiement;
     
      // 5️⃣ Générer le QR code
    const reference = nouvelleCommande.data.id_commande.toString().padStart(6, '0');
      const qrData = JSON.stringify({
        id_paiement: id_paiement, 
        id_commande: nouvelleCommande.data.id_commande,
        nom_client: clientPayload.nom,
        email: clientPayload.email,
        telephone: clientPayload.telephone,
        total: cartTotal,
        produits: cartItems.map(item => ({
          nom_produit: item.product.nom_produit,
          quantite: item.quantity,
          prix: item.product.prix
        }))
      });
  
      const dataUrl = await toDataURL(qrData, {
        errorCorrectionLevel: "M",
        width: 320,
      });
  
      // 6️⃣ Succès - Mettre à jour l'interface
      setOrderQr({ reference, dataUrl });
      setFeedback({
        type: "success",
        message: `Commande #${reference} confirmée ! Votre commande a été enregistrée. Présentez ce QR code au livreur.`,
      });
  
      // Vider le panier et réinitialiser le formulaire
      setCartItems([]);
      resetCheckoutForm();
  
      // Recharger les produits pour mettre à jour les stocks
      await fetchProducts();
  
    } catch (error: any) {
      console.error("Erreur complète lors de la validation de la commande :", error);
      
      let errorMessage = "Erreur lors de la validation de la commande. ";
      
      if (error.message?.includes("stock")) {
        errorMessage += "Problème de stock. Veuillez vérifier les quantités disponibles.";
      } else if (error.message?.includes("client")) {
        errorMessage += "Erreur avec les informations client. Vérifiez votre email et téléphone.";
      } else {
        errorMessage += "Veuillez réessayer ou contacter le support.";
      }
      
      setFeedback({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="storefront-page">
      <header className="storefront-navbar">
        <div className="navbar-branding">
          <span className="brand-mark">
            <img src={logo} alt="logo" style={{ width: "120px", height: "auto" }}/>
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
                <article key={product.id_produit} className="product-card">
                  <div className="product-image-wrapper">
                    <img src={product.image || "/placeholder-image.jpg"} alt={product.nom_produit} />
                    {product.stock <= 0 && (
                      <div className="stock-badge out-of-stock">Rupture</div>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <div className="stock-badge low-stock">Stock faible</div>
                    )}
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.nom_produit}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                      <span className="product-price">{formatPrice(product.prix)}</span>
                      
                    </div>
                    <div className="product-footer">
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
                <>
                  <ul className="cart-list">
                    {cartItems.map((line) => (
                      <li key={line.product.id_produit} className="cart-item">
                        <div className="cart-item-details">
                          <h4>{line.product.nom_produit}</h4>
                          <p>{formatPrice(line.product.prix)}</p>
                          <small>Stock: {line.product.stock}</small>
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls" aria-label="Modifier la quantité">
                            <button
                              type="button"
                              onClick={() => updateQuantity(line.product.id_produit, -1)}
                              aria-label="Diminuer la quantité"
                            >
                              −
                            </button>
                            <span>{line.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(line.product.id_produit, 1)}
                              aria-label="Augmenter la quantité"
                              disabled={line.quantity >= line.product.stock}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="remove-item"
                            type="button"
                            onClick={() => removeFromCart(line.product.id_produit)}
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
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>
                </>
              )}
            </div>

            <form className="checkout-form" onSubmit={handleCheckout}>
              <h3>Informations de livraison</h3>
              
              <label className="checkout-label">
                Nom complet *
                <input
                  className="checkout-input"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Marie Dupont"
                  required
                  disabled={isSubmitting}
                />
              </label>
              
              <label className="checkout-label">
                Numéro Mobile *
                <input
                  className="checkout-input"
                  type="tel"
                  value={customerNumero}
                  onChange={(event) => setCustomerNumero(event.target.value)}
                  placeholder="+261 34 12 345 67"
                  required
                  disabled={isSubmitting}
                />
              </label>
              
              <label className="checkout-label">
                Email *
                <input
                  className="checkout-input"
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="marie.dupont@email.com"
                  required
                  disabled={isSubmitting}
                />
              </label>
              
              <label className="checkout-label">
                Adresse de livraison *
                <textarea
                  className="checkout-textarea"
                  value={customerAddress}
                  onChange={(event) => setCustomerAddress(event.target.value)}
                  placeholder="12 rue Paradis, Antananarivo"
                  rows={3}
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </label>
              
              <button 
                className="checkout-submit" 
                type="submit" 
                disabled={isSubmitting || cartItems.length === 0}
              >
                {isSubmitting ? "Validation de la commande..." : "Confirmer la commande"}
              </button>
              
              {feedback && (
                <div className={`checkout-feedback ${feedback.type}`}>
                  {feedback.message}
                </div>
              )}
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
          <span className="brand-mark">
            <img src={logo} alt="logo" style={{ width: "120px", height: "auto" }}/>
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