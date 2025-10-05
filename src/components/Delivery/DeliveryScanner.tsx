import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import QrReader from "react-qr-reader"; // ✅ import par défaut
import "../../styles/delivery.css";

// Définition du type pour plus de clarté
type ScanRecord = {
  content: string;
  scannedAt: string;
  order?: {
    reference: string;
    customer?: {
      name: string;
      email?: string;
    };
    address?: string;
    note?: string;
    total?: number;
  };
};

export function DeliveryScanner() {
  const location = useLocation();
  const operator = (location.state as any)?.operator ?? "Livreur";

  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [scanError, setScanError] = useState<string>("");

  // 🔹 Fonction appelée quand un QR code est lu
  const handleScan = (data: string | null) => {
    if (data) {
      let order: ScanRecord["order"];
      try {
        order = JSON.parse(data);
      } catch {
        order = undefined; // le contenu n'est pas un JSON valide
      }

      setScanHistory((prev) => [
        {
          content: data,
          scannedAt: new Date().toLocaleTimeString(),
          order,
        },
        ...prev,
      ]);

      setScanError("");
    }
  };

  // 🔹 Gestion des erreurs du scanner
  const handleError = (err: any) => {
    console.error("Erreur du scanner :", err);
    setScanError("Impossible de lire le QR code, veuillez réessayer.");
  };

  return (
    <div className="delivery-page">
      {/* ---- HEADER ---- */}
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
              delay={300} // intervalle de capture en ms
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%", maxWidth: "500px" }}
            />

            {scanError && <p className="scanner-error">{scanError}</p>}
          </div>

          {/* Instructions */}
          <div className="scanner-guidelines">
            <h2>Protocole de vérification</h2>
            <ol>
              <li>Présentez le QR code du client face à la caméra.</li>
              <li>Vérifiez la concordance des informations affichées.</li>
              <li>Confirmez la remise du colis dans votre application interne.</li>
            </ol>
          </div>
        </section>

        {/* ---- PANNEAU HISTORIQUE ---- */}
        <aside className="history-panel">
          <div className="history-card">
            <h2>Scans récents</h2>

            {scanHistory.length === 0 ? (
              <p className="history-empty">
                Aucun QR code scanné pour le moment.
              </p>
            ) : (
              <ul className="history-list">
                {scanHistory.map((record, index) => (
                  <li key={index} className="history-item">
                    <span className="history-time">{record.scannedAt}</span>

                    {record.order ? (
                      <div className="order-details">
                        <p>
                          <strong>Commande :</strong> {record.order.reference}
                        </p>
                        <p>
                          <strong>Client :</strong>{" "}
                          {record.order.customer?.name ?? "Inconnu"}
                        </p>
                        <p>
                          <strong>Adresse :</strong>{" "}
                          {record.order.address ?? "Non spécifiée"}
                        </p>
                        <p>
                          <strong>Total :</strong>{" "}
                          {record.order.total ? `${record.order.total} €` : "—"}
                        </p>
                      </div>
                    ) : (
                      <span className="history-content">{record.content}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
