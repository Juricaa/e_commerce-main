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
  Select,
  Spinner,
  Badge,
} from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";

import type { Produit } from "../../types/produit";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/produitController";

// Configuration des options de catégorie
const categoryOptions = [
  { label: 'Électronique', value: 'electronique' },
  { label: 'Vêtements', value: 'vetements' },
  { label: 'Maison', value: 'maison' },
  { label: 'Sport', value: 'sport' },
  { label: 'Autre', value: 'autre' },
];

interface FormData {
  nom_produit: string;
  description: string;
  prix: string;
  stock: string;
  categorie: string;
  image: string;
}

export function ProductManagement() {
  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nom_produit: "",
    description: "",
    prix: "",
    stock: "",
    categorie: "autre",
    image: "",
  });

  // Récupérer tous les produits avec gestion d'erreur
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllProducts();
      console.log("Réponse API:", result); // Debug
      
      // Vérification robuste de la structure de réponse
      if (result && result.success && Array.isArray(result.data)) {
        setProducts(result.data);
      } else {
        console.error("Format de réponse invalide:", result);
        setProducts([]); // Fallback à un tableau vide
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setProducts([]); // Fallback à un tableau vide
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Gère l'ajout d'un nouveau produit
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      nom_produit: "",
      description: "",
      prix: "",
      stock: "",
      categorie: "autre",
      image: "",
    });
    setIsModalOpen(true);
  };

  // Gère l'édition d'un produit existant
  const handleEditProduct = (product: Produit) => {
    setEditingProduct(product);
    setFormData({
      nom_produit: product.nom_produit,
      description: product.description,
      prix: product.prix.toString(),
      stock: product.stock.toString(),
      categorie: product.categorie,
      image: product.image || "",
    });
    setIsModalOpen(true);
  };

  // Gère la suppression d'un produit
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id);
        await fetchProducts();
        console.log(`Produit ${id} supprimé.`);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Échec de la suppression du produit.");
      }
    }
  };

  // Sauvegarde/Mise à jour d'un produit
  const handleSaveProduct = async () => {
    if (!formData.nom_produit || !formData.description || !formData.prix || !formData.stock) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        nom_produit: formData.nom_produit,
        description: formData.description,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
        categorie: formData.categorie,
        image: formData.image || null,
      };

      if (editingProduct) {
        // MODE MISE À JOUR
        const result = await updateProduct(editingProduct.id_produit, payload);
        if (result.success) {
          await fetchProducts();
          setIsModalOpen(false);
        } else {
          alert("Erreur lors de la mise à jour du produit.");
        }
      } else {
        // MODE CRÉATION
        const result = await createProduct(payload);
        if (result.success) {
          await fetchProducts();
          setIsModalOpen(false);
        } else {
          alert("Erreur lors de la création du produit.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Erreur lors de l'enregistrement du produit.");
    } finally {
      setIsLoading(false);
    }
  };

  // Préparation des lignes pour la DataTable avec vérification
  const rows = Array.isArray(products) ? products.map((product) => [
    product.id_produit,
    product.nom_produit,
    product.description.length > 50 
      ? `${product.description.substring(0, 50)}...` 
      : product.description,
    `${parseFloat(product.prix.toString()).toFixed(2)} Ar`,
    <Badge 
      tone={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "critical"}
    >
      {product.stock} en stock
    </Badge>,
    product.categorie,
    product.image ? (
      <img 
        src={product.image} 
        alt={product.nom_produit} 
        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
      />
    ) : (
      <Text as="span" tone="subdued">Aucune image</Text>
    ),
    new Date(product.date_ajout).toLocaleDateString('fr-FR'),
    <div key={product.id_produit} style={{ display: "flex", gap: "8px" }}>
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
        onClick={() => handleDeleteProduct(product.id_produit)}
        disabled={isLoading}
      >
        Supprimer
      </Button>
    </div>,
  ]) : [];

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
              columnContentTypes={["text", "text", "text", "text", "text", "text", "text", "text", "text"]}
              headings={["ID", "Nom", "Description", "Prix", "Stock", "Catégorie", "Image", "Date d'ajout", "Actions"]}
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
                label="Nom du produit"
                value={formData.nom_produit}
                onChange={(value) => setFormData({ ...formData, nom_produit: value })}
                autoComplete="off"
                required
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                multiline={3}
                autoComplete="off"
                required
              />
              <TextField
                label="Prix (Ar)"
                type="number"
                value={formData.prix}
                onChange={(value) => setFormData({ ...formData, prix: value })}
                prefix="Ar"
                autoComplete="off"
                required
              />
              <TextField
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(value) => setFormData({ ...formData, stock: value })}
                autoComplete="off"
                required
              />
              <Select
                label="Catégorie"
                options={categoryOptions}
                value={formData.categorie}
                onChange={(value) => setFormData({ ...formData, categorie: value })}
              />
              <TextField
                label="URL de l'image"
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                autoComplete="off"
                placeholder="https://example.com/image.jpg"
                helpText="Optionnel - URL de l'image du produit"
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}