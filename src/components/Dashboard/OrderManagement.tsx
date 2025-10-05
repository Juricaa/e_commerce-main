import React, { useState, useEffect } from "react";
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
import { PlusIcon, EditIcon, DeleteIcon, CheckIcon } from "@shopify/polaris-icons";
import type { Commande, StatutCommande } from '../../types/commande';
import { 
  getAllCommandes, 
  createCommande, 
  updateCommande, 
  deleteCommande,
  getOrCreateClient,
  type CreateCommandeData,
  type ClientData 
} from '../../controllers/commandeController';

const statusOptions = [
  { label: 'En attente', value: 'en attente' },
  { label: 'Payée', value: 'payée' },
  { label: 'Expédiée', value: 'expédiée' },
  { label: 'Annulée', value: 'annulée' },
];

export function OrderManagement() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommande, setEditingCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    total: "",
    statut: "en attente" as StatutCommande,
  });

  // Charger les commandes au montage du composant
  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    try {
      setLoading(true);
      const result = await getAllCommandes();
      if (result.success) {
        setCommandes(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommande = () => {
    setEditingCommande(null);
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

  const handleEditCommande = (commande: Commande) => {
    setEditingCommande(commande);
    setFormData({
      nom: commande.client?.nom || "",
      prenom: commande.client?.prenom || "",
      email: commande.client?.email || "",
      telephone: "",
      adresse: "",
      total: commande.total.toString(),
      statut: commande.statut,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCommande = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.")) {
      return;
    }
    try {
      await deleteCommande(parseInt(id));
      setCommandes(commandes.filter(c => c.id_commande !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleMarkAsShipped = async (id: string) => {
    try {
      const result = await updateCommande(parseInt(id), { statut: 'expédiée' });
      if (result.success) {
        setCommandes(commandes.map(c =>
          c.id_commande === id ? { ...c, statut: 'expédiée' } : c
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleSaveCommande = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.total) {
      console.error('Champs obligatoires manquants');
      return;
    }

    try {
      if (editingCommande) {
        // Mise à jour d'une commande existante
        const updateData = {
          total: parseFloat(formData.total),
          statut: formData.statut,
        };
        const result = await updateCommande(parseInt(editingCommande.id_commande), updateData);
        if (result.success) {
          setCommandes(commandes.map(c => 
            c.id_commande === editingCommande.id_commande ? result.data : c
          ));
        }
      } else {
        // Création d'une nouvelle commande
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
          setCommandes([...commandes, result.data]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const getStatusColor = (status: StatutCommande) => {
    switch (status) {
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
  };

  const getStatusLabel = (status: StatutCommande) => {
    switch (status) {
      case "en attente": return "En attente";
      case "payée": return "Payée";
      case "expédiée": return "Expédiée";
      case "annulée": return "Annulée";
      default: return status;
    }
  };

  const rows = commandes.map((commande) => [
    `#${commande.id_commande}`,
    commande.client ? `${commande.client.prenom} ${commande.client.nom}` : `Client ${commande.id_client}`,
    commande.client?.email || "N/A",
    `${commande.total}Ar`,
    <Badge key={commande.id_commande} tone={getStatusColor(commande.statut)}>
      {getStatusLabel(commande.statut)}
    </Badge>,
    new Date(commande.date_commande).toLocaleDateString(),
    <div key={commande.id_commande} style={{ display: "flex", gap: "8px" }}>
       {commande.statut !== 'expédiée' && (<Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditCommande(commande)}
      >
        Modifier
      </Button>)}
      {commande.statut !== 'expédiée' && (
        <Button
          size="slim"
          icon={CheckIcon}
          onClick={() => handleMarkAsShipped(commande.id_commande)}
        >
          Expédier
        </Button>

        
      )}
      {commande.statut !== 'expédiée' &&( <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteCommande(commande.id_commande)}
      >
        Supprimer
      </Button>)}
    </div>,
  ]);

  return (
    <Layout>
      <Layout.Section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Text variant="headingLg" as="h1">
            Gestion des Commandes
          </Text>
          <Button variant="primary" icon={PlusIcon} onClick={handleAddCommande}>
            Ajouter une Commande
          </Button>
        </div>
        <Card>
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <Text as="p">Chargement des commandes...</Text>
            </div>
          ) : (
            <DataTable
              columnContentTypes={["text", "text", "text", "numeric", "text", "text", "text"]}
              headings={["ID Commande", "Client", "Email", "Total", "Statut", "Date", "Actions"]}
              rows={rows}
            />
          )}
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCommande ? "Modifier la Commande" : "Ajouter une Commande"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSaveCommande,
        }}
        secondaryActions={[
          {
            content: "Annuler",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleSaveCommande}>
            <FormLayout>
              <TextField
                label="Nom"
                value={formData.nom}
                onChange={(value) => setFormData({ ...formData, nom: value })}
                autoComplete="off"
                disabled={!!editingCommande}
              />
              <TextField
                label="Prénom"
                value={formData.prenom}
                onChange={(value) => setFormData({ ...formData, prenom: value })}
                autoComplete="off"
                disabled={!!editingCommande}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                autoComplete="off"
                disabled={!!editingCommande}
              />
              {!editingCommande && (
                <>
                  <TextField
                    label="Téléphone"
                    value={formData.telephone}
                    onChange={(value) => setFormData({ ...formData, telephone: value })}
                    autoComplete="off"
                  />
                  <TextField
                    label="Adresse"
                    value={formData.adresse}
                    onChange={(value) => setFormData({ ...formData, adresse: value })}
                    multiline
                    autoComplete="off"
                  />
                </>
              )}
              <TextField
                label="Total"
                type="number"
                value={formData.total}
                onChange={(value) => setFormData({ ...formData, total: value })}
                autoComplete="off"
                suffix="Ar"
              />
              <Select
                label="Statut"
                options={statusOptions}
                value={formData.statut}
                onChange={(value) => setFormData({ ...formData, statut: value as StatutCommande })}
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}