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
import { PlusIcon, EditIcon, DeleteIcon, ExportIcon } from "@shopify/polaris-icons";

type Invoice = {
  id_facture: number;
  id_commande: number;
  montant: number;
  date_facture: string;
  statut: 'Payée' | 'En attente' | 'Annulée';
};

const initialInvoices: Invoice[] = [
  {
    id_facture: 1,
    id_commande: 1,
    montant: 47.48,
    date_facture: new Date().toISOString(),
    statut: "En attente",
  },
  {
    id_facture: 2,
    id_commande: 2,
    montant: 10.99,
    date_facture: new Date().toISOString(),
    statut: "Payée",
  },
];

const statusOptions = [
  { label: 'Payée', value: 'Payée' },
  { label: 'En attente', value: 'En attente' },
  { label: 'Annulée', value: 'Annulée' },
];

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    id_commande: "",
    montant: "",
    statut: "En attente" as Invoice['statut'],
  });

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setFormData({
      id_commande: "",
      montant: "",
      statut: "En attente",
    });
    setIsModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      id_commande: invoice.id_commande.toString(),
      montant: invoice.montant.toString(),
      statut: invoice.statut,
    });
    setIsModalOpen(true);
  };

  const handleDeleteInvoice = (id: number) => {
    setInvoices(invoices.filter((i) => i.id_facture !== id));
  };

  const handleSaveInvoice = () => {
    if (!formData.id_commande || !formData.montant) return;

    const newInvoice: Invoice = {
      id_facture: editingInvoice ? editingInvoice.id_facture : Math.max(...invoices.map(i => i.id_facture)) + 1,
      id_commande: parseInt(formData.id_commande),
      montant: parseFloat(formData.montant),
      statut: formData.statut,
      date_facture: editingInvoice ? editingInvoice.date_facture : new Date().toISOString(),
    };

    if (editingInvoice) {
      setInvoices(invoices.map(i => i.id_facture === editingInvoice.id_facture ? newInvoice : i));
    } else {
      setInvoices([...invoices, newInvoice]);
    }
    setIsModalOpen(false);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Simple download simulation - in real app, generate PDF
    const invoiceData = `Facture #${invoice.id_facture}\nCommande: ${invoice.id_commande}\nMontant: ${invoice.montant}€\nStatut: ${invoice.statut}\nDate: ${new Date(invoice.date_facture).toLocaleDateString()}`;
    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${invoice.id_facture}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Payée":
        return "success";
      case "En attente":
        return "warning";
      case "Annulée":
        return "critical";
      default:
        return "new";
    }
  };

  const rows = invoices.map((invoice) => [
    `#${invoice.id_facture}`,
    `#${invoice.id_commande}`,
    `${invoice.montant}€`,
    <Badge key={invoice.id_facture} tone={getStatusColor(invoice.statut)}>
      {invoice.statut}
    </Badge>,
    new Date(invoice.date_facture).toLocaleDateString(),
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        size="slim"
        icon={ExportIcon}
        onClick={() => handleDownloadInvoice(invoice)}
      >
        Télécharger
      </Button>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditInvoice(invoice)}
      >
        Modifier
      </Button>
      <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteInvoice(invoice.id_facture)}
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
            Gestion des Factures
          </Text>
          <Button variant="primary" icon={PlusIcon} onClick={handleAddInvoice}>
            Ajouter une Facture
          </Button>
        </div>
        <Card>
          <DataTable
            columnContentTypes={["text", "text", "numeric", "text", "text", "text"]}
            headings={["ID Facture", "ID Commande", "Montant", "Statut", "Date", "Actions"]}
            rows={rows}
          />
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInvoice ? "Modifier la Facture" : "Ajouter une Facture"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSaveInvoice,
        }}
        secondaryActions={[
          {
            content: "Annuler",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleSaveInvoice}>
            <FormLayout>
              <TextField
                label="ID Commande"
                type="number"
                value={formData.id_commande}
                onChange={(value) => setFormData({ ...formData, id_commande: value })}
                autoComplete="off"
              />
              <TextField
                label="Montant"
                type="number"
                value={formData.montant}
                onChange={(value) => setFormData({ ...formData, montant: value })}
                autoComplete="off"
                suffix="€"
              />
              <Select
                label="Statut"
                options={statusOptions}
                value={formData.statut}
                onChange={(value) => setFormData({ ...formData, statut: value as Invoice['statut'] })}
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}
