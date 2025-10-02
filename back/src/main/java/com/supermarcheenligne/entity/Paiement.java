package com.supermarcheenligne.entity;

import com.supermarcheenligne.enums.StatutPaiement;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPaiement;

    @ManyToOne
    @JoinColumn(name = "id_commande")
    private Commande commande;

    private Double montant;
    private String methodePaiement;

    @Enumerated(EnumType.STRING)
    private StatutPaiement statutPaiement;

    private LocalDate datePaiement;
}
