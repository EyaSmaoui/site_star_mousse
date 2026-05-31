# 🚀 Deployment Guide - GitHub + MongoDB + Ngrok

## Architecture

```
┌─────────────────────────────────────┐
│    Votre Machine Locale              │
│  (Backend + Frontend en développement)│
└────────────┬────────────────────────┘
             │
    ┌────────┴─────────┐
    ▼                  ▼
┌─────────────┐  ┌──────────────┐
│   Ngrok     │  │   MongoDB    │
│  (Tunnel)   │  │   (Atlas)    │
│ Public URL  │  │   Database   │
└─────────────┘  └──────────────┘
    │
    ▼
Internet Public
(Votre API accessible partout)
```

---

## 📋 Phase 1: MongoDB Cloud Setup (5 minutes)

### Step 1: Créer un compte MongoDB Atlas

1. Allez sur: https://www.mongodb.com/cloud/atlas
2. Cliquez "Register"
3. Créez un compte (email + password)
4. Vérifiez votre email

### Step 2: Créer un Cluster Gratuit

1. Cliquez "Create a Deployment"
2. Choisissez **"M0 Sandbox"** (gratuit, 512MB)
3. Sélectionnez votre région (France ou Europe)
4. Cliquez "Create Deployment"
5. Attendez 5-10 minutes

### Step 3: Sécurité - Créer un Utilisateur

1. Allez dans **"Database Access"**
2. Cliquez **"Add New Database User"**
3. Choisissez "Username and Password"
4. Username: `admin`
5. Password: Créez un mot de passe fort (ex: `MySecure@Pass123`)
6. Cliquez "Add User"

### Step 4: Whitelist IP

1. Allez dans **"Network Access"**
2. Cliquez **"Add IP Address"**
3. Choisissez **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Cliquez "Confirm"

### Step 5: Obtenir la Chaîne de Connexion

1. Allez dans **"Databases"**
2. Cliquez **"Connect"**
3. Choisissez **"Drivers"**
4. Copiez l'URI ressemblant à:
```
mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. Remplacez `PASSWORD` par votre mot de passe réel

---

## 🔧 Phase 2: Configuration Backend

### Créer/Mettre à jour `backend/.env`

```env
# Database
MONGODB_URI=mongodb+srv://admin:YourPassword@cluster0.xxxxx.mongodb.net/site_star_mousse?retryWrites=true&w=majority
DB_NAME=site_star_mousse

# Server
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# Security
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=*

# Logging
LOG_LEVEL=debug
```

**Exemple complet:**
```env
MONGODB_URI=mongodb+srv://admin:MySecure@Pass123@cluster0.a1b2c3d4.mongodb.net/site_star_mousse?retryWrites=true&w=majority
DB_NAME=site_star_mousse
NODE_ENV=development
PORT=5000
HOST=0.0.0.0
JWT_SECRET=dev-secret-key-abc123xyz789
CORS_ORIGIN=*
LOG_LEVEL=debug
```

### Tester la Connexion MongoDB

```powershell
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB Connected!')).catch(e => console.log('❌ Error:', e.message))"
```

---

## 🌍 Phase 3: Ngrok Setup (Exposition Publique)

### Step 1: Installer Ngrok

```powershell
choco install ngrok
```

### Step 2: Créer un Compte Ngrok

1. Allez sur: https://ngrok.com
2. Cliquez "Sign Up"
3. Créez un compte (email + password)
4. Vérifiez votre email

### Step 3: Obtenir Auth Token

1. Connectez-vous: https://dashboard.ngrok.com
2. Allez dans **"Auth"**
3. Copiez votre **Auth Token**

### Step 4: Configurer Ngrok Localement

```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### Step 5: Démarrer Ngrok

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Ngrok (exposer le backend):**
```powershell
ngrok http 5000
```

Vous verrez:
```
ngrok by @inconshrevable                                                                                                                        

Session Status                online                                                                                                            
Account                       your-email@example.com (Plan: Free)                                                                              
Version                        3.3.4                                                                                                           
Region                         United States (us)                                                                                              
Forwarding                     https://a1b2c3d4.ngrok-free.app -> http://localhost:5000
Forwarding                     http://a1b2c3d4.ngrok-free.app -> http://localhost:5000                                                        

Web Interface                 http://127.0.0.1:4040                                                                                            
Press STOP on web ngrok interface to stop your tunnel
Command Line Interface        Press Ctrl+C to quit
```

**Votre URL publique**: `https://a1b2c3d4.ngrok-free.app`

---

## 🖥️ Phase 4: Frontend Configuration

### Mettre à jour `frontend/.env.development`

```
REACT_APP_API_URL=https://a1b2c3d4.ngrok-free.app
```

Remplacez `a1b2c3d4` par votre URL Ngrok réelle!

### Démarrer Frontend

**Terminal 3 - Frontend:**
```powershell
cd frontend
npm start
```

Frontend sera accessible sur: `http://localhost:3000`

---

## 📊 Architecture Complète

```
Votre Ordinateur
├─ Backend (localhost:5000)
│  ├─ Expose via Ngrok → https://xxxxxx.ngrok-free.app
│  └─ Connected to MongoDB Atlas
│
├─ Frontend (localhost:3000)
│  └─ Connected to Backend via Ngrok URL
│
└─ MongoDB
   └─ MongoDB Atlas (Cloud)
```

