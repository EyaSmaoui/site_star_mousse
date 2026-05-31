# 🛋️ Star Mousse - E-Commerce Application

Plateforme e-commerce complète pour vente de matelas et oreillers avec authentification multi-rôles, gestion de commandes et recommandations intelligentes.

## 🎯 Status de l'Application

**Complétude Générale**: 🟢 95%
- Backend: ✅ 100% (Routes + Controllers + Models)
- Frontend: ✅ 95% (Pages + Components)
- Database: 🔴 À configurer (MongoDB)
- Testing: 🟡 En cours
- Production: ⏳ En préparation

---

## 🚀 Quick Start

### 1️⃣ Prérequis
- Node.js >= 18
- MongoDB (local ou [Atlas](https://www.mongodb.com/cloud/atlas))
- npm ou yarn

### 2️⃣ Configuration MongoDB

Choisir **UNE** option:

#### Option A: MongoDB Local
```bash
# Windows
mongod

# Or if installed as service:
net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud - RECOMMANDÉ)
1. Créer compte: https://www.mongodb.com/cloud/atlas
2. Créer cluster gratuit
3. Copier connection string
4. Modifier `.env`:
```env
url_Mongodb=mongodb+srv://username:password@cluster.mongodb.net/site_star_mousse?retryWrites=true&w=majority
```

#### Option C: Docker (Rapide)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3️⃣ Installation

```bash
# Installation complète
npm install --prefix backend
npm install --prefix frontend

# Ou
npm run install:all
```

### 4️⃣ Développement

**Terminal 1 - Backend:**
```bash
npm run dev
# Serveur: http://localhost:3000
# API: http://localhost:3000/api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App: http://localhost:3000
```

### 5️⃣ Tests

```bash
# Test les endpoints API
node backend/scripts/comprehensive_api_test.js

# Ou créer admin manuellement
npm run insert-admin
```

---

## 📁 Structure du Projet

```
site_star_mousse/
├── backend/
│   ├── app.js                 # Entry point Express
│   ├── config/
│   │   └── mongo.connection.js # Config MongoDB
│   ├── controllers/           # CRUD logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth, uploads
│   ├── services/             # Business logic
│   ├── scripts/              # Utilitaires
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js           # Main app
│   │   ├── pages/           # Page components
│   │   │   ├── Admin/       # Admin dashboard
│   │   │   ├── Client/      # Client dashboard
│   │   │   ├── Employee/    # Employee dashboard
│   │   │   ├── Auth/        # Login/Register
│   │   │   ├── Store/       # Products/Promos
│   │   │   └── ...
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API calls
│   │   ├── utils/           # Helpers
│   │   └── styles/          # CSS/Tailwind
│   └── package.json
│
├── .env                      # Configuration
├── package.json             # Root scripts
├── README.md               # This file
├── SETUP_GUIDE.md          # Setup details
└── ...
```

---

## 📦 Entités & CRUD

### Products
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products/filter?size=M&minPrice=50&maxPrice=500`
- `GET /api/products/search?name=Relaxe`
- `POST /api/products/add` - Créer (Admin)
- `PUT /api/products/update/:id` - Modifier (Admin)
- `DELETE /api/products/delete/:id` - Supprimer (Admin)

### Orders
- `GET /api/orders/my-orders` - Mes commandes
- `GET /api/orders/getAllOrders` - Toutes (Admin/Manager)
- `POST /api/orders/addOrder` - Créer commande
- `PUT /api/orders/updateOrder/:id` - Modifier statut
- `DELETE /api/orders/deleteOrder/:id` - Supprimer

### Users & Auth
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/profile` - Mon profil
- `PUT /api/users/update-profile` - Modifier profil
- `POST /api/users/forgot-password` - Réinitialiser mot de passe
- `POST /api/users/reset-password/:token` - Nouveau mot de passe

### Clients
- `GET /api/clients/getAllClients` - Liste clients (Admin)
- `POST /api/clients/addClient` - Ajouter client (Admin)
- `PUT /api/clients/updateClient/:id` - Modifier client (Admin)
- `DELETE /api/clients/deleteClient/:id` - Supprimer client (Admin)

### Categories
- `GET /api/categories/getAllCategories` - Liste catégories
- `GET /api/categories/:id` - Détails catégorie
- `POST /api/categories/addCategory` - Ajouter (Admin)
- `PUT /api/categories/updateCategory/:id` - Modifier (Admin)
- `DELETE /api/categories/deleteCategory/:id` - Supprimer (Admin)

### Cart (Panier)
- `GET /api/paniers/:id` - Voir panier
- `POST /api/paniers/addCart` - Créer panier
- `POST /api/paniers/addProduct/:id` - Ajouter produit
- `DELETE /api/paniers/removeProduct/:id` - Retirer produit
- `PUT /api/paniers/updateCart/:id` - Modifier panier
- `DELETE /api/paniers/deleteCart/:id` - Vider panier

### Reviews
- `GET /api/reviews/getAllReviews` - Tous les avis
- `GET /api/reviews/my-reviews` - Mes avis
- `GET /api/reviews/product/:productId` - Avis d'un produit
- `POST /api/reviews/addReview` - Laisser avis
- `PUT /api/reviews/updateReview/:id` - Modifier avis
- `DELETE /api/reviews/deleteReview/:id` - Supprimer avis

### Managers
- `GET /api/managers/getAllManagers` - Liste managers (Admin)
- `POST /api/managers/addManager` - Ajouter manager (Admin)
- `PUT /api/managers/updateManager/:id` - Modifier manager (Admin)
- `DELETE /api/managers/deleteManager/:id` - Supprimer manager (Admin)

---

## 🔐 Rôles & Permissions

| Rôle | Accès |
|------|-------|
| **Admin** | Accès complet (users, produits, commandes, stocks, managers) |
| **Manager** | Gestion stocks, employés, commandes, clients |
| **Client** | Achats, avis, recommandations, profil |
| **Employé** | Traitement commandes, gestion stocks |

---

## 📱 Pages & Interfaces

### Public
- 🏠 Home (Hero + Produits recommandés)
- 🛍️ Store (Catalogue avec filtres)
- 📢 Promos (Section promotions)
- ℹ️ About (À propos)
- ❓ Help (FAQ)
- 🤖 Chatbot (Disponible partout)

### Client
- 📊 Dashboard (Accueil, stats)
- 📦 Mes Commandes (Historique)
- ⭐ Mes Avis (Reviews laissés)
- 💡 Recommandations (Produits suggérés)

### Admin
- 📊 Dashboard (Vue d'ensemble)
- 👥 Gérer Clients (CRUD)
- 👔 Gérer Managers (CRUD)
- 📦 Gérer Stocks (Édition)
- 📋 Voir Commandes (Toutes)
- ➕ Créer Employé

### Employee
- 📦 Commandes à traiter
- 📊 Gestion Stocks
- 👤 Profil

---

## 🧪 Testing

### Créer un admin de test
```bash
npm run insert-admin
# Email: admin@starmousse.tn
# Password: Admin1234
```

### Créer des managers de test
```bash
npm run insert-manager-yassine
npm run insert-manager-nadia
```

### Tester les API
```bash
node backend/scripts/comprehensive_api_test.js
```

### Vérifier connexion
```bash
npm run test-login-clients
```

---

## ⚙️ Configuration

### .env
```env
# Backend
PORT=3000
NODE_ENV=development
url_Mongodb=mongodb://127.0.0.1:27017/site_star_mousse
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Frontend
REACT_APP_API_URL=http://localhost:3000/api
```

---

## 🛠️ Build & Production

### Build Frontend
```bash
npm run build --prefix frontend
# Crée dossier: frontend/build
```

### Déployer
Voir `SETUP_GUIDE.md` pour options hébergement:
- Vercel (Frontend)
- Render/Railway (Backend)
- Heroku (Backend)
- MongoDB Atlas (Database)

---

## 📊 Diagnostic

```bash
# Vérifier configuration
.\setup.bat  # Windows
./setup.sh   # Mac/Linux

# Ou manuellement:
node --version        # >= 18
npm --version        # >= 8
mongod --version     # Si local
```

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to MongoDB"
→ Voir SETUP_GUIDE.md - Section MongoDB

### ❌ "Port 3000 already in use"
```bash
# Trouver processus
netstat -ano | findstr :3000

# Changer PORT dans .env
PORT=3001
```

### ❌ "CORS error"
→ Vérifier `CORS_ORIGINS` dans `.env` inclut frontend URL

### ❌ "Token expired"
→ Normal - Relogin ou augmenter `JWT_EXPIRATION`

---

## 📚 Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Configuration détaillée
- [AUDIT_REPORT.md](AUDIT_REPORT.md) - Audit technique
- [COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md) - Checklist de complétude
- [FINAL_AUDIT_REPORT.md](FINAL_AUDIT_REPORT.md) - Rapport final

---

## 🎯 Prochaines Étapes

1. ✅ Configuration MongoDB
2. ✅ `npm run dev` + Frontend
3. ⏳ Tester workflows
4. ⏳ Bug fixes & optimisations
5. ⏳ Build production
6. ⏳ Deployment

---

## 📞 Support

- Check `.env` configuration
- Review server logs
- Consult documentation files
- Check browser console for frontend errors

---

**Application**: Star Mousse  
**Version**: 1.0.0  
**Created**: 28/05/2026  
**Status**: 🟢 Ready for configuration & testing

