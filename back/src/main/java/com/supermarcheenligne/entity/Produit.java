package com.supermarcheenligne.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduit;

    private String nomProduit;
    private String description;
    private Double prix;
    private Integer stock;
    private String categorie;
    private LocalDate dateAjout;
    private String image;
    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL)
    private List<CommandeProduit> commandeProduits;

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL)
    private List<Inventaire> inventaires;
}
