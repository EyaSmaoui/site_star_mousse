# 🚀 Quick Start - Testing & Hébergement

## ⚡ 5 Minutes Setup

### 1. Cloner & Installer
```bash
git clone <repository>
cd site_star_mousse
npm run install:all
```

### 2. Configurer l'environnement

**Créer `backend/.env`:**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/site_star_mousse
JWT_SECRET=dev-secret-key-12345
CORS_ORIGIN=http://localhost:3000
```

**Créer `frontend/.env.development`:**
```
REACT_APP_API_URL=http://localhost:5000
```

### 3. Démarrer (3 terminaux)

**Terminal 1: Backend**
```bash
cd backend && npm run dev
# ✅ Backend sur http://localhost:5000
```

**Terminal 2: Frontend**
```bash
cd frontend && npm start
# ✅ Frontend sur http://localhost:3000
```

**Terminal 3: Ngrok (optionnel)**
```bash
ngrok http 5000
# ✅ Public URL: https://xxxxx.ngrok-free.app
```

### 4. Exécuter les tests
```bash
# Tests unitaires
npm run test --prefix backend

# Tests frontend
npm run test --prefix frontend

# Tous les tests
npm run test --prefix backend && npm run test --prefix frontend
```

## 📊 Tableau Récapitulatif

| Action | Commande | Résultat |
|--------|----------|----------|
| **Installer dépendances** | `npm run install:all` | ✅ Backend + Frontend prêts |
| **Démarrer Backend** | `npm run dev --prefix backend` | ✅ http://localhost:5000 |
| **Démarrer Frontend** | `npm start --prefix frontend` | ✅ http://localhost:3000 |
| **Démarrer tout** | `npm run dev:all --prefix backend` | ✅ Backend + Frontend |
| **Tests Backend** | `npm run test --prefix backend` | ✅ Jest tests |
| **Tests Frontend** | `npm run test --prefix frontend` | ✅ RTL + Jest |
| **Coverage Report** | `npm run test:coverage --prefix backend` | ✅ Rapport coverage |
| **E2E Tests** | `npm run cypress:run --prefix frontend` | ✅ Cypress tests |
| **Performance Test** | `npm run perf:load --prefix backend` | ✅ Artillery load test |
| **Build Production** | `npm run build --prefix frontend` | ✅ Optimized build |

## 🔗 MongoDB - Options Rapides

### Option 1: Atlas Cloud (Recommandé)
```bash
# 1. Aller sur https://www.mongodb.com/cloud/atlas
# 2. Créer un compte gratuit
# 3. Créer un cluster M0 Sandbox
# 4. Copier l'URI
# 5. Ajouter à backend/.env:

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
```

### Option 2: Local MongoDB
```bash
# 1. Installer
choco install mongodb-community

# 2. Créer dossier données
mkdir "C:\data\db"

# 3. Démarrer
mongod --dbpath "C:\data\db"

# 4. Dans backend/.env:
MONGODB_URI=mongodb://localhost:27017/site_star_mousse
```

## 🌍 Ngrok - Exposition Publique

### Installation
```bash
# 1. Télécharger
choco install ngrok

# 2. S'authentifier
ngrok config add-authtoken YOUR_TOKEN
# (Compte gratuit: https://ngrok.com)

# 3. Démarrer
ngrok http 5000

# 4. Copier l'URL et ajouter au frontend:
# REACT_APP_API_URL=https://xxxxx.ngrok-free.app
```

## 📈 CI/CD - GitHub Actions

Le workflow s'exécute automatiquement:
- À chaque `push` sur `main` ou `develop`
- À chaque pull request

**Voir le statut:**
1. Allez sur GitHub.com → Votre repo
2. Cliquez sur "Actions"
3. Vérifiez le statut du workflow

## 🧪 Tests - Cheat Sheet

### Unit Tests (Backend)
```bash
npm run test --prefix backend
npm run test:watch --prefix backend
npm run test:coverage --prefix backend
```

### Unit Tests (Frontend)
```bash
npm run test --prefix frontend
npm run test:watch --prefix frontend
npm run test:coverage --prefix frontend
```

### E2E Tests
```bash
npm run cypress:open --prefix frontend      # Mode interactif
npm run cypress:run --prefix frontend       # Mode headless (CI)
```

### Performance Tests
```bash
npm run perf:quick --prefix backend         # Test rapide
npm run perf:load --prefix backend          # Load test
npm run perf:stress --prefix backend        # Stress test
npm run perf:soak --prefix backend          # Soak test (1h)
```

## 🔐 Security Checks

```bash
# Audit des dépendances
npm audit --prefix backend
npm audit --prefix frontend

