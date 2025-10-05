import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import QrReader from "react-qr-reader";
import {
  Card,
  Button,
  Text,
  Badge,
  Modal,
  Select,
  Layout,
  Page,
  DataTable,
} from "@shopify/polaris";
import {
    CheckIcon,
} from "@shopify/polaris-icons";
import "../../styles/delivery.css";
import { getPaiementById, updatePaiement } from "../../controllers/paiementController";
import { getCommandeById, updateCommande } from "../../controllers/commandeController";

// Types pour les données QR Code
type ProduitQr = {
  nom_produit: string;
  quantite: number;
  prix: number;
};

type QrData = {
  id_paiement: string;
  id_commande: string;
  nom_client: string;
  email: string;
  telephone: string;
  total: number;
  produits: ProduitQr[];
};

type ScanRecord = {
  qrData: QrData;
  scannedAt: string;
  statutPaiement: "en attente" | "payée" | "échoué" | "remboursé";
  statutLivraison: "en préparation" | "expédiée" | "livrée" | "annulée";
};

export function DeliveryScanner() {
  const location = useLocation();
  const operator = (location.state as any)?.operator ?? "Livreur";

  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [scanError, setScanError] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statutPaiement, setStatutPaiement] = useState<string>("payée");
  const [statutLivraison, setStatutLivraison] = useState<string>("livrée");

  // 🔹 Fonction appelée quand un QR code est lu
  const handleScan = async (data: string | null) => {
    if (data) {
      try {
        const qrData: QrData = JSON.parse(data);
  
        // 🔹 Récupérer le statut actuel depuis la base de données
        const [commandeRes, paiementRes] = await Promise.all([
          getCommandeById(Number(qrData.id_commande)),
          getPaiementById(Number(qrData.id_paiement)),
        ]);
  
        const newRecord: ScanRecord = {
          qrData,
          scannedAt: new Date().toLocaleString("fr-FR"),
          statutLivraison: commandeRes.data.statut as ScanRecord["statutLivraison"],
          statutPaiement: paiementRes.data.statut_paiement as ScanRecord["statutPaiement"],
        };
  
        // 🔹 Mettre à jour l'historique (éviter doublons)
        setScanHistory(prev => {
          // Supprimer l'ancien scan du même QR si existant
          const filtered = prev.filter(r => r.qrData.id_commande !== qrData.id_commande);
          return [newRecord, ...filtered.slice(0, 9)]; // garder max 10
        });
  
        setScanError("");
  
        // Ouvrir le modal automatiquement
        setSelectedRecord(newRecord);
        setStatutLivraison(newRecord.statutLivraison);
        setStatutPaiement(newRecord.statutPaiement);
        setModalOpen(true);
  
      } catch (error) {
        console.error("Erreur parsing QR ou récupération statuts :", error);
        setScanError("QR code invalide ou impossible de récupérer les statuts");
      }
    }
  };
  

  // 🔹 Gestion des erreurs du scanner
  const handleError = (err: any) => {
    console.error("Erreur du scanner :", err);
    setScanError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
  };



