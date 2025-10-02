package com.supermarcheenligne.enums;

public enum MouvementInventaire {
    ENTREE("entrée"),
    SORTIE("sortie"),
    AJUSTEMENT("ajustement");

    private final String label;

    MouvementInventaire(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
