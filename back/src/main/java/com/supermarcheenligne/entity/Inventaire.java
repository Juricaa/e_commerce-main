package com.supermarcheenligne.entity;

import com.supermarcheenligne.enums.MouvementInventaire;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInventaire;

    @ManyToOne
    @JoinColumn(name = "id_produit")
    private Produit produit;

    @Enumerated(EnumType.STRING)
    private MouvementInventaire mouvement;

    private Integer quantite;
    private LocalDate dateMouvement;
    private String commentaire;
}
