import type { FormEvent } from "react";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toDataURL } from "qrcode";
import { useCart } from "../../contexts/CartContext";
import logo from "../../assets/logo.png";

// Importation des types
import type { Commande } from "../../types/commande";
import type { StatutCommande } from "../../types/commande";
import type { StatutPaiement } from "../../types/paiement";

// Importation des contrôleurs
import { createCommande } from "../../controllers/commandeController";
import { createCommandeProduit } from "../../controllers/commandeProduitController";
import { createPaiement } from "../../controllers/paiementController";

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

export function Checkout() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  // --- États du formulaire ---
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNumero, setCustomerNumero] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  // --- États du processus de commande ---
  const [feedback, setFeedback] = useState<CheckoutFeedback | null>(null);
  const [orderQr, setOrderQr] = useState<OrderQr | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetCheckoutForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerNumero("");
    setCustomerAddress("");
    setCustomerNote("");
  };

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
        const payload = {
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
      // Note: Cart is cleared elsewhere or on success
      resetCheckoutForm();

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
      <div classname="storefront-footer" style ={{background:"#0f172a", position:"fixed", right:"0",left:"0"}}> 
      <header className="storefront-navbar" style={{ top: 0, zIndex: 1000 , width: "100%"}}>
        <div className="navbar-branding">
          <span className="brand-mark" >
            <img src={logo} alt="logo" style={{ width: "120px", height: "auto" }}/>
          </span>
          
        </div>
        <div className="navbar-actions">
          <Link className="navbar-link" to="/#collections" style={{color: "white"}}>
              Produits
            </Link>

            <Link className="navbar-link" to="/#contact" style={{color: "white"}}>
              Contact
            </Link>
          <Link className="cart-link" to="/checkout" style={{color: "white"}}>
            Panier ({cartCount})
          </Link>
          <Link className="account-link" to="/login">
            Connexion équipe
          </Link>
        </div>
      </header>
      </div>

      <main >
        <section className="checkout-section" id="checkout" style={{marginTop:"200px"}}>
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
            <img src="/assets/logo.png" alt="logo" style={{ width: "120px", height: "auto" }} />
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
