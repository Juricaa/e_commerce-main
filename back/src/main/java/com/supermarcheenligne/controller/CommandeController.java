package com.supermarcheenligne.controller;

import com.supermarcheenligne.entity.Commande;
import com.supermarcheenligne.service.CommandeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/commandes")
@Tag(name = "Commandes")
public class CommandeController {
    @Autowired
    private CommandeService commandeService;

    @GetMapping
    public List<Commande> getAll() {
        return commandeService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Commande> getById(@PathVariable Long id) {
        return commandeService.findById(id);
    }

    @PostMapping
    public Commande create(@RequestBody Commande commande) {
        return commandeService.save(commande);
    }

    @PutMapping("/{id}")
    public Commande update(@PathVariable Long id, @RequestBody Commande commande) {
        commande.setIdCommande(id);
        return commandeService.save(commande);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commandeService.deleteById(id);
    }
}
