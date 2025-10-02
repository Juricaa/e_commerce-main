import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toDataURL } from "qrcode";
import "../../styles/storefront.css";
import logo from "../../assets/logo.png";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
};

type JournalEntry = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
};

type CartLine = {
  product: Product;
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

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

const featuredProducts: Product[] = [
  {
    id: "linen-shirt",
    name: "Seaside Linen Shirt",
    description: "Breathable linen with a relaxed silhouette for effortless summer styling.",
    price: 68,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=960&q=80",
    tag: "Bestseller",
  },
  {
    id: "wrap-dress",
    name: "Aurora Wrap Dress",
    description: "Soft satin finish with an adjustable wrap waist and flowing midi skirt.",
    price: 112,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "woven-tote",
    name: "Harbor Woven Tote",
    description: "Handwoven raffia tote with leather handles and roomy interior pockets.",
    price: 84,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=960&q=80",
    tag: "Limited",
  },
  {
    id: "tailored-trousers",
    name: "Paragon Tailored Trousers",
    description: "Cropped pleated trousers crafted from lightweight Italian wool.",
    price: 96,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "silk-scarf",
    name: "Atelier Silk Scarf",
    description: "Illustrated silk scarf finished with rolled hems and hand-painted edges.",
    price: 58,
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "leather-sandals",
    name: "Solstice Leather Sandals",
    description: "Minimalist strappy sandals made with vegetable-tanned leather.",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=960&q=80",
  },
];

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

const formatPrice = (value: number) => currencyFormatter.format(value);

export function Storefront() {
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [feedback, setFeedback] = useState<CheckoutFeedback | null>(null);
  const [orderQr, setOrderQr] = useState<OrderQr | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartCount = useMemo(
    () => cartItems.reduce((total, line) => total + line.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, line) => total + line.product.price * line.quantity, 0),
    [cartItems],
  );

  const handleAddToCart = (product: Product) => {
    setCartItems((previous) => {
      const existingLine = previous.find((line) => line.product.id === product.id);
      if (existingLine) {
        return previous.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + 1 }
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
        .map((line) =>
          line.product.id === productId
            ? { ...line, quantity: Math.max(1, line.quantity + delta) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((previous) => previous.filter((line) => line.product.id !== productId));
  };

  const resetCheckoutForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerAddress("");
    setCustomerNote("");
  };

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setFeedback({ type: "error", message: "Votre panier est vide." });
      return;
    }

    setIsSubmitting(true);

    const reference = `EL-${Date.now().toString(36).toUpperCase()}`;
    const payload = {
      reference,
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim(),
      },
      address: customerAddress.trim(),
      note: customerNote.trim(),
      total: cartTotal,
      items: cartItems.map((line) => ({
        id: line.product.id,
        quantity: line.quantity,
        price: line.product.price,
      })),
      createdAt: new Date().toISOString(),
    };

    try {
      const dataUrl = await toDataURL(JSON.stringify(payload), {
        errorCorrectionLevel: "M",
        width: 320,
      });
      setOrderQr({ reference, dataUrl });
      setFeedback({
        type: "success",
        message:
          "Commande confirmée ! Présentez ce QR code au livreur lors de la livraison.",
      });
      setCartItems([]);
      resetCheckoutForm();
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Nous n'avons pas pu générer le QR code. Veuillez réessayer.",
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
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} />
                  {product.tag ? (
                    <span className="product-tag" role="status">
                      {product.tag}
                    </span>
                  ) : null}
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <button
                      className="product-action"
                      type="button"
                      onClick={() => handleAddToCart(product)}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

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
                    <li key={line.product.id} className="cart-item">
                      <div className="cart-item-details">
                        <h4>{line.product.name}</h4>
                        <p>{formatPrice(line.product.price)}</p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-controls" aria-label="Modifier la quantité">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.product.id, -1)}
                            aria-label="Diminuer la quantité"
                          >
                            −
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.product.id, 1)}
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="remove-item"
                          type="button"
                          onClick={() => removeFromCart(line.product.id)}
                        >
                          Retirer
                        </button>
                        <span className="line-total">
                          {formatPrice(line.product.price * line.quantity)}
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
              <h3>Informations client</h3>
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
                  placeholder="12 rue Paradis, Marseille"
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
                {isSubmitting ? "Génération du QR code…" : "Confirmer la commande"}
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
