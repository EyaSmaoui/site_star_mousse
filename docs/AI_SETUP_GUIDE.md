# 🤖 GUIDE D'INSTALLATION - BOUTIQUE IA STAR MOUSSE

## 📋 Table des Matières

1. [Installation Backend](#installation-backend)
2. [Configuration IA](#configuration-ia)
3. [Installation Frontend](#installation-frontend)
4. [Lancement](#lancement)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Installation Backend

### 1. Installer les dépendances IA

```bash
cd backend

# Les dépendances nécessaires sont déjà dans package.json:
# - axios (pour API calls)
# - dotenv (pour variables d'environnement)
npm install

# (Optionnel) Si besoin de recharts pour analytics frontend:
npm install recharts --prefix ../frontend
```

### 2. Configurer les variables d'environnement

```bash
# Copier le template
cp .env.ai .env

# Éditer .env avec vos clés:
nano .env
```

---

## 🤖 Configuration IA

### Option 1: OpenAI API (Recommandé - Production)

#### 1️⃣ Créer compte OpenAI
- Visitez: https://platform.openai.com
- Créez un compte
- Allez à: API keys → Create new secret key
- Copiez la clé

#### 2️⃣ Configurer .env
```bash
OPENAI_API_KEY=sk_test_XXXXXXXXXXXXX
USE_LOCAL_AI=false
```

#### 3️⃣ Tarification OpenAI (estimée)
- **Embeddings**: $0.02 par 1M tokens
- **GPT-3.5-turbo**: $0.50 per 1M input + $1.50 per 1M output
- **Recommandation**: ~$0.01-0.05 par requête utilisateur

#### 4️⃣ Limiter les coûts
```javascript
// Dans aiService.js, réduire les appels:
// - Cache les embeddings générés
// - Limiter la fréquence des recommandations
// - Utiliser les fallbacks locaux
```

---

### Option 2: Local AI avec Ollama (Gratuit - Dev)

#### 1️⃣ Installer Ollama
- Visitez: https://ollama.ai
- Téléchargez et installez pour votre OS
- Lancez Ollama

#### 2️⃣ Télécharger les modèles
```bash
# Terminal 1: Lancer Ollama
ollama serve

# Terminal 2: Télécharger modèles
ollama pull nomic-embed-text      # 274MB - embeddings
ollama pull llama2                # 3.8GB - chatbot/recommandations
# Optionnel: ollama pull neural-chat (plus rapide)
```

#### 3️⃣ Configurer .env
```bash
USE_LOCAL_AI=true
LOCAL_AI_URL=http://localhost:11434
```

#### 4️⃣ Vérifier que Ollama tourne
```bash
curl http://localhost:11434/api/tags
# Devrait retourner les modèles disponibles
```

---

### Option 3: Combinaison (Recommandé - Production)

Utiliser **OpenAI pour production**, **Local pour dev**:

```bash
# .env
OPENAI_API_KEY=sk_test_...
USE_LOCAL_AI=false
LOCAL_AI_URL=http://localhost:11434

# Lors du développement local, activer Ollama:
USE_LOCAL_AI=true
```

---

## 💻 Installation Frontend

### 1. Installer dépendances frontend
```bash
cd frontend

npm install

# Dépendances supplémentaires pour analytics:
npm install recharts  # Déjà dans package.json
```

### 2. Vérifier que les composants sont importés

Dans `frontend/src/App.jsx`, ajouter:

```jsx
import ChatbotWidget from './components/ChatbotWidget';
import AISearchPage from './pages/AISearchPage';
import RecommendationsPage from './pages/RecommendationsPage';
import AIAnalyticsDashboard from './pages/AIAnalyticsDashboard';

export default function App() {
  return (
    <div>
      {/* ... routes ... */}
      <ChatbotWidget /> {/* Flottant sur toutes les pages */}
      
      {/* Routes */}
      <Routes>
        <Route path="/ai-search" element={<AISearchPage />} />
        <Route path="/recommendations/:userId" element={<RecommendationsPage />} />
        <Route path="/admin/analytics" element={<AIAnalyticsDashboard />} />
      </Routes>
    </div>
  );
}
```

---

## 🚀 Lancement

### Mode Développement avec Ollama local

```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

Accès:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Chatbot: Bouton flottant en bas à droite

### Mode Production avec OpenAI

```bash
# Configurer .env
OPENAI_API_KEY=sk_test_...
USE_LOCAL_AI=false
NODE_ENV=production

# Lancer
npm run build
npm run start
```

---

## 🔌 Endpoints IA Disponibles

### 1. Recommandations
```
GET /api/ai/recommendations/:userId?count=5
Retourne: Produits recommandés pour l'utilisateur
```

### 2. Recherche Sémantique
```
POST /api/ai/search
Body: { query: "matelas confortable" }
Retourne: Produits triés par pertinence (0-1)
```

### 3. Chatbot
```
POST /api/ai/chatbot
Body: { message: "Quelle matelas pour dormir?" }
Retourne: Réponse de l'assistant IA
```

### 4. Analyse Avis
```
POST /api/ai/analyze-review
Body: { reviewText: "Excellent produit!" }
Retourne: { sentiment: "positive", score: 0.95, keywords: [...] }
```

### 5. Produits Similaires
```
GET /api/ai/product-recommendations/:productId
Retourne: Produits similaires (basé embeddings)
```

### 6. Pricing Dynamique
```
GET /api/ai/dynamic-price/:productId
Retourne: Prix ajusté selon demande + stock
```

### 7. Prédiction Stock
```
GET /api/ai/stock-prediction/:productId?days=30
Retourne: Recommandation de restock
```

---

## ⚙️ Configuration Avancée

### Caching des Embeddings (économiser coûts)

```javascript
// backend/services/embeddingCache.js
const cache = new Map();

async function getEmbeddingWithCache(text) {
  const cacheKey = hashText(text);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const embedding = await aiService.generateEmbedding(text);
  cache.set(cacheKey, embedding);
  return embedding;
}
```

### Rate Limiting (protéger l'API)

```javascript
// Dans app.js
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes
});

app.use('/api/ai', aiLimiter);
```

---

## 🛠️ Troubleshooting

### Erreur: "OPENAI_API_KEY not configured"
**Solution**: Ajouter `OPENAI_API_KEY=sk_...` dans `.env`

### Erreur: "Cannot connect to Ollama"
**Solution**: 
```bash
# Vérifier que Ollama tourne
curl http://localhost:11434/api/tags

# Si ne marche pas, relancer:
ollama serve
```

### Embeddings lents
**Solution**: 
```bash
# Utiliser un modèle plus petit
# Dans aiService.js:
model: 'all-minilm'  // Plus rapide que nomic-embed-text
```

### Chatbot répond lentement
**Solution**:
```bash
# Réduire max_tokens dans aiService.js
max_tokens: 150  # Au lieu de 500
```

### Erreur: "Model not found"
**Solution**:
```bash
# Télécharger les modèles manquants
ollama pull llama2
ollama pull nomic-embed-text
```

---

## 📈 Monitoring & Logs

### Voir les logs de l'IA
```bash
# Backend
tail -f logs/error.log | grep AI

# Vérifier l'utilisation OpenAI
# https://platform.openai.com/account/billing/overview
```

---

## 💰 Estimation des Coûts

| Service | Usage | Coût/mois |
|---------|-------|----------|
| **OpenAI Embeddings** | 10k/jour | $6 |
| **OpenAI Chat** | 1k/jour | $10 |
| **Ollama** | Illimité | $0 |
| **Stripe** (paiements) | 2% | Var |
| **Hébergement** (Render) | 1 app | $7/mois |

**Total estimé**: $13-30/mois avec OpenAI

---

## ✅ Checklist Démarrage

- [ ] Backend installé (`npm install`)
- [ ] Variables d'env configurées (`.env`)
- [ ] OpenAI API key OR Ollama lancé
- [ ] Frontend installé
- [ ] Routes IA ajoutées dans `app.js`
- [ ] Composants IA importés dans `App.jsx`
- [ ] Backend lancé (`npm run dev`)
- [ ] Frontend lancé (`npm run dev`)
- [ ] Chatbot visible sur http://localhost:5173
- [ ] Recherche IA fonctionnelle
- [ ] Recommandations chargent

---

## 🎯 Prochaines Étapes

1. **Entraîner modèle custom** avec historique Star Mousse
2. **Ajouter webhooks** Stripe pour paiements
3. **Implémenter notifications** email/SMS
4. **Analytics avancées** avec Matomo
5. **Multi-langue** (AR, EN)

---

## 📞 Support

- Documentation: https://openai.com/docs/
- Ollama Discord: https://ollama.ai/discord
- Issues GitHub: [Créer issue]

Bonne chance ! 🚀
