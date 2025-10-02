package com.supermarcheenligne.service;

import com.supermarcheenligne.entity.Produit;
import com.supermarcheenligne.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {
    @Autowired
    private ProduitRepository produitRepository;

    public List<Produit> findAll() {
        return produitRepository.findAll();
    }

    public Optional<Produit> findById(Long id) {
        return produitRepository.findById(id);
    }

    public Produit save(Produit produit) {
        return produitRepository.save(produit);
    }

    public void deleteById(Long id) {
        produitRepository.deleteById(id);
    }
}
