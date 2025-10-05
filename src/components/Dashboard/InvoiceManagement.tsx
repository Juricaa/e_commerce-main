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
import { PlusIcon, EditIcon, DeleteIcon, ExportIcon } from "@shopify/polaris-icons";
import type { Paiement, StatutPaiement, PaiementCreatePayload } from '../../types/paiement';
import { 
  getAllPaiements, 
  createPaiement, 
  updatePaiement, 
  deletePaiement 
} from '../../controllers/paiementController';

const statusOptions = [
  { label: 'En attente', value: 'en attente' },
  { label: 'Effectué', value: 'effectué' },
  { label: 'Échoué', value: 'échoué' },
  { label: 'Remboursé', value: 'remboursé' },
];

const methodePaiementOptions = [
  { label: 'Mobile Money', value: 'mobile_money' },
  { label: 'Carte Bancaire', value: 'carte_bancaire' },
  { label: 'Virement', value: 'virement' },
  { label: 'Espèces', value: 'especes' },
];

// Fonction pour formater les montants en Ariary
const formatAriary = (montant: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' Ar';
};

// Fonction pour convertir depuis les euros (si nécessaire) - à adapter selon votre logique
const convertirEnAriary = (montant: number): number => {
  // Taux de conversion approximatif (à ajuster selon vos besoins)
  // 1€ ≈ 4500 Ar (valeur indicative)
  return Math.round(montant * 4500);
};

