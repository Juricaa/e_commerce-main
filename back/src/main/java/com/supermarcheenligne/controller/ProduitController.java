package com.supermarcheenligne.controller;

import com.supermarcheenligne.entity.Produit;
import com.supermarcheenligne.service.ProduitService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produits")
@Tag(name = "Produits")
public class ProduitController {
    @Autowired
    private ProduitService produitService;

    @GetMapping
    public List<Produit> getAll() {
        return produitService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Produit> getById(@PathVariable Long id) {
        return produitService.findById(id);
    }

    @PostMapping
    public Produit create(@RequestBody Produit produit) {
        return produitService.save(produit);
    }

    @PutMapping("/{id}")

public ResponseEntity<Produit> update(@PathVariable Long id, @RequestBody Produit produitDetails) {
    
    Optional<Produit> produitOptional = produitService.findById(id); 

    if (!produitOptional.isPresent()) {
        return ResponseEntity.notFound().build(); 
    }

    Produit existingProduit = produitOptional.get();

    existingProduit.setNomProduit(produitDetails.getNomProduit());
    existingProduit.setDescription(produitDetails.getDescription());
    existingProduit.setPrix(produitDetails.getPrix());
    existingProduit.setStock(produitDetails.getStock());
    existingProduit.setCategorie(produitDetails.getCategorie());
    existingProduit.setImage(produitDetails.getImage());   
 
    Produit updatedProduit = produitService.save(existingProduit);

    return ResponseEntity.ok(updatedProduit);
}

    // @PutMapping("/{id}")
    // public Produit update(@PathVariable Long id, @RequestBody Produit produit) {
    //     produit.setIdProduit(id);
    //     return produitService.save(produit);
    // }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        produitService.deleteById(id);
    }
}
