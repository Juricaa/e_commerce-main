import React, { useState, useEffect } from "react";
import {
  Card,
  DataTable,
  Badge,
  Button,
  Text,
  ButtonGroup,
  Spinner,
  Modal,
  Form,
  FormLayout,
  TextField,
  Select,
} from "@shopify/polaris";
import { getAllCommandes, createCommande, type CreateCommandeData, type ClientData } from "../../../controllers/commandeController";
import type { Commande, StatutCommande } from "../../../types/commande";

export function OrdersTable() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    total: "",
    statut: "en attente" as StatutCommande,
  });

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const result = await getAllCommandes();
        if (result.success) {
          setCommandes(result.data.slice(0, 10)); // Limit to 10 for display
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  const handleCreateOrder = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      total: "",
      statut: "en attente",
    });
    setIsModalOpen(true);
  };

  const handleSaveOrder = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.total) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const clientData: ClientData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
      };

      const commandeData: CreateCommandeData = {
        client: clientData,
        total: parseFloat(formData.total),
        statut: formData.statut,
      };

      const result = await createCommande(commandeData);
      if (result.success) {
        setCommandes([result.data, ...commandes.slice(0, 9)]); // Add new and keep 10
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };

  if (loading) {
    return (
      <Card>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Spinner accessibilityLabel="Loading orders" size="small" />
          <Text as="p">Loading orders...</Text>
        </div>
      </Card>
    );
  }

  const rows = commandes.map((commande) => [
    `#${commande.id_commande}`,
    <div key={commande.id_commande} className="customer-cell">
      <Text as="p" variant="bodyMd">
        {commande.client ? `${commande.client.prenom} ${commande.client.nom}` : `Client ${commande.id_client}`}
      </Text>
      <Text as="p" variant="bodySm" tone="subdued">
        {commande.client?.email || "N/A"}
      </Text>
    </div>,
    new Date(commande.date_commande).toLocaleDateString(),
    <Badge key={commande.id_commande} tone={getStatusColor(commande.statut)}>
      {getStatusLabel(commande.statut)}
    </Badge>,
    "N/A", // No country in Commande
    <Text as="p" key={commande.id_commande} alignment="end">
      {`${commande.total}Ar`}
    </Text>,
  ]);

  return (
    <>
    <Card>
      <div className="orders-header">
        <Text as="h2" variant="headingMd">Orders Status</Text>
        <ButtonGroup>
          <Button>Jan 2024</Button>
          <Button variant="primary" onClick={handleCreateOrder}>Create order</Button>
        </ButtonGroup>
      </div>
      <DataTable
        columnContentTypes={["text", "text", "text", "text", "text", "numeric"]}
        headings={["Order", "Customer", "Date", "Status", "Country", "Total"]}
        rows={rows}
      />
    </Card>

    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Create New Order"
      primaryAction={{
        content: "Save",
        onAction: handleSaveOrder,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => setIsModalOpen(false),
        },
      ]}
    >
      <Modal.Section>
        <Form onSubmit={handleSaveOrder}>
          <FormLayout>
            <TextField
              label="First Name"
              value={formData.prenom}
              onChange={(value) => setFormData({ ...formData, prenom: value })}
              autoComplete="off"
            />
            <TextField
              label="Last Name"
              value={formData.nom}
              onChange={(value) => setFormData({ ...formData, nom: value })}
              autoComplete="off"
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              autoComplete="off"
            />
            <TextField
              label="Phone"
              value={formData.telephone}
              onChange={(value) => setFormData({ ...formData, telephone: value })}
              autoComplete="off"
            />
            <TextField
              label="Address"
              value={formData.adresse}
              onChange={(value) => setFormData({ ...formData, adresse: value })}
              multiline
              autoComplete="off"
            />
            <TextField
              label="Total"
              type="number"
              value={formData.total}
              onChange={(value) => setFormData({ ...formData, total: value })}
              autoComplete="off"
              suffix="Ar"
            />
            <Select
              label="Status"
              options={[
                { label: 'En attente', value: 'en attente' },
                { label: 'Payée', value: 'payée' },
                { label: 'Expédiée', value: 'expédiée' },
                { label: 'Annulée', value: 'annulée' },
              ]}
              value={formData.statut}
              onChange={(value) => setFormData({ ...formData, statut: value as StatutCommande })}
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
    </>
  );
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "payée":
      return "success";
    case "en attente":
      return "warning";
    case "expédiée":
      return "info";
    case "annulée":
      return "critical";
    default:
      return "new";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "en attente": return "En attente";
    case "payée": return "Payée";
    case "expédiée": return "Expédiée";
    case "annulée": return "Annulée";
    default: return status;
  }
}
