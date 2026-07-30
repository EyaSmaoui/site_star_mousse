# 🚀 QUICK START - BOUTIQUE IA STAR MOUSSE

## ⏱️ 5 minutes pour activer l'IA!

### ÉTAPE 1: Obtenir clé OpenAI (2 min)

1. Aller à: https://platform.openai.com
2. Sign up (ou login)
3. Aller à: API keys → Create new secret key
4. Copier la clé: `sk_test_XXXX...`

### ÉTAPE 2: Configurer .env (1 min)

```bash
cd backend

# Copier le template
cp .env.ai .env

# Éditer avec votre clé
nano .env

# Ajouter:
OPENAI_API_KEY=sk_test_VOTRE_CLE
USE_LOCAL_AI=false
```

### ÉTAPE 3: Installer & Lancer (2 min)

```bash
# Retour à la racine
cd ..

# Installer toutes les dépendances
npm run install:all

# Lancer tout
npm run dev:all
```

### ✅ C'EST FINI!

**Accès**:
- 🌐 Frontend: http://localhost:5173
- 💬 Chatbot: Bouton coin bas-droit
- 🔍 Recherche IA: http://localhost:5173/ai-search
- 📊 Recommandations: http://localhost:5173/recommendations/test-user

---

## 🎯 TESTER LES FEATURES

### 1. Chatbot IA 💬
```
Cliquer le bouton robot en bas à droite
Écrire: "Quelle matelas pour mal de dos?"
Réponse: Assistant IA répond en français
```

### 2. Recherche Intelligente 🔍
```
Aller à: http://localhost:5173/ai-search
Écrire: "matelas ferme confortable pas trop cher"
Résultat: Produits filtrés par pertinence!
```

### 3. Recommandations 👥
```
Aller à: http://localhost:5173/recommendations/anyuser
Résultat: Top 6 produits recommandés
```

---

## 📊 VOIR LES LOGS

```bash
# Backend: voir requêtes IA
tail -f logs/combined.log | grep "AI\|ai"

# Vérifier OpenAI status
curl -H "Authorization: Bearer sk_test_..." \
  https://api.openai.com/v1/models
```

---

## 💰 PRIX OPENAI

**Gratuit** jusqu'à $5 en free credits.

**Après** (~1000 users):
- Recherche (embeddings): $0.02/1000 requêtes
- Chatbot (chat): $0.50/1M tokens
- Recommandations: $1-2/1000 users

**Estimé**: $10-20/mois pour boutique modérée

---

## ⚡ MODE LOCAL (GRATUIT)

Si vous voulez tester sans coûts:

```bash
# 1. Installer Ollama
# https://ollama.ai

# 2. Terminal 1: Lancer Ollama
ollama serve

# 3. Terminal 2: Télécharger modèles
ollama pull nomic-embed-text
ollama pull llama2

# 4. Configurer .env
USE_LOCAL_AI=true
LOCAL_AI_URL=http://localhost:11434

# 5. Relancer backend
npm run dev
```

**Avantages**: Gratuit, illimité
**Inconvénients**: Plus lent, ressources CPU

---

## 🆘 SI ÇA NE MARCHE PAS

### Erreur: "OPENAI_API_KEY not set"
```bash
# Vérifier .env
cat backend/.env | grep OPENAI

# Doit être non-vide
OPENAI_API_KEY=sk_test_...
```

### Erreur: "API rate limit"
```
Normal! OpenAI limite les appels.
Attendre 1 minute et réessayer.
```

### Erreur: "Cannot connect to Ollama"
```bash
# Vérifier que Ollama tourne
ollama serve

# Vérifier que modèles sont installés
ollama list
```

---

## 📱 STRUCTURE URLS

```
Home                    http://localhost:5173/
Shop                    http://localhost:5173/shop
Cart                    http://localhost:5173/cart
Checkout                http://localhost:5173/checkout
AI Search               http://localhost:5173/ai-search
Recommendations         http://localhost:5173/recommendations/USER_ID
Admin Dashboard         http://localhost:5173/admin/analytics
Chatbot                 Flottant sur toutes les pages (coin bas-droit)
```

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails:
- 📖 `AI_SETUP_GUIDE.md` - Setup complet
- 📊 `AI_ECOMMERCE_SUMMARY.md` - Résumé features
- 📋 `ECOMMERCE_UPDATE.md` - Phase 1 recap

---

## 🎊 SUCCESS!

Votre boutique Star Mousse est maintenant:
- ✅ E-Commerce moderne
- ✅ Alimentée par l'IA
- ✅ Prête à vendre
- ✅ Optimisée pour revenus

**Commencez à générer des ventes! 🚀**
