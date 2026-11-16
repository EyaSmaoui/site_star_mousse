# Deploiement du chatbot

Le chatbot est deploye comme service Docker Railway depuis le dossier
`backend/chatbot`. Railway utilise automatiquement `railway.json` et le
`Dockerfile` presents dans ce dossier.

Variables minimales :

```text
PORT=5001
WEB_CONCURRENCY=2
GUNICORN_THREADS=4
```

Le service est verifie par `GET /health`. Le frontend doit recevoir son URL
publique dans `VITE_CHATBOT_API_URL`.
