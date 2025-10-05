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
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import type { Inventory } from '../../types/inventaire';
import { 
  getAllInventories, 
  createInventory, 
  updateInventory, 
  deleteInventory 
} from '../../controllers/invetaireController';

const mouvementOptions = [
  { label: 'Entrée', value: 'ENTREE' },
  { label: 'Sortie', value: 'SORTIE' },
];

export function InventaireManagement() {
  const [inventaires, setInventaires] = useState<Inventory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventaire, setEditingInventaire] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mouvement: "ENTREE" as 'ENTREE' | 'SORTIE',
    quantite: "",
    id_produit: "",
    commentaire: "",
  });

  // Charger les inventaires au montage du composant
  useEffect(() => {
    loadInventaires();
  }, []);

  const loadInventaires = async () => {
    try {
      setLoading(true);
      const result = await getAllInventories();
      if (result.success) {
        setInventaires(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des inventaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInventaire = () => {
    setEditingInventaire(null);
    setFormData({
      mouvement: "ENTREE",
      quantite: "",
      id_produit: "",
      commentaire: "",
    });
    setIsModalOpen(true);
  };

  const handleEditInventaire = (inventaire: Inventory) => {
    setEditingInventaire(inventaire);
    setFormData({
      mouvement: inventaire.mouvement,
      quantite: inventaire.quantite.toString(),
      id_produit: inventaire.id_produit,
      commentaire: inventaire.commentaire || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteInventaire = async (id: number) => {
    try {
      await deleteInventory(id);
      setInventaires(inventaires.filter(i => i.id_inventaire !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSaveInventaire = async () => {
    if (!formData.quantite || !formData.id_produit) {
      console.error('Champs obligatoires manquants');
      return;
    }

    try {
      if (editingInventaire) {
        // Mise à jour d'un inventaire existant
        const updateData = {
          mouvement: formData.mouvement,
          quantite: parseInt(formData.quantite),
          id_produit: formData.id_produit,
          commentaire: formData.commentaire || null,
        };
        const result = await updateInventory(editingInventaire.id_inventaire, updateData);
        if (result.success) {
          setInventaires(inventaires.map(i => 
            i.id_inventaire === editingInventaire.id_inventaire ? result.data : i
          ));
        }
      } else {
        // Création d'un nouvel inventaire
        const newInventory = {
          mouvement: formData.mouvement,
          quantite: parseInt(formData.quantite),
          id_produit: formData.id_produit,
          commentaire: formData.commentaire || null,
          date_mouvement: new Date().toISOString(),
        };

        const result = await createInventory(newInventory);
        if (result.success) {
          setInventaires([...inventaires, result.data]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const getMouvementColor = (mouvement: string) => {
    switch (mouvement) {
      case "ENTREE":
        return "success";
      case "SORTIE":
        return "critical";
      default:
        return "new";
    }
  };

  const getMouvementLabel = (mouvement: string) => {
    switch (mouvement) {
      case "ENTREE": return "Entrée";
      case "SORTIE": return "Sortie";
      default: return mouvement;
    }
  };

  const getProduitNom = (inventaire: Inventory) => {
    return inventaire.produit_details?.nom_produit || `Produit ${inventaire.id_produit}`;
  };

  const rows = inventaires.map((inventaire) => [
    `#${inventaire.id_inventaire}`,
    getProduitNom(inventaire),
    <Badge key={inventaire.id_inventaire} tone={getMouvementColor(inventaire.mouvement)}>
      {getMouvementLabel(inventaire.mouvement)}
    </Badge>,
    inventaire.quantite.toString(),
    inventaire.commentaire || "-",
    new Date(inventaire.date_mouvement).toLocaleDateString('fr-FR'),
    <div key={inventaire.id_inventaire} style={{ display: "flex", gap: "8px" }}>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditInventaire(inventaire)}
      >
        Modifier
      </Button>
      <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteInventaire(inventaire.id_inventaire)}
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
            Gestion des Mouvements d'Inventaire
          </Text>
          <Button variant="primary" icon={PlusIcon} onClick={handleAddInventaire}>
            Ajouter un Mouvement
          </Button>
        </div>
        <Card>
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <Text as="p">Chargement des mouvements d'inventaire...</Text>
            </div>
          ) : (
            <DataTable
              columnContentTypes={["text", "text", "text", "numeric", "text", "text", "text"]}
              headings={["ID Mouvement", "Produit", "Type", "Quantité", "Commentaire", "Date", "Actions"]}
              rows={rows}
            />
          )}
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInventaire ? "Modifier le Mouvement" : "Ajouter un Mouvement"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSaveInventaire,
        }}
        secondaryActions={[
          {
            content: "Annuler",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleSaveInventaire}>
            <FormLayout>
              <Select
                label="Type de mouvement"
                options={mouvementOptions}
                value={formData.mouvement}
                onChange={(value) => setFormData({ ...formData, mouvement: value as 'ENTREE' | 'SORTIE' })}
              />
              <TextField
                label="ID Produit"
                value={formData.id_produit}
                onChange={(value) => setFormData({ ...formData, id_produit: value })}
                autoComplete="off"
                disabled={!!editingInventaire}
              />
              <TextField
                label="Quantité"
                type="number"
                value={formData.quantite}
                onChange={(value) => setFormData({ ...formData, quantite: value })}
                autoComplete="off"
                min="1"
              />
              <TextField
                label="Commentaire"
                value={formData.commentaire}
                onChange={(value) => setFormData({ ...formData, commentaire: value })}
                multiline={3}
                autoComplete="off"
                helpText="Optionnel : raison du mouvement (réapprovisionnement, vente, etc.)"
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}