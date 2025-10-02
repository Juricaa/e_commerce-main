package com.supermarcheenligne.repository;

import com.supermarcheenligne.entity.CommandeProduit;
import com.supermarcheenligne.entity.CommandeProduitId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeProduitRepository extends JpaRepository<CommandeProduit, CommandeProduitId> {}
