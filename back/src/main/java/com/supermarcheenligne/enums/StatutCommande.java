package com.supermarcheenligne.enums;

public enum StatutCommande {
    EN_ATTENTE("en attente"),
    PAYEE("payée"),
    EXPEDIEE("expédiée"),
    ANNULEE("annulée");

    private final String label;

    StatutCommande(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
