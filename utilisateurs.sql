-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 06 oct. 2025 à 09:18
-- Version du serveur : 11.8.3-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `supermarche_en_ligne`
--

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id_utilisateur` varchar(10) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  `role` varchar(50) NOT NULL,
  `date_creation` datetime(6) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id_utilisateur`, `nom`, `prenom`, `email`, `role`, `date_creation`, `mot_de_passe`, `status`) VALUES
('U0001', 'admin', 'JohnA', 'admin@gmail.com', 'admin', '2025-10-05 11:49:36.763017', 'pbkdf2_sha256$1000000$VKSeonMf06wYuOIWK19aVF$WQx9Ej/AF08ctV5MKwNJKn1Fhk/01Q1rAsXD9B0ljAk=', 1),
('U0002', 'Schmidt', 'Familie', 'schmidt.familie@email.com', 'livreur', '2025-10-05 12:43:37.112735', 'pbkdf2_sha256$1000000$HsKDJpP68nnn5WQAue7Lcw$4h9B+WhdEvCdmLRE9UVBTpyKM2UK86T2Hd1c4ubZB3k=', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id_utilisateur`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- Trigger après INSERT sur commande_produits
DELIMITER $$
CREATE TRIGGER `inventaire_sortie_apres_insert_commande` AFTER INSERT ON `commande_produits` FOR EACH ROW 
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur insertion commande produit ID ', NEW.id_produit), 'inventaire_sortie_apres_insert_commande', NOW());
    END;

    INSERT INTO inventaires(id_produit, mouvement, quantite, commentaire, date_mouvement)
    VALUES (NEW.id_produit, 'sortie', NEW.quantite, CONCAT('Commande n°', NEW.id_commande, ' - ', NEW.quantite, ' unités'), NOW());
END
$$
DELIMITER ;

-- Trigger après UPDATE sur commande_produits
DELIMITER $$
CREATE TRIGGER `inventaire_apres_update_commande` AFTER UPDATE ON `commande_produits` FOR EACH ROW 
BEGIN
    DECLARE diff DECIMAL(10,2);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur update commande produit ID ', NEW.id_produit), 'inventaire_apres_update_commande', NOW());
    END;

    SET diff = NEW.quantite - OLD.quantite;

    IF diff > 0 THEN
        INSERT INTO inventaires(id_produit, mouvement, quantite, commentaire, date_mouvement)
        VALUES (NEW.id_produit, 'sortie', diff, CONCAT('Modification commande n°', NEW.id_commande, ' - Ajout de ', diff, ' unités'), NOW());
    ELSEIF diff < 0 THEN
        INSERT INTO inventaires(id_produit, mouvement, quantite, commentaire, date_mouvement)
        VALUES (NEW.id_produit, 'entrée', -diff, CONCAT('Modification commande n°', NEW.id_commande, ' - Retrait de ', -diff, ' unités'), NOW());
    END IF;
END
$$
DELIMITER ;

-- Trigger après DELETE sur commande_produits
DELIMITER $$
CREATE TRIGGER `inventaire_apres_delete_commande` AFTER DELETE ON `commande_produits` FOR EACH ROW 
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur delete commande produit ID ', OLD.id_produit), 'inventaire_apres_delete_commande', NOW());
    END;

    INSERT INTO inventaires(id_produit, mouvement, quantite, commentaire, date_mouvement)
    VALUES (OLD.id_produit, 'entrée', OLD.quantite, CONCAT('Annulation produit commande n°', OLD.id_commande), NOW());
END
$$
DELIMITER ;

-- Trigger après INSERT pour maj total
DELIMITER $$
CREATE TRIGGER `maj_total_apres_insert_commande_produits` AFTER INSERT ON `commande_produits` FOR EACH ROW 
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur maj total insert commande ', NEW.id_commande), 'maj_total_apres_insert_commande_produits', NOW());
    END;

    UPDATE commandes
    SET total = (SELECT IFNULL(SUM(quantite * prix_unitaire), 0)
                 FROM commande_produits
                 WHERE id_commande = NEW.id_commande)
    WHERE id_commande = NEW.id_commande;
END
$$
DELIMITER ;

-- Trigger après UPDATE pour maj total
DELIMITER $$
CREATE TRIGGER `maj_total_apres_update_commande_produits` AFTER UPDATE ON `commande_produits` FOR EACH ROW 
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur maj total update commande ', NEW.id_commande), 'maj_total_apres_update_commande_produits', NOW());
    END;

    UPDATE commandes
    SET total = (SELECT IFNULL(SUM(quantite * prix_unitaire), 0)
                 FROM commande_produits
                 WHERE id_commande = NEW.id_commande)
    WHERE id_commande = NEW.id_commande;
END
$$
DELIMITER ;

-- Trigger après DELETE pour maj total
DELIMITER $$
CREATE TRIGGER `maj_total_apres_delete_commande_produits` AFTER DELETE ON `commande_produits` FOR EACH ROW 
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur maj total delete commande ', OLD.id_commande), 'maj_total_apres_delete_commande_produits', NOW());
    END;

    UPDATE commandes
    SET total = (SELECT IFNULL(SUM(quantite * prix_unitaire), 0)
                 FROM commande_produits
                 WHERE id_commande = OLD.id_commande)
    WHERE id_commande = OLD.id_commande;
END
$$
DELIMITER ;

-- Trigger après INSERT sur produits
DELIMITER $$
CREATE TRIGGER `inventaire_apres_insert_produit` AFTER INSERT ON `produits` FOR EACH ROW 
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur inventaire produit ID ', NEW.id_produit), 'inventaire_apres_insert_produit', NOW());
    END;

    IF NEW.stock > 0 THEN
        INSERT INTO inventaires(
            id_produit, 
            mouvement, 
            quantite, 
            commentaire, 
            date_mouvement
        )
        VALUES (
            NEW.id_produit, 
            'entrée', 
            NEW.stock, 
            CONCAT('Ajout nouveau produit - Stock initial: ', NEW.stock, ' unités - ', NEW.nom_produit, 
                   ' - Catégorie: ', IFNULL(NEW.categorie, 'Non catégorisé')), 
            NOW()
        );
    END IF;
END
$$
DELIMITER ;

-- Trigger après UPDATE sur produits
DELIMITER $$
CREATE TRIGGER `inventaire_apres_update_produit` AFTER UPDATE ON `produits` FOR EACH ROW 
BEGIN
    DECLARE diff DECIMAL(10,2);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur update produit ID ', NEW.id_produit), 'inventaire_apres_update_produit', NOW());
    END;

    SET diff = NEW.stock - OLD.stock;

    -- Gestion des modifications de stock
    IF diff > 0 THEN
        INSERT INTO inventaires(
            id_produit, 
            mouvement, 
            quantite, 
            commentaire, 
            date_mouvement
        )
        VALUES (
            NEW.id_produit, 
            'entrée', 
            diff, 
            CONCAT('Ajustement stock - Ajout: ', diff, ' unités - Nouveau stock: ', NEW.stock, ' - ', NEW.nom_produit), 
            NOW()
        );
    ELSEIF diff < 0 THEN
        INSERT INTO inventaires(
            id_produit, 
            mouvement, 
            quantite, 
            commentaire, 
            date_mouvement
        )
        VALUES (
            NEW.id_produit, 
            'sortie', 
            -diff, 
            CONCAT('Ajustement stock - Retrait: ', -diff, ' unités - Nouveau stock: ', NEW.stock, ' - ', NEW.nom_produit), 
            NOW()
        );
    END IF;
    
    -- Journaliser les modifications importantes du produit
    IF NEW.nom_produit != OLD.nom_produit OR NEW.prix != OLD.prix OR NEW.categorie != OLD.categorie THEN
        INSERT INTO inventaires(
            id_produit, 
            mouvement, 
            quantite, 
            commentaire, 
            date_mouvement
        )
        VALUES (
            NEW.id_produit, 
            'entrée', 
            0,
            CONCAT('Modification produit - Nom: "', OLD.nom_produit, '" → "', NEW.nom_produit, 
                   '" - Prix: ', OLD.prix, ' → ', NEW.prix,
                   ' - Catégorie: "', IFNULL(OLD.categorie, 'N/A'), '" → "', IFNULL(NEW.categorie, 'N/A'), '"'), 
            NOW()
        );
    END IF;
END
$$
DELIMITER ;

-- Trigger après DELETE sur produits
DELIMITER $$
CREATE TRIGGER `inventaire_apres_delete_produit` AFTER DELETE ON `produits` FOR EACH ROW 
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        INSERT INTO error_logs (message, trigger_name, date_erreur) 
        VALUES (CONCAT('Erreur delete produit ID ', OLD.id_produit), 'inventaire_apres_delete_produit', NOW());
    END;

    -- Enregistrer une sortie pour le stock restant
    IF OLD.stock > 0 THEN
        INSERT INTO inventaires(
            id_produit, 
            mouvement, 
            quantite, 
            commentaire, 
            date_mouvement
        )
        VALUES (
            OLD.id_produit, 
            'sortie', 
            OLD.stock, 
            CONCAT('Suppression produit - Stock retiré: ', OLD.stock, ' unités - ', OLD.nom_produit), 
            NOW()
        );
    END IF;
    
    -- Enregistrer une entrée spéciale pour marquer la suppression définitive
    INSERT INTO inventaires(
        id_produit, 
        mouvement, 
        quantite, 
        commentaire, 
        date_mouvement
    )
    VALUES (
        OLD.id_produit, 
        'sortie', 
        0,
        CONCAT('PRODUIT SUPPRIMÉ - ', OLD.nom_produit, ' (ID: ', OLD.id_produit, 
               ') - Catégorie: ', IFNULL(OLD.categorie, 'Non catégorisé')), 
        NOW()
    );
END
$$
DELIMITER ;