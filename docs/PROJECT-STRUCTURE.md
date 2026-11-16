# Organisation du projet

## Principe

Le dépôt est un monorepo léger : le frontend et le backend ont chacun leur
`package.json`, leurs dépendances et leurs commandes de validation. Le
`package.json` racine sert d'orchestrateur local et de point d'entrée commun.

```text
.
├── backend/
│   ├── app.js                 Entrée HTTP Express
│   ├── config/                Connexions MongoDB et Redis
│   ├── controllers/           Traitement des requêtes par domaine
│   ├── middleware/            Sécurité, validation et observabilité
│   ├── models/                Schémas Mongoose
│   ├── routes/                Contrat HTTP de l'API
│   ├── services/              Logique métier réutilisable
│   ├── chatbot/               Service Python optionnel
│   ├── seeders/               Données initiales
│   ├── scripts/               Migrations et maintenance
│   └── tests/                 Tests Node.js
├── frontend/
│   ├── public/                Assets servis tels quels
│   └── src/
│       ├── components/        Composants partagés
│       ├── data/              Données statiques
│       ├── hooks/             Hooks React partagés
│       ├── pages/             Écrans groupés par espace métier
│       ├── services/          Clients API
│       └── utils/             Fonctions utilitaires
├── docs/                      Documentation technique
├── scripts/                   Outils locaux et tests manuels
└── *.json / *.yaml            Configuration de déploiement
```

## Règles de rangement

- Une route HTTP appartient à `backend/routes`; elle ne contient pas de
  logique métier complexe.
- La logique partagée va dans `backend/services`; les accès aux modèles
  restent explicites dans les controllers ou services.
- Les pages React sont regroupées par espace (`Admin`, `Client`, `Employee`,
  `Auth`, `Info`, `Store`).
- Les appels réseau frontend restent dans `frontend/src/services`.
- Les assets statiques du frontend vont dans `frontend/public`, jamais à la
  racine du dépôt.
- Les scripts réutilisables sont déclarés dans le `package.json` concerné;
  les scripts ponctuels restent dans `scripts/` ou `backend/scripts/`.
- Les secrets sont copiés depuis les fichiers `.env.example` et ne sont
  jamais ajoutés au dépôt.

## Déploiement

- Vercel utilise la configuration racine et construit `frontend/`.
- Railway utilise `backend/railway.json` et démarre l'image Docker de `backend/`.
- `frontend/vercel.json` reste disponible pour un déploiement depuis le
  dossier frontend, mais la configuration racine est la référence du dépôt.
