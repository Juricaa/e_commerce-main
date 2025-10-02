package com.supermarcheenligne.controller;

import com.supermarcheenligne.entity.CommandeProduit;
import com.supermarcheenligne.entity.CommandeProduitId;
import com.supermarcheenligne.service.CommandeProduitService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/commande-produits")
@Tag(name = "CommandeProduits")
public class CommandeProduitController {
    @Autowired
    private CommandeProduitService commandeProduitService;

    @GetMapping
    public List<CommandeProduit> getAll() {
        return commandeProduitService.findAll();
    }

    @GetMapping("/commande/{commandeId}/produit/{produitId}")
    public Optional<CommandeProduit> getById(@PathVariable Long commandeId, @PathVariable Long produitId) {
        CommandeProduitId id = new CommandeProduitId(commandeId, produitId);
        return commandeProduitService.findById(id);
    }

    @PostMapping
    public CommandeProduit create(@RequestBody CommandeProduit commandeProduit) {
        return commandeProduitService.save(commandeProduit);
    }

    @PutMapping("/commande/{commandeId}/produit/{produitId}")
    public CommandeProduit update(@PathVariable Long commandeId, @PathVariable Long produitId, @RequestBody CommandeProduit commandeProduit) {
        commandeProduit.setCommande(new com.supermarcheenligne.entity.Commande());
        commandeProduit.getCommande().setIdCommande(commandeId);
        commandeProduit.setProduit(new com.supermarcheenligne.entity.Produit());
        commandeProduit.getProduit().setIdProduit(produitId);
        return commandeProduitService.save(commandeProduit);
    }

    @DeleteMapping("/commande/{commandeId}/produit/{produitId}")
    public void delete(@PathVariable Long commandeId, @PathVariable Long produitId) {
        CommandeProduitId id = new CommandeProduitId(commandeId, produitId);
        commandeProduitService.deleteById(id);
    }
}
