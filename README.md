# Star Mousse

Application e-commerce full-stack pour Star Mousse: catalogue produits, panier, commandes, espace client, espaces admin/employe, chatbot et recommandations IA.

## Stack

- Frontend: React, Vite, React Router, React Query
- Backend: Node.js, Express, MongoDB/Mongoose
- IA chatbot: service Python Flask dans `backend/chatbot`
- Deploiement: Vercel pour le frontend, Render/Docker pour le backend selon la configuration existante

## Deploiement Railway + Docker

Le frontend reste deploye sur Vercel. Pour eviter une dependance aux secrets
GitHub Actions/Render, deployez les deux services backend dans Railway :

1. Creez un projet Railway depuis ce depot.
2. Ajoutez un service Docker avec `Root Directory` = `backend`.
3. Ajoutez un second service Docker avec `Root Directory` = `backend/chatbot`.
4. Configurez MongoDB Atlas et Redis, puis ajoutez les variables ci-dessous.

Backend Node :

```text
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
SESSION_SECRET=<secret-long-et-aleatoire>
FRONTEND_URL=https://site-star-mousse.vercel.app
CORS_ORIGINS=https://site-star-mousse.vercel.app
```

Le backend est controle par `/api/health/live`. Le chatbot est controle par
`/health`. Les deux services utilisent automatiquement le port `PORT` fourni
par Railway.

## Deploiement Docker autonome

Pour supprimer toute dependance a GitHub Actions et a un fournisseur PaaS,
utilisez `docker-compose.production.yml` sur un VPS, Coolify ou DigitalOcean :

```bash
cp deploy/production.env.example deploy/production.env
# Editez deploy/production.env avec l'URI MongoDB et le secret de session
docker compose -f docker-compose.production.yml up -d --build
docker compose -f docker-compose.production.yml ps
```

Le backend est expose sur le port `10000`, le chatbot reste prive sur le
reseau Docker et Redis utilise un volume persistant. Le frontend Vercel doit
pointer vers l'URL HTTPS du backend.

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
backend/.env
frontend/.env.local
```

Copier [backend/.env.example](backend/.env.example) vers `backend/.env` et
[frontend/.env.example](frontend/.env.example) vers `frontend/.env.local`.
Ne jamais commiter de vraies cles secretes.

## Commandes

```bash
npm run dev:all        # backend + frontend
npm run dev            # backend uniquement
npm run dev:frontend   # frontend uniquement
npm run build          # build frontend avec installation des dependances
npm run test:unit      # tests unitaires backend
npm run lint           # lint frontend
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
npm run lint
npm run build
```

Le depot ignore les dependances, environnements locaux, logs, caches Python, builds et fichiers IDE.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Organisation du projet](docs/PROJECT-STRUCTURE.md)
- [Developpement](docs/DEVELOPMENT.md)
- [Vue IA](docs/AI-OVERVIEW.md)
