## 🧪 GUIDE DE TEST COMPLET

### 📋 Avant de tester

```bash
# 1. S'assurer que les dépendances sont installées
cd backend
npm install

cd ../frontend
npm install

# 2. Vérifier le build
npm run build

# 3. Démarrer les services
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm start

# Attendre que les deux démarrent (5-10 min)
```

---

### 🚀 TESTS MANUELS - MOBILE (30 min)

#### 1. Test Scroll Mobile ✅
**Equipement**: iPhone SE (375px) ou Android équivalent

```
1. Ouvrir l'app sur http://localhost:3000
2. Cliquer sur le bouton Chatbot en bas
3. Tenter de scroller la page vers le haut
4. ✅ SUCCÈS: La page scroll même avec chatbot ouvert
5. ❌ FAIL: La page ne scroll pas
```

#### 2. Test Sidebar Navigation ✅
```
1. Aller sur /dashboard (si auth existe)
2. Chercher la navigation en haut (sidebar horizontal)
3. Scroller horizontalement la barre de navigation
4. ✅ SUCCÈS: Tous les buttons visibles
5. ❌ FAIL: Buttons cachées au bottom
```

#### 3. Test Responsive Design ✅
```
1. Tester sur 3 tailles:
   - iPhone SE (375px)
   - iPhone 12 (390px)
   - Samsung S8 (360px)

2. Vérifier:
   - ✅ Tous les buttons accessibles
   - ✅ Pas de horizontal scroll
   - ✅ Text lisible
   - ✅ Images chargent
```

---

### 🔒 TESTS E2E CYPRESS (1-2 heures)

#### Setup
```bash
cd frontend
npm install cypress --save-dev
npm run cypress:run
```

#### Tests fournis
```
✅ 01_mobile_scroll.cy.js - Tests scroll mobile
✅ 02_security.cy.js - Tests sécurité
✅ 03_functionality.cy.js - Tests fonctionnels
```

#### Commandes
```bash
# Run tous les tests
npm run cypress:run

# Mode interactif (recommandé)
npm run cypress:open

# Specific test file
npx cypress run --spec "cypress/e2e/01_mobile_scroll.cy.js"
```

#### Résultats attendus
```
01_mobile_scroll.cy.js
  ✓ Should allow scrolling when chatbot is open on mobile
  
02_security.cy.js
  ✓ Should reject invalid email on registration
  ✓ Should reject invalid phone number
  ✓ Should have rate limiting on login attempts
  ✓ Should not expose debug endpoints
  ✓ Should not expose password endpoints

03_functionality.cy.js
  ✓ Should load homepage without errors
  ✓ Should search for products
  ✓ Should add product to cart
  ✓ Should filter products by category
  ✓ Should load products without errors
  ✓ Should open chatbot and send message

Total: 12+ tests (tous verts ✅)
```

---

### 📊 TESTS API (30 min)

#### Test endpoints avec Postman/curl

**1. Health check**
```bash
curl http://localhost:5000/api/health
# Résultat: { ok: true, db: "connected" }
```

**2. Validations actives**
```bash
# Test: Email invalide rejetée
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"123","phone":"456"}'
# Résultat: 400 (validation error)

# Test: Phone invalide rejetée
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123","phone":"abc"}'
# Résultat: 400 (validation error)
```

**3. Rate limiting**
```bash
# Boucler 6 login attempts rapides
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo ""
done
# Résultat: Au-delà de 5, erreur 429 (Too Many Requests)
```

**4. Security endpoints**
```bash
# Debug endpoint devrait être supprimé
curl http://localhost:5000/api/users/debug-auth
# Résultat: 404 ou 401

# getAllUsersWithPassword devrait être supprimé
curl http://localhost:5000/api/admin/getAllUsersWithPassword
# Résultat: 404 ou 401
```

**5. 404 Handling**
```bash
# Chercher category inexistante
curl http://localhost:5000/api/categories/invalid-id
# Résultat: 404 (not found)
```

---

### ⚡ TESTS PERFORMANCE (30 min)

#### Load Testing avec Artillery

```bash
# Installation
npm install -g artillery

# Test load basic
artillery quick --count 100 --num 10 http://localhost:3000

# Test API
artillery run artillery-load.yml
```

#### Résultats attendus
```
✅ Homepage: < 1 second
✅ API /products: < 500ms
✅ API /categories: < 300ms
✅ 100 concurrent users: < 2% errors
```

---

### 📝 CHECKLIST FINAL

```
BEFORE DEPLOYMENT:

Mobile Tests:
[ ] ✅ Scroll chatbot fonctionne (30 min)
[ ] ✅ Navigation sidebar accessible (10 min)
[ ] ✅ Responsive 3 devices (20 min)

E2E Tests:
[ ] ✅ Run Cypress full suite (30 min)
[ ] ✅ All 12 tests passing (green ✅)

API Tests:
[ ] ✅ Validations actives (5 min)
[ ] ✅ Rate limiting working (5 min)
[ ] ✅ Debug endpoints supprimés (5 min)
[ ] ✅ 404 handling correct (5 min)

Performance:
[ ] ✅ Homepage < 1s (5 min)
[ ] ✅ API responses < 500ms (5 min)

TOTAL TIME: 2-3 heures

STATUS: ✅ OK FOR PRODUCTION
```

---

### 🚀 DEPLOYMENT

Une fois tous les tests passants:

```bash
# 1. Build final
npm run build

# 2. Push vers production
git add .
git commit -m "Pre-deployment audit fixes - all tests passing"
git push origin main

# 3. Deploy sur Vercel
vercel deploy --prod

# 4. Monitor
# Vérifier: https://site-star-mousse.vercel.app
```

---

**Durée estimée totale: 2-3 heures ⏱️**

Si tous les tests passent ✅ → **READY FOR PRODUCTION** 🚀
