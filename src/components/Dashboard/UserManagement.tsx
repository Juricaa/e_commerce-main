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
  Spinner, // Ajout pour l'indicateur de chargement
} from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";

import type { User } from "../../types/user";
// 🚨 Importation des fonctions du contrôleur d'API 🚨
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../controllers/userController"; 

import type { NewClientData } from "../../controllers/userController";// Assurez-vous que le chemin est correct

// Configuration des options de rôle (pour l'affichage et l'envoi à l'API)
const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Livreur', value: 'delivery' }, // Utilisez le rôle 'Livreur' si c'est ce que l'API attend
];

// Définit le type pour les données du formulaire, incluant le mot de passe
interface FormData {
  nom: string;
  prenom: string;
  role: 'delivery' | 'admin';
  email: string;
  telephone: string;
  adresse: string;
  password?: string; // Ajout du mot de passe
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    role: "admin",
    email: "",
    telephone: "",
    adresse: "",
    password: "", // Initialisation du mot de passe
  });

  // 1. 🚨 LOGIQUE POUR RÉCUPÉRER LES UTILISATEURS (READ) 🚨
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const clients = await getAllClients();
    setUsers(clients);
    setIsLoading(false);
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
      telephone: "",
      adresse: "",
      password: "", // Le mot de passe est obligatoire pour la création
    });
    setIsModalOpen(true);
  };

  // Gère l'édition d'un utilisateur existant
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      role: user.role as 'delivery' | 'admin',
      email: user.email,
      telephone: user.telephone,
      adresse: user.adresse,
      password: "", // Le mot de passe est souvent vide lors de l'édition et envoyé seulement si modifié
    });
    setIsModalOpen(true);
  };

  // 2. 🚨 LOGIQUE POUR SUPPRIMER UN UTILISATEUR (DELETE) 🚨
  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      const success = await deleteClient(id);
      if (success) {
        // Rafraîchir la liste après une suppression réussie
        await fetchUsers(); 
        console.log(`Client ${id} supprimé.`);
      } else {
        alert("Échec de la suppression de l'utilisateur.");
      }
    }
  };

  // 3. 🚨 LOGIQUE POUR SAUVEGARDER/MODIFIER (CREATE/UPDATE) 🚨
  const handleSaveUser = async () => {
    if (!formData.nom || !formData.prenom || !formData.email) return;

    setIsLoading(true);
    let success = false;
    
    // Données de base à envoyer à l'API
    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      role: formData.role,
      email: formData.email,
      telephone: formData.telephone,
      adresse: formData.adresse,
      // Le mot de passe est inclus uniquement s'il est fourni (création ou mise à jour)
      ...(formData.password && { password: formData.password }),
    };

    if (editingUser) {
      // MODE MISE À JOUR (PUT)
      const updatedUser = await updateClient(editingUser.idClient, payload as Partial<User>);
      success = !!updatedUser;
    } else {
      // MODE CRÉATION (POST)
      // Le mot de passe est obligatoire pour la création.
      if (!formData.password) {
        alert("Le mot de passe est obligatoire pour la création d'un nouvel utilisateur.");
        setIsLoading(false);
        return;
      }

      
      const newUser = await createClient(payload as NewClientData); 
      success = !!newUser;
    }

    if (success) {
      await fetchUsers(); // Rafraîchir la liste après sauvegarde
      setIsModalOpen(false);
    } else {
      alert("Erreur lors de l'enregistrement de l'utilisateur. Vérifiez la console pour plus de détails.");
    }
    setIsLoading(false);
  };

  // Préparation des lignes pour la DataTable
  const rows = users.map((user) => [
    user.idClient,
    user.nom,
    user.prenom,
    user.role,
    user.email,
    user.telephone,
    user.adresse,
    // Note: Utilisation de 'dateInscription' pour correspondre au format de l'API
    new Date(user.dateInscription).toLocaleDateString(), 
    <div key={user.idClient} style={{ display: "flex", gap: "8px" }}>
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
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteUser(user.idClient)}
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
              columnContentTypes={["numeric", "text", "text", "text", "text", "text", "text", "text", "text"]}
              headings={["ID", "Nom", "Prénom", "Rôle", "Email", "Téléphone", "Adresse", "Date d'inscription", "Actions"]}
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
              />
              <TextField
                label="Prénom"
                value={formData.prenom}
                onChange={(value) => setFormData({ ...formData, prenom: value })}
                autoComplete="off"
              />
              <Select
                label="Rôle"
                options={roleOptions}
                value={formData.role}
                onChange={(value) => setFormData({ ...formData, role: value as 'delivery' | 'admin' })}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                autoComplete="off"
              />
              {/* Le mot de passe est requis seulement si on ajoute ou si on veut le modifier */}
              <TextField
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                autoComplete="new-password"
                placeholder={editingUser ? "Laisser vide si inchangé" : "Obligatoire pour la création"}
              />
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
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Layout>
  );
}