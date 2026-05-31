# 🚀 Guide de Configuration - Star Mousse

## ⚠️ PROBLÈME IDENTIFIÉ: MongoDB non accessible

Le serveur essaie de se connecter à MongoDB sur `127.0.0.1:27017` mais la connexion est refusée.

### Solutions

#### Option 1️⃣: Utiliser MongoDB Atlas (Cloud) - 🟢 RECOMMANDÉ
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Trouvez votre connection string
4. Modifiez `.env`:
```env
url_Mongodb=mongodb+srv://username:password@cluster.mongodb.net/site_star_mousse?retryWrites=true&w=majority
```

#### Option 2️⃣: MongoDB Local
1. Installez MongoDB Community Edition
2. Démarrez le service MongoDB
   - **Windows**: `mongod` ou `Start-Service MongoDB`
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Vérifiez que ça écoute sur `127.0.0.1:27017`

#### Option 3️⃣: Docker (Rapide & Facile)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 🔧 Configuration des Ports

**ATTENTION**: Deux versions de port existent!

### Actuellement:
- `.env` dit: `PORT=5000`
- `app.js` dit: `PORT = process.env.PORT || 3000`
- Frontend attend: `REACT_APP_API_URL=http://localhost:5000/api`

### À corriger:
Choisissez **UNE** des deux options:

#### Option A: Utiliser port 3000 (plus courant)
Modifier `.env`:
```env
PORT=3000
REACT_APP_API_URL=http://localhost:3000/api
```

#### Option B: Garder port 5000
Garder config actuelle - mais vérifier que port 5000 n'est pas utilisé

---

## 📋 Checklist de Configuration

- [ ] MongoDB accessible (local ou Atlas)
- [ ] `.env` configuré correctement
- [ ] `PORT` cohérent entre `.env` et frontend
- [ ] `NODE_ENV` = `development` en dev
- [ ] `JWT_SECRET` défini (peut être "testsecret" en dev)
- [ ] `CORS_ORIGINS` inclut l'URL frontend
- [ ] Frontend build prêt (si production)

---

## 🚀 Démarrage

Une fois MongoDB configuré:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (dans autre terminal)
cd frontend
npm install
npm start
```

---

**État**: ⏸️ En attente de configuration MongoDB