export function InvoiceManagement() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState<Paiement | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    montant: "",
    methode_paiement: "mobile_money",
    statut_paiement: "en attente" as StatutPaiement,
    id_commande: "",
  });

  // Charger les paiements au montage du composant
  useEffect(() => {
    loadPaiements();
  }, []);

  const loadPaiements = async () => {
    try {
      setLoading(true);
      const result = await getAllPaiements();
      if (result.success) {
        setPaiements(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaiement = () => {
    setEditingPaiement(null);
    setFormData({
      montant: "",
      methode_paiement: "mobile_money",
      statut_paiement: "en attente",
      id_commande: "",
    });
    setIsModalOpen(true);
  };

  const handleEditPaiement = (paiement: Paiement) => {
    setEditingPaiement(paiement);
    setFormData({
      montant: paiement.montant.toString(),
      methode_paiement: paiement.methode_paiement,
      statut_paiement: paiement.statut_paiement,
      id_commande: paiement.id_commande.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDeletePaiement = async (id: number) => {
    try {
      await deletePaiement(id);
      setPaiements(paiements.filter(p => p.id_paiement !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSavePaiement = async () => {
    if (!formData.montant || !formData.id_commande) {
      console.error('Champs obligatoires manquants');
      return;
    }

    try {
      if (editingPaiement) {
        // Mise à jour d'un paiement existant
        const updateData = {
          montant: parseFloat(formData.montant),
          methode_paiement: formData.methode_paiement,
          statut_paiement: formData.statut_paiement,
        };
        const result = await updatePaiement(editingPaiement.id_paiement, updateData);
        if (result.success) {
          setPaiements(paiements.map(p => 
            p.id_paiement === editingPaiement.id_paiement ? result.data : p
          ));
        }
      } else {
        // Création d'un nouveau paiement
        const payload: PaiementCreatePayload = {
          montant: parseFloat(formData.montant),
          methode_paiement: formData.methode_paiement,
          statut_paiement: formData.statut_paiement,
          id_commande: formData.id_commande,
        };

        const result = await createPaiement(payload);
        if (result.success) {
          setPaiements([...paiements, result.data]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDownloadPaiement = (paiement: Paiement) => {
    // Génération d'un reçu de paiement
    const reçuData = `
REÇU DE PAIEMENT
================
REÇU n°: #'REG-${paiement.id_paiement}'
Commande n°: #${paiement.id_commande}
Montant: ${formatAriary(paiement.montant)}
Méthode: ${paiement.methode_paiement}
Statut: ${getStatusLabel(paiement.statut_paiement)}
Date: ${new Date(paiement.date_paiement).toLocaleDateString('fr-FR')}

Détails Commande:
${paiement.commande_details ? `
- Date commande: ${new Date(paiement.commande_details.date_commande).toLocaleDateString('fr-FR')}
- Total commande: ${formatAriary(paiement.commande_details.total)}
- Statut: ${paiement.commande_details.statut}
` : 'Non disponible'}

Merci pour votre confiance!
    `.trim();

    const blob = new Blob([reçuData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paiement-${paiement.id_paiement}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: StatutPaiement) => {
    switch (status) {
      case "effectué":
        return "success";
      case "en attente":
        return "warning";
      case "échoué":
        return "critical";
      case "remboursé":
        return "info";
      default:
        return "new";
    }
  };

  const getStatusLabel = (status: StatutPaiement) => {
    switch (status) {
      case "en attente": return "En attente";
      case "effectué": return "Effectué";
      case "échoué": return "Échoué";
      case "remboursé": return "Remboursé";
      default: return status;
    }
  };

  const getMethodeLabel = (methode: string) => {
    switch (methode) {
      case "mobile_money": return "Mobile Money";
      case "carte_bancaire": return "Carte Bancaire";
      case "virement": return "Virement";
      case "especes": return "Espèces";
      default: return methode;
    }
  };

  const rows = paiements.map((paiement) => [
    `#${paiement.id_paiement}`,
    `#${paiement.id_commande}`,
    formatAriary(paiement.montant),
    getMethodeLabel(paiement.methode_paiement),
    <Badge key={paiement.id_paiement} tone={getStatusColor(paiement.statut_paiement)}>
      {getStatusLabel(paiement.statut_paiement)}
    </Badge>,
    new Date(paiement.date_paiement).toLocaleDateString('fr-FR'),
    <div key={paiement.id_paiement} style={{ display: "flex", gap: "8px" }}>
      <Button
        size="slim"
        icon={ExportIcon}
        onClick={() => handleDownloadPaiement(paiement)}
      >
        Reçu
      </Button>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditPaiement(paiement)}
      >
        Modifier
      </Button>
     <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeletePaiement(paiement.id_paiement)}
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
            Gestion des Paiements
          </Text>
          <Button variant="primary" icon={PlusIcon} onClick={handleAddPaiement}>
            Ajouter un Paiement
          </Button>
        </div>
        <Card>
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <Text as="p">Chargement des paiements...</Text>
            </div>
          ) : (
            <DataTable
              columnContentTypes={["text", "text", "numeric", "text", "text", "text", "text"]}
              headings={["ID Paiement", "ID Commande", "Montant", "Méthode", "Statut", "Date", "Actions"]}
              rows={rows}
            />
          )}
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPaiement ? "Modifier le Paiement" : "Ajouter un Paiement"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSavePaiement,
        }}
        secondaryActions={[
          {
            content: "Annuler",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleSavePaiement}>
            <FormLayout>
              <TextField
                label="ID Commande"
                type="text"
                value={formData.id_commande}
                onChange={(value) => setFormData({ ...formData, id_commande: value })}
                autoComplete="off"
                disabled={!!editingPaiement}
              />
              <TextField
                label="Montant"
                type="number"
                value={formData.montant}
                onChange={(value) => setFormData({ ...formData, montant: value })}
                autoComplete="off"
                suffix="Ar"
                helpText="Montant en Ariary"
                disabled={!!editingPaiement}
              />
              <Select
                label="Méthode de paiement"
                options={methodePaiementOptions}
                value={formData.methode_paiement}
                onChange={(value) => setFormData({ ...formData, methode_paiement: value })}
              />
              <Select
                label="Statut"
                options={statusOptions}
                value={formData.statut_paiement}
                onChange={(value) => setFormData({ ...formData, statut_paiement: value as StatutPaiement })}
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}