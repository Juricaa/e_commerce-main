package com.supermarcheenligne.service;

import com.supermarcheenligne.entity.Commande;
import com.supermarcheenligne.entity.CommandeProduit; // Importation nécessaire
import com.supermarcheenligne.entity.Paiement; // Si vous avez aussi des paiements en cascade
import com.supermarcheenligne.repository.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Ajout de l'import pour @Transactional

import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;

    public List<Commande> findAll() {
        return commandeRepository.findAll();
    }

    public Optional<Commande> findById(Long id) {
        return commandeRepository.findById(id);
    }

    @Transactional // IMPORTANT : Assure que toutes les opérations (save cascade) se font ensemble
    public Commande save(Commande commande) {
        
        // 🚨 ÉTAPE CRUCIALE 1 : Lier la Commande à chaque CommandeProduit
        if (commande.getCommandeProduits() != null) {
            for (CommandeProduit ligne : commande.getCommandeProduits()) {
                // Cette ligne est la correction : elle assure que l'objet Commande enfant n'est pas NULL
                ligne.setCommande(commande); 
            }
        }
        
        // 🚨 ÉTAPE CRUCIALE 2 (si Paiement est aussi une relation en cascade) : Lier la Commande à chaque Paiement
        if (commande.getPaiements() != null) {
            for (Paiement paiement : commande.getPaiements()) {
                paiement.setCommande(commande);
            }
        }
        
        // Maintenant, la cascade de sauvegarde devrait fonctionner sans erreur
        return commandeRepository.save(commande);
    }

    public void deleteById(Long id) {
        commandeRepository.deleteById(id);
    }
}