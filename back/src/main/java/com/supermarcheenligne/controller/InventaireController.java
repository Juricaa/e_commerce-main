package com.supermarcheenligne.controller;

import com.supermarcheenligne.entity.Inventaire;
import com.supermarcheenligne.service.InventaireService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventaires")
@Tag(name = "Inventaires")
public class InventaireController {
    @Autowired
    private InventaireService inventaireService;

    @GetMapping
    public List<Inventaire> getAll() {
        return inventaireService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Inventaire> getById(@PathVariable Long id) {
        return inventaireService.findById(id);
    }

    @PostMapping
    public Inventaire create(@RequestBody Inventaire inventaire) {
        return inventaireService.save(inventaire);
    }

    @PutMapping("/{id}")
    public Inventaire update(@PathVariable Long id, @RequestBody Inventaire inventaire) {
        inventaire.setIdInventaire(id);
        return inventaireService.save(inventaire);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        inventaireService.deleteById(id);
    }
}
