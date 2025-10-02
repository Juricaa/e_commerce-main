package com.supermarcheenligne.repository;

import com.supermarcheenligne.entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeRepository extends JpaRepository<Commande, Long> {}
