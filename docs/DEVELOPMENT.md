# Developpement

## Demarrage rapide

```bash
npm run install:all
npm run dev:all
```

Par defaut:

- Frontend Vite: `http://localhost:5173`
- Backend API: selon `PORT` dans `.env`, souvent `http://localhost:5000`

## Variables d'environnement

Ne pas commiter les fichiers `.env`, `.env.local`, `.env.production` ou `.env.ai`.

Fichiers de reference:

- `backend/.env.example`
- `frontend/.env.example`

Variables courantes cote backend:

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `SESSION_SECRET`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`
- `SENTRY_DSN`

Variables courantes cote frontend:

- `VITE_API_URL`
- `VITE_SITE_URL`

## Tests et verification

```bash
npm run check:json
npm run test:unit
npm run build
```

## Nettoyage du depot

Les fichiers suivants doivent rester hors Git:

- `node_modules/`
- `.env*` sauf `.env.example`
- `logs/`
- `frontend/dist/`
- `backend/chatbot/.venv/`
- `__pycache__/`
- fichiers IDE locaux comme `.vs/`

## Ajout de fonctionnalite

1. Ajouter ou modifier le modele dans `backend/models` si les donnees changent.
2. Ajouter la logique metier dans `backend/services`.
3. Exposer l'endpoint dans `backend/controllers` et `backend/routes`.
4. Ajouter l'appel HTTP dans `frontend/src/services`.
5. Brancher la page ou le composant dans `frontend/src/pages` ou `frontend/src/components`.
6. Lancer les checks avant livraison.
