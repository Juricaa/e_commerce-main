import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// @ts-expect-error no types available for react-qr-reader
import { QrReader } from "react-qr-reader";
import "../../styles/delivery.css";

type DeliveryState = {
  operator?: string;
};

type ScanRecord = {
  content: string;
  scannedAt: string;
  order?: {
    reference: string;
    customer: {
      name: string;
      email: string;
    };
    address: string;
    note: string;
    total: number;
    items: Array<{
      id: string;
      quantity: number;
      price: number;
    }>;
    createdAt: string;
  };
};

export function DeliveryScanner() {
  const location = useLocation();
  const operator = (location.state as DeliveryState | null)?.operator ?? "Livreur";
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [scanError, setScanError] = useState<string>("");
  const [isCameraReady, setIsCameraReady] = useState(false);

  return (
    <div className="delivery-page">
      <header className="delivery-header">
        <div>
          <p className="delivery-eyebrow">Centre de livraison</p>
          <h1>Bonjour {operator}</h1>
        </div>
        <Link className="delivery-home-link" to="/">
          Retour à la boutique
        </Link>
      </header>

      <div className="delivery-layout">
        <section className="scanner-panel">
          <div className="scanner-frame">
            <QrReader
              constraints={{ facingMode: "environment" }}
              // @ts-expect-error no types available for react-qr-reader
              onResult={(result, error) => {
                if (!isCameraReady && (result || error)) {
                  setIsCameraReady(true);
                }

                if (result) {
                  const content = result.getText();
                  if (content) {
                    let order: ScanRecord['order'];
                    try {
                      order = JSON.parse(content);
                    } catch {
                      order = undefined;
                    }
                    setScanHistory((previous) => [
                      {
                        content,
                        scannedAt: new Date().toLocaleTimeString(),
                        order,
                      },
                      ...previous,
                    ]);
                  }
                  setScanError("");
                  return;
                }

                if (error) {
                  setScanError("Impossible de lire le QR code, veuillez réessayer.");
                }
              }}
            />
            {!isCameraReady ? (
              <p className="scanner-status">Initialisation de la caméra…</p>
            ) : null}
          </div>
          {scanError ? <p className="scanner-error">{scanError}</p> : null}
          <div className="scanner-guidelines">
            <h2>Protocole de vérification</h2>
            <ol>
              <li>Présentez le QR code du client face à la caméra.</li>
              <li>Vérifiez la concordance des informations affichées.</li>
              <li>Confirmez la remise du colis dans votre application interne.</li>
            </ol>
          </div>
        </section>

        <aside className="history-panel">
          <div className="history-card">
            <h2>Scans récents</h2>
            {scanHistory.length === 0 ? (
              <p className="history-empty">Aucun QR code scanné pour le moment.</p>
            ) : (
              <ul className="history-list">
                {scanHistory.map((record, index) => (
                  <li key={`${record.content}-${index}`} className="history-item">
                    <span className="history-time">{record.scannedAt}</span>
                    {record.order ? (
                      <div className="order-details">
                        <p className="order-ref">Commande: {record.order.reference}</p>
                        <p className="order-customer">Client: {record.order.customer.name}</p>
                        <p className="order-address">Adresse: {record.order.address}</p>
                        <p className="order-total">Total: {record.order.total}€</p>
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
