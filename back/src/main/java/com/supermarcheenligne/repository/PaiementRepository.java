package com.supermarcheenligne.repository;

import com.supermarcheenligne.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {}
