export type User = {
    idClient: number;
    nom: string;
    prenom: string;
    role: 'delivery' | 'admin';
    email: string;
    telephone: string;
    adresse: string;
    dateInscription: string;
    password: string;
  };
  