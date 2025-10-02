package com.supermarcheenligne.controller;

import com.supermarcheenligne.entity.Paiement;
import com.supermarcheenligne.service.PaiementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/paiements")
@Tag(name = "Paiements")
public class PaiementController {
    @Autowired
    private PaiementService paiementService;

    @GetMapping
    public List<Paiement> getAll() {
        return paiementService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Paiement> getById(@PathVariable Long id) {
        return paiementService.findById(id);
    }

    @PostMapping
    public Paiement create(@RequestBody Paiement paiement) {
        return paiementService.save(paiement);
    }

    @PutMapping("/{id}")
    public Paiement update(@PathVariable Long id, @RequestBody Paiement paiement) {
        paiement.setIdPaiement(id);
        return paiementService.save(paiement);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        paiementService.deleteById(id);
    }
}
