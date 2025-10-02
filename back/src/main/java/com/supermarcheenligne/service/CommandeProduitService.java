package com.supermarcheenligne.service;

import com.supermarcheenligne.entity.CommandeProduit;
import com.supermarcheenligne.entity.CommandeProduitId;
import com.supermarcheenligne.repository.CommandeProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommandeProduitService {
    @Autowired
    private CommandeProduitRepository commandeProduitRepository;

    public List<CommandeProduit> findAll() {
        return commandeProduitRepository.findAll();
    }

    public Optional<CommandeProduit> findById(CommandeProduitId id) {
        return commandeProduitRepository.findById(id);
    }

    public CommandeProduit save(CommandeProduit commandeProduit) {
        return commandeProduitRepository.save(commandeProduit);
    }

    public void deleteById(CommandeProduitId id) {
        commandeProduitRepository.deleteById(id);
    }
}
