package com.supermarcheenligne.entity;

import lombok.*;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(CommandeProduitId.class)
public class CommandeProduit implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "id_commande")
    private Commande commande;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_produit")
    private Produit produit;

    private Integer quantite;
    private Double prixUnitaire;
}
