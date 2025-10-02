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
  Select,
  Badge,
} from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";

type Order = {
  id_commande: number;
  idClient: number;
  client_nom: string;
  produits: Array<{ id_produit: number; nom: string; quantite: number; prix: number }>;
  total: number;
  statut: 'En attente' | 'Confirmée' | 'En préparation' | 'Expédiée' | 'Livrée' | 'Annulée';
  adresse_livraison: string;
  date_commande: string;
};

const initialOrders: Order[] = [
  {
    id_commande: 1,
    idClient: 1,
    client_nom: "John Doe",
    produits: [
      { id_produit: 1, nom: "Produit 1", quantite: 2, prix: 10.99 },
      { id_produit: 2, nom: "Produit 2", quantite: 1, prix: 25.50 },
    ],
    total: 47.48,
    statut: "En attente",
    adresse_livraison: "123 Main St, City, Country",
    date_commande: new Date().toISOString(),
  },
  {
    id_commande: 2,
    idClient: 2,
    client_nom: "Jane Smith",
    produits: [
      { id_produit: 1, nom: "Produit 1", quantite: 1, prix: 10.99 },
    ],
    total: 10.99,
    statut: "Livrée",
    adresse_livraison: "456 Elm St, City, Country",
    date_commande: new Date().toISOString(),
  },
];

const statusOptions = [
  { label: 'En attente', value: 'En attente' },
  { label: 'Confirmée', value: 'Confirmée' },
  { label: 'En préparation', value: 'En préparation' },
  { label: 'Expédiée', value: 'Expédiée' },
  { label: 'Livrée', value: 'Livrée' },
  { label: 'Annulée', value: 'Annulée' },
];

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    idClient: "",
    client_nom: "",
    produits: "",
    total: "",
    statut: "En attente" as Order['statut'],
    adresse_livraison: "",
  });

  const handleAddOrder = () => {
    setEditingOrder(null);
    setFormData({
      idClient: "",
      client_nom: "",
      produits: "",
      total: "",
      statut: "En attente",
      adresse_livraison: "",
    });
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      idClient: order.idClient.toString(),
      client_nom: order.client_nom,
      produits: JSON.stringify(order.produits),
      total: order.total.toString(),
      statut: order.statut,
      adresse_livraison: order.adresse_livraison,
    });
    setIsModalOpen(true);
  };

  const handleDeleteOrder = (id: number) => {
    setOrders(orders.filter((o) => o.id_commande !== id));
  };

  const handleSaveOrder = () => {
    if (!formData.idClient || !formData.client_nom || !formData.total) return;

    let produits: Order['produits'] = [];
    try {
      produits = JSON.parse(formData.produits);
    } catch {
      // Invalid JSON, keep empty
    }

    const newOrder: Order = {
      id_commande: editingOrder ? editingOrder.id_commande : Math.max(...orders.map(o => o.id_commande)) + 1,
      idClient: parseInt(formData.idClient),
      client_nom: formData.client_nom,
      produits,
      total: parseFloat(formData.total),
      statut: formData.statut,
      adresse_livraison: formData.adresse_livraison,
      date_commande: editingOrder ? editingOrder.date_commande : new Date().toISOString(),
    };

    if (editingOrder) {
      setOrders(orders.map(o => o.id_commande === editingOrder.id_commande ? newOrder : o));
    } else {
      setOrders([...orders, newOrder]);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Livrée":
        return "success";
      case "En attente":
      case "Confirmée":
      case "En préparation":
        return "warning";
      case "Expédiée":
        return "info";
      case "Annulée":
        return "critical";
      default:
        return "new";
    }
  };

  const rows = orders.map((order) => [
    `#${order.id_commande}`,
    order.client_nom,
    order.produits.map(p => `${p.nom} (${p.quantite})`).join(", "),
    `${order.total}€`,
    <Badge key={order.id_commande} tone={getStatusColor(order.statut)}>
      {order.statut}
    </Badge>,
    order.adresse_livraison,
    new Date(order.date_commande).toLocaleDateString(),
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditOrder(order)}
      >
        Modifier
      </Button>
      <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteOrder(order.id_commande)}
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
            Gestion des Commandes
          </Text>
          <Button variant="primary" icon={PlusIcon} onClick={handleAddOrder}>
            Ajouter une Commande
          </Button>
        </div>
        <Card>
          <DataTable
            columnContentTypes={["text", "text", "text", "numeric", "text", "text", "text", "text"]}
            headings={["ID Commande", "Client", "Produits", "Total", "Statut", "Adresse Livraison", "Date", "Actions"]}
            rows={rows}
          />
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOrder ? "Modifier la Commande" : "Ajouter une Commande"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSaveOrder,
        }}
        secondaryActions={[
          {
            content: "Annuler",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleSaveOrder}>
            <FormLayout>
              <TextField
                label="ID Client"
                type="number"
                value={formData.idClient}
                onChange={(value) => setFormData({ ...formData, idClient: value })}
                autoComplete="off"
              />
              <TextField
                label="Nom Client"
                value={formData.client_nom}
                onChange={(value) => setFormData({ ...formData, client_nom: value })}
                autoComplete="off"
              />
              <TextField
                label="Produits (JSON)"
                value={formData.produits}
                onChange={(value) => setFormData({ ...formData, produits: value })}
                multiline
                autoComplete="off"
                helpText="Format: [{id_produit: 1, nom: 'Produit 1', quantite: 2, prix: 10.99}]"
              />
              <TextField
                label="Total"
                type="number"
                value={formData.total}
                onChange={(value) => setFormData({ ...formData, total: value })}
                autoComplete="off"
                suffix="€"
              />
              <Select
                label="Statut"
                options={statusOptions}
                value={formData.statut}
                onChange={(value) => setFormData({ ...formData, statut: value as Order['statut'] })}
              />
              <TextField
                label="Adresse de Livraison"
                value={formData.adresse_livraison}
                onChange={(value) => setFormData({ ...formData, adresse_livraison: value })}
                multiline
                autoComplete="off"
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}