### Requête Utilisateur Final:
```
1. User accède: https://xxxxxx.ngrok-free.app
2. Ngrok redirige vers: localhost:5000 (Backend)
3. Backend traite la requête
4. Backend requête MongoDB Atlas
5. Réponse retour utilisateur
```

---

## ✅ Vérification - Tout Fonctionne?

### Test 1: MongoDB
```powershell
# Dans backend directory
npm run test --prefix backend
# Devrait voir les tests passer
```

### Test 2: Backend Accessible

```powershell
# Remplacez par votre URL Ngrok
curl https://a1b2c3d4.ngrok-free.app/api/health
# Devrait retourner une réponse
```

### Test 3: Frontend Accessible

Ouvrez dans votre navigateur:
- Local: `http://localhost:3000`
- Publique: `https://a1b2c3d4.ngrok-free.app`

Les deux devraient fonctionner!

---

## 🔐 Sécurité Checklist

- [x] MongoDB: Utilisateur créé avec password fort
- [x] MongoDB: IP whitelisted (vous pouvez restreindre plus tard)
- [x] Backend: JWT_SECRET défini
- [x] Backend: CORS configuré
- [x] Ngrok: Auth token configuré
- [ ] En production: Changer CORS_ORIGIN spécifiquement
- [ ] En production: Utiliser HTTPS partout
- [ ] En production: Secrets en variables d'environnement

---

## 🚀 Workflow Quotidien

Chaque jour, pour développer et tester:

### Morning Setup (5 minutes):
```powershell
# Terminal 1: Backend
cd C:\site_star_mousse\backend
npm run dev

# Terminal 2: Ngrok
ngrok http 5000
# Copier l'URL

# Terminal 3: Frontend
cd C:\site_star_mousse\frontend
npm start
# Mettre à jour REACT_APP_API_URL si l'URL Ngrok a changé
```

### Development:
- Modifiez le code
- Backend recharge automatiquement (nodemon)
- Frontend recharge automatiquement (react-scripts)
- Testez via `localhost:3000`

### Testing Public:
- URL Ngrok = API publique
- Partagez avec collègues/clients
- Ils peuvent tester votre app en live!

### Shutdown:
- Ctrl+C pour arrêter tous les services
- Les changements sont sauvegardés via Git

---

## 📈 Limitations Ngrok (Plan Gratuit)

- ⚠️ URL change à chaque redémarrage
- ⚠️ 1 session simultanée
- ⚠️ 40 connexions/minute max
- ⚠️ Pas de custom domain

**Solution**: Upgrade vers plan payant si besoin

---

## 🔄 Git Workflow

### Sauvegarder votre travail

```powershell
# Depuis site_star_mousse root
git add .
git commit -m "Add testing infrastructure and deployment setup"
git push origin main
```

### Collaborer avec GitHub Desktop

1. Ouvrez GitHub Desktop
2. Cliquez "Current Repository"
3. Faites vos changements
4. Cliquez "Commit to main"
5. Cliquez "Push origin"

---

## 🐛 Troubleshooting

### Ngrok URL ne fonctionne pas

```powershell
# Vérifier que backend tourne
curl http://localhost:5000/api/health

# Vérifier Ngrok status
# Allez à http://127.0.0.1:4040
```

### MongoDB connection error

```powershell
# Vérifier l'URI
echo $env:MONGODB_URI

# Vérifier la connexion
mongosh "YOUR_CONNECTION_STRING"
```

### Frontend ne peut pas joindre API

```powershell
# Vérifier l'URL dans frontend/.env.development
cat frontend/.env.development | findstr REACT_APP_API_URL

# Redémarrer frontend
# npm start
```

---

## 📊 Monitoring & Logs

### Backend Logs
```powershell
# Les logs apparaissent dans Terminal 1
# Recherchez "INFO", "ERROR", "WARN"
```

### Ngrok Monitoring
```
Web Interface: http://127.0.0.1:4040
- Voir toutes les requêtes
- Inspecter headers, body, réponses
- Replay les requêtes
```

### MongoDB Monitoring
```
Atlas Dashboard: https://cloud.mongodb.com
- Voir les requêtes
- Monitor la performance
- Gérer l'espace disque
```

---

## 🎯 Prochaines Étapes

1. ✅ Créer MongoDB Atlas
2. ✅ Configurer Ngrok
3. ✅ Mettre à jour les .env files
4. ✅ Tester localement
5. ⏭️ Écrire de vrais tests
6. ⏭️ Créer E2E tests
7. ⏭️ Performance testing
8. ⏭️ Production deployment (après)

---

## 📞 Questions?

**MongoDB Issues?** → Voir `MONGODB_SETUP.md`
**Ngrok Issues?** → Voir `NGROK_SETUP.md`
**Testing Issues?** → Voir `TESTING_COMPLETE_GUIDE.md`
**Deployment to Prod?** → Voir `DEPLOYMENT_GUIDE.md`

---

## ✨ You're Ready!

Vous avez maintenant:
- ✅ Testing infrastructure complète
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ MongoDB Cloud setup
- ✅ Ngrok public access
- ✅ Full development workflow

**Commence à développer! 🚀**

---

*Guide créé: 31/05/2026*
*Version: 1.0*