# Vérifier les headers de sécurité
curl -I http://localhost:5000/api/health

# CORS check
curl -H "Origin: http://example.com" http://localhost:5000/api
```

## 🐛 Troubleshooting Rapide

### Port déjà utilisé
```bash
# Trouver et terminer le process
lsof -i :5000              # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Terminer
kill -9 <PID>              # Mac/Linux
taskkill /PID <PID> /F     # Windows

# Ou changer le port dans .env
PORT=3001
```

### MongoDB connection error
```bash
# Vérifier la connexion
mongosh "your-uri"

# Vérifier que l'IP est whitelisted (Atlas)
# Settings → Network Access → Add IP
```

### CORS errors
```bash
# Vérifier CORS dans backend/app.js
console.log(process.env.CORS_ORIGIN);

# Assurez-vous que le frontend URL est correct
```

### Tests échouent
```bash
# Supprimer node_modules et réinstaller
rm -rf backend/node_modules frontend/node_modules
npm run install:all

# Vérifier les versions
npm list jest
npm list @testing-library/react
```

## 📚 Documentation Complète

- **[TESTING_COMPLETE_GUIDE.md](./TESTING_COMPLETE_GUIDE.md)** - Vue d'ensemble complète
- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - Configuration MongoDB détaillée
- **[NGROK_SETUP.md](./NGROK_SETUP.md)** - Ngrok complet
- **[CYPRESS_E2E_GUIDE.md](./CYPRESS_E2E_GUIDE.md)** - E2E testing avancé
- **[ARTILLERY_PERFORMANCE_GUIDE.md](./ARTILLERY_PERFORMANCE_GUIDE.md)** - Performance testing
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Déploiement en production

## 🎯 Checklist Initial

- [ ] `npm run install:all` réussi
- [ ] MongoDB configuré (local ou Atlas)
- [ ] `.env` créé dans backend et frontend
- [ ] Backend démarre: `npm run dev --prefix backend`
- [ ] Frontend démarre: `npm start --prefix frontend`
- [ ] Tests passent: `npm run test --prefix backend`
- [ ] Ngrok configuré (optionnel)
- [ ] API accessible: `curl http://localhost:5000`

## 💡 Pro Tips

1. **Live Reloading**
   - Backend: `npm run dev` (nodemon active)
   - Frontend: `npm start` (react-scripts active)

2. **Watch Tests**
   ```bash
   npm run test:watch --prefix backend
   ```

3. **Voir les logs détaillés**
   ```bash
   NODE_ENV=development npm run dev --prefix backend
   ```

4. **Déboguer avec Chrome DevTools**
   - Frontend: F12 dans le navigateur
   - Backend: `node --inspect app.js`

5. **Performance rapide**
   - Utiliser MongoDB Atlas au lieu de local
   - Ngrok pour tester publiquement

## 🚀 Prochaines Étapes

1. **Immédiat**
   - [ ] Setup MongoDB
   - [ ] Démarrer backend/frontend
   - [ ] Vérifier tests

2. **Court terme**
   - [ ] Créer Cypress tests
   - [ ] Configurer Ngrok
   - [ ] Vérifier GitHub Actions

3. **Moyen terme**
   - [ ] Performance testing complet
   - [ ] Déployer en staging
   - [ ] Monitoring setup

4. **Long terme**
   - [ ] Production deployment
   - [ ] Auto-scaling setup
   - [ ] DR plan (Disaster Recovery)

## 📞 Questions?

1. Vérifiez d'abord la doc concernée
2. Cherchez dans les guides détaillés
3. Vérifiez les logs de l'application
4. Vérifiez GitHub Issues

## 🎉 You're All Set!

Vous pouvez maintenant:
- ✅ Développer localement
- ✅ Tester complètement
- ✅ Exposer publiquement via Ngrok
- ✅ Déployer en production
- ✅ Monitorer et faire du troubleshooting

**Bon développement! 🚀**

---

*Créé: 31/05/2026*
*Dernière mise à jour: 31/05/2026*
