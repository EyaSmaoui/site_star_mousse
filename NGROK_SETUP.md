# Ngrok Setup Guide - Exposition Publique

## Qu'est-ce que Ngrok?

Ngrok crée un tunnel sécurisé de votre machine locale vers Internet public. Parfait pour:
- Tester votre API sur un serveur public
- Intégrations de webhooks
- Démonstrations rapides

## Installation

### Sur Windows:

1. **Via Chocolatey**
```bash
choco install ngrok
```

2. **Manuel**
   - Télécharger: https://ngrok.com/download
   - Extraire dans un dossier (ex: `C:\ngrok`)
   - Ajouter le chemin aux variables d'environnement

3. **Vérifier l'installation**
```bash
ngrok --version
```

## Configuration

### 1. Créer un compte Ngrok
- Allez sur https://ngrok.com
- Cliquez sur "Sign Up"
- Vérifiez votre email

### 2. Obtenir votre Auth Token
- Connectez-vous à https://dashboard.ngrok.com
- Allez dans "Auth"
- Copiez votre auth token

### 3. Configurer Ngrok
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## Utilisation

### Exposer votre Backend (port 5000)

```bash
# Simple
ngrok http 5000

# Avec nom de subdomain personnalisé (avec compte payant)
ngrok http 5000 --subdomain=starmousse

# Avec plusieurs protocoles
ngrok http 5000 --host-header=localhost
```

### Exposer votre Frontend (port 3000)

```bash
ngrok http 3000
```

## Configuration dans le Frontend

### Mettre à jour le proxy API
Créez un fichier `.env.local` dans le frontend:

```
# .env.local
REACT_APP_API_URL=https://YOUR_NGROK_URL.ngrok-free.app
```

Ou modifiez votre axiosInstance:

```javascript
// src/api/axiosInstance.js
const API_URL = process.env.REACT_APP_API_URL || 'https://YOUR_NGROK_URL.ngrok-free.app';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});
```

## Configuration Backend pour Ngrok

### Update CORS in app.js:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://*.ngrok-free.app' // Ngrok URLs
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

## Dashboard Ngrok

Une fois ngrok lancé, ouvrez le dashboard:
- URL: `http://127.0.0.1:4040`
- Vous verrez tous les requêtes HTTP/HTTPS
- Vous pouvez inspecter les headers, body, réponses

## Workflow Complet

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Écoute sur http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
# Écoute sur http://localhost:3000
```

### Terminal 3: Ngrok
```bash
# Exposer le backend
ngrok http 5000

# Copier l'URL: https://xxxxx.ngrok-free.app
# Ajouter à votre frontend REACT_APP_API_URL
```

## Limitations & Upgrades

### Plan Gratuit:
- 1 session simultanée
- URL change à chaque redémarrage
- Pas de custom domains
- 40 connexions/minute max

### Plan Payant (Pro):
- Subdomains personnalisés
- IPs réservés
- Métriques avancées
- Support prioritaire

## Alternatives à Ngrok

- **Vercel Serverless**: Pour le frontend
- **Heroku**: Pour le backend simple
- **Railway**: Alternative moderne à Heroku
- **AWS EC2**: Pour la production

## Troubleshooting

### Erreur: "Invalid auth token"
```bash
ngrok config add-authtoken YOUR_TOKEN
```

### CORS Errors
- Vérifiez que Ngrok URL est dans la whitelist CORS
- Assurez-vous que `credentials: true` est configuré

### Connexion lente
- Vérifiez votre connexion Internet
- Utilisez un serveur plus proche géographiquement
- Réduisez la taille des payloads

### Session expirée
- Ngrok redémarre: c'est normal
- Pour éviter cela, utilisez un plan payant avec auth token persistant

## Tips & Tricks

### 1. Custom domain (avec plan payant)
```bash
ngrok http 5000 --subdomain=myapi
# https://myapi.ngrok-free.app
```

### 2. Basic auth sur le tunnel
```bash
ngrok http 5000 --auth="username:password"
```

### 3. Logging & Inspection
```bash
# Voir tous les requêtes
ngrok http 5000 -log=stdout

# Changer le log level
ngrok http 5000 -log=stdout -log-level=debug
```

### 4. Multiple instances
```bash
# Dans différents terminals
ngrok http 5000 -log=stdout -log-level=info
ngrok http 3000 -region=eu  # Région spécifique
```

## Resources
- Ngrok Documentation: https://ngrok.com/docs
- Ngrok API: https://ngrok.com/docs/api
- Ngrok Pricing: https://ngrok.com/pricing
