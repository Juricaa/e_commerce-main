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
  Checkbox,
} from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";

import type { Utilisateur, UtilisateurCreatePayload } from "../../types/utilisateur";
import {
  getAllUtilisateurs,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
  toggleUtilisateurStatus,
} from "../../controllers/utilisateurController";

// Configuration des options de rôle
const roleOptions = [
  { label: 'Administrateur', value: 'admin' },
  { label: 'Livreur', value: 'livreur' },
];

// Définit le type pour les données du formulaire
interface FormData {
  nom: string;
  prenom: string;
  role: 'admin' | 'livreur';
  email: string;
  mot_de_passe: string;
  status: boolean;
}

export function UserManagement() {
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    role: "admin",
    email: "",
    mot_de_passe: "",
    status: true,
  });

  // Récupérer tous les utilisateurs
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllUtilisateurs();
      if (result.success) {
        setUsers(result.data);
      } else {
        console.error("Erreur lors du chargement des utilisateurs");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Gère l'ajout d'un nouvel utilisateur
  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      nom: "",
      prenom: "",
      role: "admin",
      email: "",
      mot_de_passe: "",
      status: true,
    });
    setIsModalOpen(true);
  };

  // Gère l'édition d'un utilisateur existant
  const handleEditUser = (user: Utilisateur) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      email: user.email,
      mot_de_passe: "", // Mot de passe vide pour l'édition
      status: user.status,
    });
    setIsModalOpen(true);
  };

  // Gère la suppression d'un utilisateur
  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await deleteUtilisateur(id);
        await fetchUsers();
        console.log(`Utilisateur ${id} supprimé.`);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Échec de la suppression de l'utilisateur.");
      }
    }
  };

  // Gère l'activation/désactivation d'un utilisateur
  const handleToggleStatus = async (user: Utilisateur) => {
    try {
      const result = await toggleUtilisateurStatus(user.id_utilisateur, !user.status);
      if (result.success) {
        await fetchUsers();
        console.log(`Statut de l'utilisateur ${user.id_utilisateur} mis à jour`);
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Erreur lors du changement de statut.");
    }
  };

  // Sauvegarde/Mise à jour d'un utilisateur
  const handleSaveUser = async () => {
    if (!formData.nom || !formData.prenom || !formData.email) {
      alert("Veuillez remplir les champs obligatoires (Nom, Prénom, Email)");
      return;
    }

    // Pour la création, le mot de passe est obligatoire
    if (!editingUser && !formData.mot_de_passe) {
      alert("Le mot de passe est obligatoire pour la création d'un nouvel utilisateur.");
      return;
    }

    setIsLoading(true);
    try {
      if (editingUser) {
        // MODE MISE À JOUR
        const payload: any = {
          nom: formData.nom,
          prenom: formData.prenom,
          role: formData.role,
          email: formData.email,
          status: formData.status,
        };
        
        // Inclure le mot de passe seulement s'il a été modifié
        if (formData.mot_de_passe) {
          payload.mot_de_passe = formData.mot_de_passe;
        }

        const result = await updateUtilisateur(editingUser.id_utilisateur, payload);
        if (result.success) {
          await fetchUsers();
          setIsModalOpen(false);
        } else {
          alert("Erreur lors de la mise à jour de l'utilisateur.");
        }
      } else {
        // MODE CRÉATION
        const payload: UtilisateurCreatePayload = {
          nom: formData.nom,
          prenom: formData.prenom,
          role: formData.role,
          email: formData.email,
          mot_de_passe: formData.mot_de_passe,
          status: formData.status,
        };

        const result = await createUtilisateur(payload);
        if (result.success) {
          await fetchUsers();
          setIsModalOpen(false);
        } else {
          alert("Erreur lors de la création de l'utilisateur.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Erreur lors de l'enregistrement de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  // Préparation des lignes pour la DataTable
  const rows = users.map((user) => [
    user.id_utilisateur,
    user.nom,
    user.prenom,
    user.role === 'admin' ? 'Administrateur' : 'Livreur',
    user.email,
    new Date(user.date_creation).toLocaleDateString('fr-FR'),
    user.status ? 'Actif' : 'Inactif',
    <div key={user.id_utilisateur} style={{ display: "flex", gap: "8px" }}>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditUser(user)}
        disabled={isLoading}
      >
        Modifier
      </Button>
      <Button
        size="slim"
        tone={user.status ? "critical" : "success"}
        onClick={() => handleToggleStatus(user)}
        disabled={isLoading}
      >
        {user.status ? "Désactiver" : "Activer"}
      </Button>
      <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteUser(user.id_utilisateur)}
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
            Gestion des Utilisateurs
          </Text>
          <Button variant="primary" icon={PlusIcon} onClick={handleAddUser} disabled={isLoading}>
            Ajouter un Utilisateur
          </Button>
        </div>
        <Card>
          {isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Spinner accessibilityLabel="Chargement des utilisateurs" size="large" />
            </div>
          ) : (
            <DataTable
              columnContentTypes={["text", "text", "text", "text", "text", "text", "text", "text"]}
              headings={["ID", "Nom", "Prénom", "Rôle", "Email", "Date création", "Statut", "Actions"]}
              rows={rows}
            />
          )}
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Modifier l'Utilisateur" : "Ajouter un Utilisateur"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSaveUser,
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
          <Form onSubmit={handleSaveUser}>
            <FormLayout>
              <TextField
                label="Nom"
                value={formData.nom}
                onChange={(value) => setFormData({ ...formData, nom: value })}
                autoComplete="off"
                required
              />
              <TextField
                label="Prénom"
                value={formData.prenom}
                onChange={(value) => setFormData({ ...formData, prenom: value })}
                autoComplete="off"
                required
              />
              <Select
                label="Rôle"
                options={roleOptions}
                value={formData.role}
                onChange={(value) => setFormData({ ...formData, role: value as 'admin' | 'livreur' })}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                autoComplete="off"
                required
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={formData.mot_de_passe}
                onChange={(value) => setFormData({ ...formData, mot_de_passe: value })}
                autoComplete="new-password"
                placeholder={editingUser ? "Laisser vide si inchangé" : "Obligatoire pour la création"}
                helpText={editingUser ? "Remplir seulement si vous souhaitez changer le mot de passe" : undefined}
              />
              <Checkbox
                label="Utilisateur actif"
                checked={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value })}
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}