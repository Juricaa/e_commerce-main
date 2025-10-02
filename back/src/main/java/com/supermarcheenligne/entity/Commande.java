package com.supermarcheenligne.entity;

import com.supermarcheenligne.enums.StatutCommande;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommande;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    private LocalDate dateCommande;

    @Enumerated(EnumType.STRING)
    private StatutCommande statut;

    private Double total;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<CommandeProduit> commandeProduits;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<Paiement> paiements;
}
