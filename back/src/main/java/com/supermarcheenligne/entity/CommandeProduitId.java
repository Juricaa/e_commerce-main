package com.supermarcheenligne.entity;

import lombok.*;
import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeProduitId implements Serializable {
    private Long commande;
    private Long produit;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CommandeProduitId that = (CommandeProduitId) o;
        return Objects.equals(commande, that.commande) && Objects.equals(produit, that.produit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(commande, produit);
    }
}
