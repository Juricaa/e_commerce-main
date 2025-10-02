package com.supermarcheenligne.service;

import com.supermarcheenligne.entity.Inventaire;
import com.supermarcheenligne.repository.InventaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventaireService {
    @Autowired
    private InventaireRepository inventaireRepository;

    public List<Inventaire> findAll() {
        return inventaireRepository.findAll();
    }

    public Optional<Inventaire> findById(Long id) {
        return inventaireRepository.findById(id);
    }

    public Inventaire save(Inventaire inventaire) {
        return inventaireRepository.save(inventaire);
    }

    public void deleteById(Long id) {
        inventaireRepository.deleteById(id);
    }
}
