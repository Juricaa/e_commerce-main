package com.supermarcheenligne.repository;

import com.supermarcheenligne.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {}
