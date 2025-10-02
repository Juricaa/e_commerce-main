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
} from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";

type User = {
  id_client: number;
  nom: string;
  prenom: string;
  role: 'Livreur' | 'admin';
  email: string;
  telephone: string;
  adresse: string;
  date_inscription: string;
};

const initialUsers: User[] = [
  {
    id_client: 1,
    nom: "Doe",
    prenom: "John",
    role: "admin",
    email: "john.doe@example.com",
    telephone: "+1234567890",
    adresse: "123 Main St, City, Country",
    date_inscription: new Date().toISOString(),
  },
  {
    id_client: 2,
    nom: "Smith",
    prenom: "Jane",
    role: "Livreur",
    email: "jane.smith@example.com",
    telephone: "+0987654321",
    adresse: "456 Elm St, City, Country",
    date_inscription: new Date().toISOString(),
  },
];

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Livreur', value: 'Livreur' },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    role: "admin" as 'Livreur' | 'admin',
    email: "",
    telephone: "",
    adresse: "",
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      nom: "",
      prenom: "",
      role: "admin",
      email: "",
      telephone: "",
      adresse: "",
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      email: user.email,
      telephone: user.telephone,
      adresse: user.adresse,
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id_client !== id));
  };

  const handleSaveUser = () => {
    if (!formData.nom || !formData.prenom || !formData.email) return;

    const newUser: User = {
      id_client: editingUser ? editingUser.id_client : Math.max(...users.map(u => u.id_client)) + 1,
      nom: formData.nom,
      prenom: formData.prenom,
      role: formData.role,
      email: formData.email,
      telephone: formData.telephone,
      adresse: formData.adresse,
      date_inscription: editingUser ? editingUser.date_inscription : new Date().toISOString(),
    };

    if (editingUser) {
      setUsers(users.map(u => u.id_client === editingUser.id_client ? newUser : u));
    } else {
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const rows = users.map((user) => [
    user.id_client,
    user.nom,
    user.prenom,
    user.role,
    user.email,
    user.telephone,
    user.adresse,
    new Date(user.date_inscription).toLocaleDateString(),
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => handleEditUser(user)}
      >
        Modifier
      </Button>
      <Button
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteUser(user.id_client)}
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
          <Button variant="primary" icon={PlusIcon} onClick={handleAddUser}>
            Ajouter un Utilisateur
          </Button>
        </div>
        <Card>
          <DataTable
            columnContentTypes={["numeric", "text", "text", "text", "text", "text", "text", "text", "text"]}
            headings={["ID", "Nom", "Prénom", "Rôle", "Email", "Téléphone", "Adresse", "Date d'inscription", "Actions"]}
            rows={rows}
          />
        </Card>
      </Layout.Section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Modifier l'Utilisateur" : "Ajouter un Utilisateur"}
        primaryAction={{
          content: "Enregistrer",
          onAction: handleSaveUser,
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
                onChange={(value) => setFormData({ ...formData, role: value as 'Livreur' | 'admin' })}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                autoComplete="off"
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
