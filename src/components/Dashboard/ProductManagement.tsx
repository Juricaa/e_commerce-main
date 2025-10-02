import React, { useState } from "react";
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
} from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";

type Product = {
  id_produit: number;
  nom_produit: string;
  description: string;
  prix: number;
  stock: number;
  categorie: string;
  date_ajout: string;
  image: string;
};

const initialProducts: Product[] = [
  {
    id_produit: 1,
    nom_produit: "Produit 1",
    description: "Description du produit 1",
    prix: 10.99,
    stock: 100,
    categorie: "Catégorie A",
    date_ajout: new Date().toISOString(),
    image: "https://via.placeholder.com/100",
  },
  {
    id_produit: 2,
    nom_produit: "Produit 2",
    description: "Description du produit 2",
    prix: 25.50,
    stock: 50,
    categorie: "Catégorie B",
    date_ajout: new Date().toISOString(),
    image: "https://via.placeholder.com/100",
  },
];

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nom_produit: "",
    description: "",
    prix: "",
    stock: "",
    categorie: "",
    image: "",
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      nom_produit: "",
      description: "",
      prix: "",
      stock: "",
      categorie: "",
      image: "",
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nom_produit: product.nom_produit,
      description: product.description,
      prix: product.prix.toString(),
      stock: product.stock.toString(),
      categorie: product.categorie,
      image: product.image,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id_produit !== id));
  };

  const handleSaveProduct = () => {
    if (!formData.nom_produit || !formData.prix) return;

    const newProduct: Product = {
      id_produit: editingProduct ? editingProduct.id_produit : Math.max(...products.map(p => p.id_produit)) + 1,
      nom_produit: formData.nom_produit,
      description: formData.description,
      prix: parseFloat(formData.prix),
      stock: parseInt(formData.stock) || 0,
      categorie: formData.categorie,
      date_ajout: editingProduct ? editingProduct.date_ajout : new Date().toISOString(),
      image: formData.image,
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id_produit === editingProduct.id_produit ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  const rows = products.map((product) => [
    product.id_produit,
    <img src={product.image} alt={product.nom_produit} style={{ width: "50px", height: "50px" }} />,
    product.nom_produit,
    product.description,
    `${product.prix}€`,
    product.stock,
    product.categorie,
    new Date(product.date_ajout).toLocaleDateString(),
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditProduct(product)}
      >
        Modifier
      </Button>
      <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteProduct(product.id_produit)}
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
          <Button variant="primary" icon={PlusIcon} onClick={handleAddProduct}>
            Ajouter un Produit
          </Button>
        </div>
        <Card>
          <DataTable
            columnContentTypes={["numeric", "text", "text", "text", "numeric", "numeric", "text", "text", "text"]}
            headings={["ID", "Image", "Nom", "Description", "Prix", "Stock", "Catégorie", "Date d'ajout", "Actions"]}
            rows={rows}
          />
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Modifier le Produit" : "Ajouter un Produit"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSaveProduct,
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
                value={formData.nom_produit}
                onChange={(value) => setFormData({ ...formData, nom_produit: value })}
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
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}