// 🔹 Mettre à jour le statut et la base de données
const handleUpdateStatus = async () => {
  if (!selectedRecord) return;

  const { id_commande, id_paiement } = selectedRecord.qrData;

  try {
    // 1️⃣ Mettre à jour la commande dans la base de données
    await updateCommande(Number(id_commande), {
      statut: statutLivraison, // Doit correspondre à ton enum backend
    });

    // 2️⃣ Mettre à jour le paiement dans la base de données
    await updatePaiement(Number(id_paiement), {
      statut_paiement: statutPaiement, // Doit correspondre à ton enum backend
    });

    // 3️⃣ Mettre à jour l'état local pour l'UI
    setScanHistory(prev =>
      prev.map(record =>
        record.scannedAt === selectedRecord.scannedAt
          ? {
              ...record,
              statutPaiement: statutPaiement as ScanRecord["statutPaiement"],
              statutLivraison: statutLivraison as ScanRecord["statutLivraison"],
            }
          : record
      )
    );

    setModalOpen(false);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des statuts :", error);
    alert("Impossible de mettre à jour les statuts. Vérifiez la connexion ou contactez l'administrateur.");
  }
};


  // 🔹 Obtenir la couleur du badge selon le statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "payée":
      case "livrée":
      case "effectué":
        return "success";
      case "en attente":
      case "en préparation":
        return "warning";
      case "expédiée":
        return "info";
      case "échoué":
      case "annulée":
        return "critical";
      default:
        return "new";
    }
  };

  // 🔹 Options pour les selects
  const paiementOptions = [
    { label: "En attente", value: "en attente" },
    { label: "Payée", value: "effectué" },
    { label: "Échoué", value: "échoué" },
    { label: "Remboursé", value: "remboursé" },
  ];

  const livraisonOptions = [
    { label: "En préparation", value: "en attente" },
    { label: "Expédiée", value: "expédiée" },
    { label: "Livrée", value: "livrée" },
    { label: "Annulée", value: "annulée" },
  ];

  return (
    <div className="delivery-page">
      {/* ---- HEADER AVEC STYLE CSS ---- */}
      <header className="delivery-header">
        <div>
          <p className="delivery-eyebrow">Centre de livraison</p>
          <h1>Bonjour {operator}</h1>
        </div>
        <Link className="delivery-home-link" to="/">
          Retour à la boutique
        </Link>
      </header>

      {/* ---- LAYOUT PRINCIPAL ---- */}
      <div className="delivery-layout">
        {/* ---- PANNEAU SCANNER ---- */}
        <section className="scanner-panel">
          <div className="scanner-frame">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ 
                width: "100%", 
                maxWidth: "500px",
                borderRadius: "8px"
              }}
            />

            {scanError && (
              <p className="scanner-error">{scanError}</p>
            )}
          </div>

          {/* Instructions avec style CSS */}
          <div className="scanner-guidelines">
            <h2>Protocole de vérification</h2>
            <ol>
              <li>Présentez le QR code du client face à la caméra.</li>
              <li>Vérifiez les informations affichées.</li>
              <li>Changez le statut du paiement si nécessaire.</li>
            </ol>
          </div>
        </section>

        {/* ---- PANNEAU HISTORIQUE (VERSION ORIGINALE AVEC POLARIS) ---- */}
        <aside className="history-panel">
          <Card>
            <Text variant="headingMd" as="h2">Historique des scans</Text>
            <div className="history-panel-content">
              {scanHistory.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <Text variant="bodyMd" as="p" tone="subdued">
                    Aucun QR code scanné
                  </Text>
                </div>
              ) : (
                <DataTable
                  columnContentTypes={["text", "text", "text", "text"]}
                  headings={["Heure", "Référence", "Client", "Statuts"]}
                  rows={scanHistory.map((record) => [
                    record.scannedAt,
                    record.qrData.id_paiement,
                    record.qrData.nom_client,
                    <div key={record.scannedAt} style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                      <Badge tone={getStatusColor(record.statutPaiement!)}>
                        {`Paiement: ${record.statutPaiement}`}
                      </Badge>
                      <Badge tone={getStatusColor(record.statutLivraison!)}>
                        {`Livraison: ${record.statutLivraison}`}
                      </Badge>
                    </div>,
                  ])}
                />
              )}
            </div>
          </Card>
        </aside>
      </div>

      {/* ---- MODAL DE GESTION (VERSION ORIGINALE) ---- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Gestion de la commande"
        primaryAction={{
          content: "Mettre à jour les statuts",
          onAction: handleUpdateStatus,
          icon: CheckIcon,
        }}
        secondaryActions={[
          {
            content: "Annuler",
            onAction: () => setModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          {selectedRecord && (
            <Layout>
              <Layout.Section>
                <Card>
                  <Text variant="headingMd" as="h3">
                    Informations de la commande
                  </Text>
                  <div style={{ marginTop: "16px" }}>
                    <Layout>
                      <Layout.Section variant="oneHalf">
                        <Text variant="bodyMd" as="p">
                          <strong>Référence:</strong> {selectedRecord.qrData.id_paiement}
                        </Text>
                        <Text variant="bodyMd" as="p">
                          <strong>ID Commande:</strong> {selectedRecord.qrData.id_commande}
                        </Text>
                        <Text variant="bodyMd" as="p">
                          <strong>Client:</strong> {selectedRecord.qrData.nom_client}
                        </Text>
                      </Layout.Section>
                      <Layout.Section variant="oneHalf">
                        <Text variant="bodyMd" as="p">
                          <strong>Email:</strong> {selectedRecord.qrData.email}
                        </Text>
                        <Text variant="bodyMd" as="p">
                          <strong>Téléphone:</strong> {selectedRecord.qrData.telephone}
                        </Text>
                        <Text variant="bodyMd" as="p">
                          <strong>Total:</strong> {selectedRecord.qrData.total} Ar
                        </Text>
                      </Layout.Section>
                    </Layout>
                  </div>
                </Card>
              </Layout.Section>

              <Layout.Section>
                <Card>
                  <Text variant="headingMd" as="h3">
                    Produits commandés
                  </Text>
                  <DataTable
                    columnContentTypes={["text", "numeric", "numeric"]}
                    headings={["Produit", "Quantité", "Prix"]}
                    rows={selectedRecord.qrData.produits.map((produit, index) => [
                      produit.nom_produit,
                      produit.quantite.toString(),
                      `${produit.prix} Ar`,
                    ])}
                  />
                </Card>
              </Layout.Section>

              <Layout.Section>
                <Card>
                  <Text variant="headingMd" as="h3">
                    Mise à jour des statuts
                  </Text>
                  <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
                    <Select
                      label="Statut du paiement"
                      options={paiementOptions}
                      value={statutPaiement}
                      onChange={setStatutPaiement}
                    />
                    <Select
                      label="Statut de livraison"
                      options={livraisonOptions}
                      value={statutLivraison}
                      onChange={setStatutLivraison}
                    />
                  </div>
                </Card>
              </Layout.Section>
            </Layout>
          )}
        </Modal.Section>
      </Modal>
    </div>
  );
}