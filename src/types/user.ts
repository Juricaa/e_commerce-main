export type User = {
    idClient: number;
    nom: string;
    prenom: string;
    role: 'delivery' | 'admin';
    email: string;
    telephone: string;
    adresse: string;
    date_inscription: string;
    password: string;
  };
  