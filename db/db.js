import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { existsSync } from 'node:fs';

// Vérifie si le fichier de base de données est 
// nouveau (n'existe pas encore)
const IS_NEW = !existsSync(process.env.DB_FILE);

// Connexion à la base de données. Vous devez 
// spécifier le nom du fichier de base de données 
// dans le fichier .env
let db = await open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Création de la table si elle n'existe pas, on 
// peut écrire du code SQL pour initialiser les 
// tables et données dans la fonction exec()
if(IS_NEW) {
    await db.exec(
        `PRAGMA foreign_keys = ON;
        
        CREATE TABLE utilisateur (
            user_id       INTEGER PRIMARY KEY AUTOINCREMENT ,
            username      TEXT    NOT NULL ,
            user_password TEXT    NOT NULL ,  
            user_email    TEXT    NOT NULL UNIQUE
            
        );
        CREATE TABLE boutique (
            boutique_id     INTEGER PRIMARY KEY AUTOINCREMENT ,
            nom_boutique    TEXT    NOT NULL,
            tel_boutique    TEXT,
            adresse_boutique TEXT NOT NULL
            
        );
        CREATE TABLE vendeur (
            agent_id      INTEGER PRIMARY KEY AUTOINCREMENT ,
            nom_agent     TEXT    NOT NULL,
            prenom_agent  TEXT    NOT NULL,
            boutique_id   INTEGER NOT NULL,
            user_id       INTEGER NOT NULL UNIQUE,
            FOREIGN KEY (boutique_id) REFERENCES boutique(boutique_id),
            FOREIGN KEY (user_id) REFERENCES utilisateur(user_id) 
        );
        CREATE TABLE superviseur (
            superviseur_id   INTEGER PRIMARY KEY AUTOINCREMENT ,
            nom_supervis     TEXT    NOT NULL,
            prenom_supervis  TEXT    NOT NULL,
            boutique_id      INTEGER NOT NULL,
            user_id          INTEGER NOT NULL UNIQUE,
            FOREIGN KEY (boutique_id) REFERENCES boutique(boutique_id),
            FOREIGN KEY (user_id) REFERENCES utilisateur(user_id)
        );
       
        CREATE TABLE categorie (
            categorie_id   INTEGER PRIMARY KEY AUTOINCREMENT  ,
            nom_categorie  TEXT NOT NULL UNIQUE
        );

        CREATE TABLE produit (
            produit_id    INTEGER PRIMARY KEY  AUTOINCREMENT ,
            nom_produit   TEXT   NOT NULL,
            code_produit  TEXT   NOT NULL UNIQUE,
            categorie_id  INTEGER,
            prix_unitaire REAL   NOT NULL,
            FOREIGN KEY (categorie_id) REFERENCES categorie(categorie_id)
        );
        CREATE TABLE stock (
            stock_id      INTEGER PRIMARY KEY AUTOINCREMENT ,
            boutique_id   INTEGER NOT NULL,
            produit_id    INTEGER NOT NULL,
            quantite      INTEGER NOT NULL,
            date_stock    DATE NOT NULL,
            FOREIGN KEY (boutique_id) REFERENCES boutique(boutique_id),
            FOREIGN KEY (produit_id) REFERENCES produit(produit_id)
        );
        CREATE TABLE approvisionnement (
            approv_id      INTEGER PRIMARY KEY AUTOINCREMENT ,
            boutique_id   INTEGER NOT NULL,
            produit_id    INTEGER NOT NULL,
            quantite      INTEGER NOT NULL,
            date_stock    DATE NOT NULL,

            FOREIGN KEY (boutique_id) REFERENCES boutique(boutique_id),
            FOREIGN KEY (produit_id) REFERENCES produit(produit_id)
        );

        CREATE TABLE vente (
            vente_id      INTEGER PRIMARY KEY AUTOINCREMENT ,
            boutique_id   INTEGER NOT NULL,
            agent_id      INTEGER NOT NULL,
            date_vente    DATE NOT NULL,
            total_vente   REAL    NOT NULL ,
            FOREIGN KEY (boutique_id) REFERENCES boutique(boutique_id),
            FOREIGN KEY (agent_id) REFERENCES agent_vendeur(agent_id)
        );

       










        
`);
}

export { db }