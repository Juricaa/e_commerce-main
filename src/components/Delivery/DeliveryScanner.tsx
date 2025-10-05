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

// Types pour les données QR Code
type ProduitQr = {
  nom_produit: string;
  quantite: number;
  prix: number;
};

type QrData = {
  reff: string;
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
  const [statutPaiement, setStatutPaiement] = useState<string>("en attente");
  const [statutLivraison, setStatutLivraison] = useState<string>("en préparation");

  // 🔹 Fonction appelée quand un QR code est lu
  const handleScan = (data: string | null) => {
    if (data) {
      try {
        const qrData: QrData = JSON.parse(data);
        
        const newRecord: ScanRecord = {
          qrData,
          scannedAt: new Date().toLocaleString("fr-FR"),
          statutPaiement: "en attente",
          statutLivraison: "en préparation",
        };

        setScanHistory((prev) => [newRecord, ...prev.slice(0, 9)]); // Garder seulement les 10 derniers
        setScanError("");
        
        // Ouvrir automatiquement le modal pour le nouveau scan
        setSelectedRecord(newRecord);
        setStatutPaiement("en attente");
        setStatutLivraison("en préparation");
        setModalOpen(true);

      } catch (error) {
        setScanError("QR code invalide - format JSON incorrect");
        console.error("Erreur parsing QR:", error);
      }
    }
  };

  // 🔹 Gestion des erreurs du scanner
  const handleError = (err: any) => {
    console.error("Erreur du scanner :", err);
    setScanError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
  };

  // 🔹 Mettre à jour le statut
  const handleUpdateStatus = () => {
    if (selectedRecord) {
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
    }
  };

  // 🔹 Obtenir la couleur du badge selon le statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "payée":
      case "livrée":
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
    { label: "Payée", value: "payée" },
    { label: "Échoué", value: "échoué" },
    { label: "Remboursé", value: "remboursé" },
  ];

  const livraisonOptions = [
    { label: "En préparation", value: "en préparation" },
    { label: "Expédiée", value: "expédiée" },
    { label: "Livrée", value: "livrée" },
    { label: "Annulée", value: "annulée" },
  ];

  return (
    <Page>
      <div className="delivery-page">
        {/* ---- HEADER ---- */}
        <Layout>
          <Layout.Section>
            <Card>
              <div className="delivery-header">
                <div>
                  <Text variant="bodySm" as="p" tone="subdued">
                    Centre de livraison
                  </Text>
                  <Text variant="headingLg" as="h1">
                    Bonjour {operator}
                  </Text>
                </div>
                <Link className="delivery-home-link" to="/">
                  Retour à la boutique
                </Link>
              </div>
            </Card>
          </Layout.Section>

          {/* ---- LAYOUT PRINCIPAL ---- */}
          <Layout.Section>
            <Layout>
              <Layout.Section variant="oneHalf">
                {/* ---- PANNEAU SCANNER ---- */}
                <Card>
                  <Text variant="headingMd" as="h2">Scanner QR Code</Text>
                  <div className="scanner-panel">
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
                        <div style={{ marginTop: "16px" }}>
                      <Text variant="bodySm" as="p" tone="critical">
                        {scanError}
                      </Text>
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="scanner-guidelines">
                      <Text variant="headingSm" as="h2">
                        Instructions de scan
                      </Text>
                      <ol>
                        <li>Positionnez le QR code dans le cadre de la caméra</li>
                        <li>Maintenez une distance de 15-30 cm</li>
                        <li>Assurez-vous d'un bon éclairage</li>
                        <li>Le scan se fait automatiquement</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              </Layout.Section>

              <Layout.Section variant="oneHalf">
                {/* ---- PANNEAU HISTORIQUE ---- */}
                <Card>
                  <Text variant="headingMd" as="h2">Historique des scans</Text>
                  <div className="history-panel">
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
                          record.qrData.reff,
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
              </Layout.Section>
            </Layout>
          </Layout.Section>
        </Layout>

        {/* ---- MODAL DE GESTION ---- */}
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
                            <strong>Référence:</strong> {selectedRecord.qrData.reff}
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
    </Page>
  );
}