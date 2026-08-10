# Star Mousse

Application e-commerce full-stack pour Star Mousse: catalogue produits, panier, commandes, espace client, espaces admin/employe, chatbot et recommandations IA.

## Stack

- Frontend: React, Vite, React Router, React Query
- Backend: Node.js, Express, MongoDB/Mongoose
- IA chatbot: service Python Flask dans `backend/chatbot`
- Deploiement: Vercel pour le frontend, Render/Docker pour le backend selon la configuration existante

## Structure

```text
.
|-- backend/              API Express, modeles MongoDB, routes, services
|-- frontend/             Application React/Vite
|-- scripts/              Scripts locaux de demarrage et de test
|-- docs/                 Documentation technique du projet
|-- render.yaml           Configuration Render
|-- vercel.json           Configuration Vercel racine
|-- package.json          Commandes racine pour piloter tout le projet
```

## Installation

Prerequis:

- Node.js 20+
- npm
- MongoDB accessible en local ou via une URL distante
- Python 3.11+ si le service chatbot Python est utilise

Installation complete:

```bash
npm run install:all
```

Configurer les variables d'environnement:

```text
.env
backend/.env
frontend/.env.local
```

Utiliser les fichiers `.env.example` comme base et ne jamais commiter de vraies cles secretes.

## Commandes

```bash
npm run dev:all        # backend + frontend
npm run dev            # backend uniquement
npm run dev:frontend   # frontend uniquement
npm run build          # build frontend avec installation des dependances
npm run test:unit      # tests unitaires backend
npm run check:json     # validation des package.json
```

Pour Windows/local:

```powershell
npm run dev:local
```

## Qualite

Avant une livraison:

```bash
npm run check:json
npm run test:unit
npm run build
```

Le depot ignore les dependances, environnements locaux, logs, caches Python, builds et fichiers IDE.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Developpement](docs/DEVELOPMENT.md)
