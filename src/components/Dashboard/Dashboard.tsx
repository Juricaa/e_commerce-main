import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Text,
  ProgressBar,
  Spinner,
} from "@shopify/polaris";
import {
  HomeIcon,
  OrderIcon,
  ProductIcon,
  PersonIcon,
} from "@shopify/polaris-icons";
import { StatsCard } from "./components/StatsCard";
import { OrdersTable } from "./components/OrdersTable";
import { getAllCommandes } from "../../controllers/commandeController";
import { getAllPaiements } from "../../controllers/paiementController";
import { getAllInventories } from "../../controllers/invetaireController";
import type { Commande } from "../../types/commande";
import type { Paiement } from "../../types/paiement";
import type { Inventory } from "../../types/inventaire";
import "./dashboard.css";

interface DashboardStats {
  totalCommandes: number;
  commandesEnAttente: number;
  chiffreAffaires: number;
  produitsEnStock: number;
  paiementsEffectues: number;
  tauxConversion: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCommandes: 0,
    commandesEnAttente: 0,
    chiffreAffaires: 0,
    produitsEnStock: 0,
    paiementsEffectues: 0,
    tauxConversion: 0,
  });
  const [recentCommandes, setRecentCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState("Mois en cours");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les données en parallèle
      const [commandesResult, paiementsResult, inventairesResult] = await Promise.all([
        getAllCommandes(),
        getAllPaiements(),
        getAllInventories()
      ]);

      const commandes = commandesResult.success ? commandesResult.data : [];
      const paiements = paiementsResult.success ? paiementsResult.data : [];
      const inventaires = inventairesResult.success ? inventairesResult.data : [];

      // Calculer les statistiques
      const totalCommandes = commandes.length;
      const commandesEnAttente = commandes.filter(c => c.statut === 'en attente').length;
      
      const chiffreAffaires = paiements
        .filter(p => p.statut_paiement === 'effectué')
        .reduce((sum, p) => sum + p.montant, 0);

      // Calculer le stock actuel basé sur les mouvements d'inventaire
      const stockActuel = calculerStockActuel(inventaires);
      
      const paiementsEffectues = paiements.filter(p => p.statut_paiement === 'effectué').length;
      const tauxConversion = totalCommandes > 0 ? (paiementsEffectues / totalCommandes) * 100 : 0;

      setStats({
        totalCommandes,
        commandesEnAttente,
        chiffreAffaires,
        produitsEnStock: stockActuel,
        paiementsEffectues,
        tauxConversion,
      });

      // Commandes récentes (5 dernières)
      setRecentCommandes(commandes
        .sort((a, b) => new Date(b.date_commande).getTime() - new Date(a.date_commande).getTime())
        .slice(0, 5)
      );

    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculerStockActuel = (inventaires: Inventory[]): number => {
    return inventaires.reduce((stock, inventaire) => {
      if (inventaire.mouvement === 'ENTREE') {
        return stock + inventaire.quantite;
      } else {
        return stock - inventaire.quantite;
      }
    }, 0);
  };

  const getTendanceCommandes = (): { trend: number; direction: 'up' | 'down' } => {
    // Simulation de tendance - à remplacer par des données historiques réelles
    return { trend: 12.5, direction: 'up' as const };
  };

  const getTendanceChiffreAffaires = (): { trend: number; direction: 'up' | 'down' } => {
    // Simulation de tendance - à remplacer par des données historiques réelles
    return { trend: 8.3, direction: 'up' as const };
  };

  const getTendanceStock = (): { trend: number; direction: 'up' | 'down' } => {
    // Simulation de tendance - à remplacer par des données historiques réelles
    return { trend: -5.2, direction: 'down' as const };
  };

  const formatAriary = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant) + ' Ar';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spinner size="large" />
        <Text as="p" variant="bodyMd">Chargement des données...</Text>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-header">
        <Text variant="headingLg" as="h1">
          Tableau de Bord
        </Text>
        <Button>{periode}</Button>
      </div>

      <Layout>
        <Layout.Section>
          <div className="stats-grid">
            <StatsCard
              title="Commandes Total"
              value={stats.totalCommandes.toString()}
              trend={getTendanceCommandes().trend}
              trendDirection={getTendanceCommandes().direction}
              icon={OrderIcon}
            />
            <StatsCard
              title="Produits en Stock"
              value={stats.produitsEnStock.toString()}
              trend={getTendanceStock().trend}
              trendDirection={getTendanceStock().direction}
              icon={HomeIcon}
            />
            <StatsCard
              title="Paiements Effectués"
              value={stats.paiementsEffectues.toString()}
              trend={15.2}
              trendDirection="up"
              icon={PersonIcon}
            />
            <StatsCard
              title="Chiffre d'Affaires"
              value={formatAriary(stats.chiffreAffaires)}
              trend={getTendanceChiffreAffaires().trend}
              trendDirection={getTendanceChiffreAffaires().direction}
              icon={ProductIcon}
            />
          </div>
        </Layout.Section>

        <Layout.Section>
          <div className="charts-grid">
            <Card>
              <div className="visitors-card">
                <div className="visitors-header">
                  <Text variant="headingMd" as="h2">Statut des Commandes</Text>
                  <Button size="slim" onClick={loadDashboardData}>
                    Actualiser
                  </Button>
                </div>
                <div className="visitors-content">
                  <Text variant="headingXl" as="p">
                    {stats.totalCommandes} commandes
                  </Text>
                  <div className="visitors-stats">
                    <div className="stat-item">
                      <Text as="span">En attente</Text>
                      <ProgressBar 
                        progress={stats.totalCommandes > 0 ? (stats.commandesEnAttente / stats.totalCommandes) * 100 : 0} 
                        size="small" 
                      />
                      <Text as="span">{stats.commandesEnAttente} ({stats.totalCommandes > 0 ? Math.round((stats.commandesEnAttente / stats.totalCommandes) * 100) : 0}%)</Text>
                    </div>
                    <div className="stat-item">
                      <Text as="span">Payées</Text>
                      <ProgressBar 
                        progress={stats.totalCommandes > 0 ? (stats.paiementsEffectues / stats.totalCommandes) * 100 : 0} 
                        size="small" 
                      />
                      <Text as="span">{stats.paiementsEffectues} ({stats.totalCommandes > 0 ? Math.round((stats.paiementsEffectues / stats.totalCommandes) * 100) : 0}%)</Text>
                    </div>
                    <div className="stat-item">
                      <Text as="span">Taux conversion</Text>
                      <ProgressBar 
                        progress={stats.tauxConversion} 
                        size="small" 
                      />
                      <Text as="span">{stats.tauxConversion.toFixed(1)}%</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="team-progress">
                <Text variant="headingMd" as="h2">Commandes Récentes</Text>
                <div className="team-members">
                  {recentCommandes.length > 0 ? (
                    recentCommandes.map((commande) => (
                      <div key={commande.id_commande} className="team-member">
                        <div className="member-info">
                          <Text variant="bodyMd" as="p">
                            Commande #{commande.id_commande}
                          </Text>
                          <Text variant="bodySm" as="span">
                            {commande.client ? `${commande.client.prenom} ${commande.client.nom}` : `Client ${commande.id_client}`}
                          </Text>
                        </div>
                        <div className="member-progress">
                          <ProgressBar
                            progress={commande.statut === 'livrée' ? 100 : commande.statut === 'expédiée' ? 75 : commande.statut === 'en attente' ? 25 : 0}
                            size="small"
                          />
                          <Text as="span">
                            {commande.statut === 'en attente' ? 'En attente' : 
                             commande.statut === 'payée' ? 'Payée' : 
                             commande.statut === 'expédiée' ? 'Expédiée' : 
                             commande.statut === 'livrée' ? 'Livrée':'Annulée'}
                          </Text>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Text as="p" variant="bodyMd">Aucune commande récente</Text>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <div style={{ padding: '20px' }}>
              <Text variant="headingMd" as="h2">Aperçu des Performances</Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div>
                  <Text variant="bodySm" as="p">Commandes en attente</Text>
                  <Text variant="headingLg" as="p" fontWeight="bold">{stats.commandesEnAttente}</Text>
                </div>
                <div>
                  <Text variant="bodySm" as="p">Chiffre d'affaires total</Text>
                  <Text variant="headingLg" as="p" fontWeight="bold">{formatAriary(stats.chiffreAffaires)}</Text>
                </div>
                <div>
                  <Text variant="bodySm" as="p">Taux de conversion</Text>
                  <Text variant="headingLg" as="p" fontWeight="bold">{stats.tauxConversion.toFixed(1)}%</Text>
                </div>
                <div>
                  <Text variant="bodySm" as="p">Stock disponible</Text>
                  <Text variant="headingLg" as="p" fontWeight="bold">{stats.produitsEnStock} produits</Text>
                </div>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
}