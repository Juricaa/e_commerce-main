import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Card,
  Button,
  Text,
  DataTable,
  Modal,
  Form,
  FormLayout,
  TextField,
  Spinner, // Ajout pour l'indicateur de chargement
} from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";

// Assurez-vous d'importer vos fonctions du contrôleur d'API et les types
import { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct
} from "../../controllers/produitController"; 

import type {NewProductData,
  UpdateProductData} from "../../controllers/produitController"
  
import type { Product } from "../../types/produit"; // Assurez-vous que le chemin est correct


// Type pour les données du formulaire (tous les champs sont des chaînes)
interface FormData {
    nomProduit: string;
    description: string;
    prix: string;
    stock: string;
    categorie: string;
    image: string;
    dateAjout: string; // Changer le type de Date à string
}

// Initialisation des données (vide car elles seront chargées par l'API)
const initialFormData: FormData = {
    nomProduit: "",
    description: "",
    prix: "",
    stock: "",
    categorie: "",
    image: "",
    dateAjout: "",
};


export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // 1. 🚨 LOGIQUE POUR RÉCUPÉRER LES PRODUITS (READ) 🚨
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const productList = await getAllProducts();
    setProducts(productList);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
    
  }, [fetchProducts]);

  // Gère l'ajout d'un nouveau produit
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  // Gère l'édition d'un produit existant
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nomProduit: product.nomProduit,
      description: product.description,
      prix: product.prix.toString(),
      stock: product.stock.toString(),
      categorie: product.categorie,
      image: product.image,
      dateAjout: new Date(product.dateAjout).toISOString().split('T')[0], // Formater la date pour l'input type="date"
    });
    
    setIsModalOpen(true);
  };

  // 2. 🚨 LOGIQUE POUR SUPPRIMER UN PRODUIT (DELETE) 🚨
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setIsLoading(true);
      const success = await deleteProduct(id);
      if (success) {
        await fetchProducts(); 
        console.log(`Produit ${id} supprimé.`);
      } else {
        alert("Échec de la suppression du produit.");
      }
      setIsLoading(false);
    }
  };

  // 3. 🚨 LOGIQUE POUR SAUVEGARDER/MODIFIER (CREATE/UPDATE) 🚨
  const handleSaveProduct = async () => {
    // Validation minimale
    if (!formData.nomProduit || !formData.prix || isNaN(parseFloat(formData.prix))) {
        alert("Nom et Prix sont requis et doivent être valides.");
        return;
    }

    setIsLoading(true);
    let success = false;
    
    // Conversion des chaînes en nombres pour l'API
    const payload: NewProductData = {
      nomProduit: formData.nomProduit,
      description: formData.description,
      prix: parseFloat(formData.prix),
      stock: parseInt(formData.stock) || 0,
      categorie: formData.categorie,
      image: formData.image,
      
    };

    if (editingProduct) {
      // MODE MISE À JOUR (PUT)
      // On utilise UpdateProductData car c'est un type Partiel dans le contrôleur
      const updatedProduct = await updateProduct(editingProduct.idProduit, payload as UpdateProductData);
      success = !!updatedProduct;
    } else {
      // MODE CRÉATION (POST)
      const newProduct = await createProduct(payload);
      success = !!newProduct;
    }

    if (success) {
      await fetchProducts(); // Rafraîchir la liste après sauvegarde
      setIsModalOpen(false);
    } else {
      alert("Erreur lors de l'enregistrement du produit. Vérifiez la console pour plus de détails.");
    }
    setIsLoading(false);
  };

  // Préparation des lignes pour la DataTable
  const rows = products.map((product) => [
    product.idProduit,
    <img key={`img-${product.idProduit}`} src={product.image || "https://via.placeholder.com/50"} alt={product.nomProduit} style={{ width: "50px", height: "50px", objectFit: 'cover' }} />,
    product.nomProduit,
    product.description,
    `${product.prix.toFixed(2)}Ar`,
    product.stock,
    product.categorie,
    new Date(product.dateAjout).toLocaleDateString(),
    <div key={`actions-${product.idProduit}`} style={{ display: "flex", gap: "8px" }}>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditProduct(product)}
        disabled={isLoading}
      >
        Modifier
      </Button>
      <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteProduct(product.idProduit)}
        disabled={isLoading}
      >
        Supprimer
      </Button>
    </div>,
  ]);

  return (
    <Layout>
      <Layout.Section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Text variant="headingLg" as="h1">
            Gestion des Produits
          </Text>
          <Button variant="primary" icon={PlusIcon} onClick={handleAddProduct} disabled={isLoading}>
            Ajouter un Produit
          </Button>
        </div>
        <Card>
          {isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Spinner accessibilityLabel="Chargement des produits" size="large" />
            </div>
          ) : (
            <DataTable
              columnContentTypes={["numeric", "text", "text", "text", "numeric", "numeric", "text", "text", "text"]}
              headings={["ID", "Image", "Nom", "Description", "Prix", "Stock", "Catégorie", "Date d'ajout", "Actions"]}
              rows={rows}
            />
          )}
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Modifier le Produit" : "Ajouter un Produit"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSaveProduct,
          loading: isLoading,
          disabled: isLoading,
        }}
        secondaryActions={[
          {
            content: "Annuler",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleSaveProduct}>
            <FormLayout>
              <TextField
                label="Nom du Produit"
                value={formData.nomProduit}
                onChange={(value) => setFormData({ ...formData, nomProduit: value })}
                autoComplete="off"
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                multiline
                autoComplete="off"
              />
              <TextField
                label="Prix"
                type="number"
                value={formData.prix}
                onChange={(value) => setFormData({ ...formData, prix: value })}
                autoComplete="off"
                suffix="€"
              />
              <TextField
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(value) => setFormData({ ...formData, stock: value })}
                autoComplete="off"
              />
              <TextField
                label="Catégorie"
                value={formData.categorie}
                onChange={(value) => setFormData({ ...formData, categorie: value })}
                autoComplete="off"
              />
              <TextField
                label="Image URL"
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                autoComplete="off"
              />

              <TextField
                // visible={false} // 'visible' n'est pas une prop valide pour TextField
                type="date"
                label="Date d'ajout"
                value={formData.dateAjout || ''} // Assurez-vous que la valeur est une chaîne vide si non définie
                onChange={(value) => setFormData({ ...formData, dateAjout: value })}
                autoComplete="off"
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}