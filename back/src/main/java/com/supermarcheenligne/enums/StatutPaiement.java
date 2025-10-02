package com.supermarcheenligne.enums;

import lombok.Getter;

@Getter
@SuppressWarnings("unused")
public enum StatutPaiement {
    REUSSI("réussi"),
    ECHOUE("échoué"),
    EN_ATTENTE("en attente");

    private final String label;

    StatutPaiement(String label) {
        this.label = label;
    }

}
