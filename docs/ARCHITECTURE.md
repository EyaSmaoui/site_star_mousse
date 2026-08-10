# Architecture

## Vue d'ensemble

Star Mousse est organise en trois zones principales:

- `frontend/`: interface client et back-office React.
- `backend/`: API Express, logique metier, securite, persistance MongoDB.
- `backend/chatbot/`: service Python dedie aux fonctions chatbot/sentiment quand il est deploye separement.

## Backend

```text
backend/
|-- app.js              Point d'entree Express
|-- config/             Connexions externes: MongoDB, Redis
|-- controllers/        Handlers HTTP par domaine
|-- middleware/         Auth, validation, rate limit, securite
|-- models/             Schemas Mongoose
|-- routes/             Definition des endpoints API
|-- services/           Logique metier reutilisable
|-- seeders/            Donnees initiales
|-- scripts/            Scripts de maintenance/migration
|-- tests/              Tests unitaires Node
```

Domaines principaux:

- Produits, categories et stock
- Panier, commandes et paiements
- Clients, managers, utilisateurs et roles
- Avis, recommandations, recherche IA et chatbot
- Metriques et zones de livraison

## Frontend

```text
frontend/src/
|-- components/         Composants reutilisables
|-- pages/              Pages par espace fonctionnel
|-- services/           Clients API et appels HTTP
|-- hooks/              Hooks React partages
|-- utils/              Fonctions utilitaires
|-- styles/             Styles specialises
|-- data/               Donnees statiques
```

Espaces applicatifs:

- Boutique publique: accueil, catalogue, promotions, panier, checkout
- Client: tableau de bord, commandes, avis, recommandations
- Employe: commandes, stock, clients, profil
- Admin: dashboard, commandes, managers, clients, stock, profil

## Conventions

- Les routes HTTP restent dans `backend/routes`.
- La logique metier partagee reste dans `backend/services`.
- Les appels API frontend restent dans `frontend/src/services`.
- Les pages React restent separees par espace dans `frontend/src/pages`.
- Les scripts ponctuels restent dans `scripts/` ou `backend/scripts/` selon leur cible.
