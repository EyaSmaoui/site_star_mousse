# Déploiement — Chatbot Flask (Render) et Frontend (Vercel)

Résumé rapide : le microservice Flask (`backend/chatbot`) doit tourner sous `gunicorn` (Procfile inclus). Le frontend React est déployé sur Vercel et pointe vers l'API Render.

Render — Flask microservice

1. Créez un compte sur https://render.com et connectez votre dépôt GitHub.
2. New → Web Service → Connect GitHub → choisissez le repo `star-mousse`.
3. **Root Directory** : `backend/chatbot`
4. **Environment** : Python
5. **Build Command** : `pip install -r requirements.txt`
6. **Start Command** : laissé vide si vous utilisez `Procfile`, sinon : `gunicorn app:app --bind 0.0.0.0:$PORT`
7. Définissez les variables d'environnement (Render → Environment) d'après `.env.example` :

```
FLASK_APP=app.py
FLASK_ENV=production
SENTENCE_MODEL=all-MiniLM-L6-v2
SIMILARITY_THRESHOLD=0.75
PORT=5001
```

8. Créez le service → Render build et déploie automatiquement. Note : le modèle Hugging Face peut télécharger des poids au premier démarrage.

Vercel — Frontend React

1. Allez sur https://vercel.com → "Continue with GitHub" → sélectionnez le repo `star-mousse`.
2. Vercel détecte automatiquement React si le dossier `frontend` contient un `package.json`.
3. Dans les Settings du projet Vercel → Environment Variables, ajoutez :

```
REACT_APP_API_URL=https://<your-render-api-url>
```

4. Déployez → Vercel fournit l'URL publique du frontend.

Notes et conseils
- Si vous avez également un backend Node (ex: `backend/app.js`), créez un service Render séparé (Root Directory = `backend`).
- Pour une meilleure disponibilité en production, augmentez le nombre de workers `gunicorn` via `GUNICORN_CMD_ARGS` ou la configuration Render.
- Pensez à activer HTTPS/SSL dans Render (activé par défaut) et à configurer des sauvegardes pour MongoDB Atlas.

Troubleshooting rapide
- Logs : Render → service → Logs pour voir les erreurs de build ou runtime.
- Variables manquantes : vérifier que `PORT` et `SENTENCE_MODEL` sont définis.
