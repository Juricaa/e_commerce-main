import { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import "../../styles/storefront.css";
import logo from "../../assets/logo.png";

// Importation des types
import type { Produit } from "../../types/produit";

// Importation des contrôleurs
import { getAllProducts } from "../../controllers/produitController";
import { API_BASE_image } from "../../controllers/baseUrl";

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

  // --- État pour le filtrage par catégorie ---
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  // --- Cart context ---
  const { cartCount, addToCart } = useCart();

  // --- LOGIQUE DE RÉCUPÉRATION DES PRODUITS ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const productList = await getAllProducts();
      setProducts(productList.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- LOGIQUE DE FILTRAGE PAR CATÉGORIE ---
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.categorie)));
    return ["Tous", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Tous") return products;
    return products.filter(p => p.categorie === selectedCategory);
  }, [products, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="storefront-page">
      <div classname="storefront-footer" style ={{background:"#0f172a", position:"fixed", right:"0",left:"0", zIndex:"100"}}> 
      <header className="storefront-navbar" style={{ top: 0, zIndex: 1000 , width: "100%"}}>
        <div className="navbar-branding">
          <span className="brand-mark" >
            <img src={logo} alt="logo" style={{ width: "120px", height: "auto" }}/>
          </span>
          
        </div>
        <div className="navbar-actions" >
          <a className="navbar-link" href="#collections" style={{color: "white"}}>
              Produits
            </a>
          
            <a className="navbar-link" href="#contact" style={{color: "white"}}>
              Contact
            </a>
          <Link className="cart-link" to="/checkout" style={{color: "white"}}>
            Panier ({cartCount})
          </Link>
          <Link className="account-link" to="/login">
            Connexion équipe
          </Link>
        </div>
      </header>
      </div>
      <main>
        <section className="storefront-hero" id="home" style={{marginTop:"170px"}}>
          <div className="hero-content">
            <p className="hero-eyebrow">Nouvelle collection</p>
            <h1 className="hero-title" style={{color:"orange"}}>E-commerce</h1>
            <p className="hero-description">
              Découvre tous nos produits et n’hésite pas à commander si quelque chose t’intéresse !
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

          {!isLoading && (
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="loading-message">Chargement des produits...</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id_produit} className="product-card">
                  <div className="product-image-wrapper">
                    
                    <img   src={`${API_BASE_image}${product.image}`  || "/placeholder-image.jpg"} alt={product.nom_produit} />
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
                        onClick={() => addToCart(product)}
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