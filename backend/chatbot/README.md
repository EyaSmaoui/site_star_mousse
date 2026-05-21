# Chatbot microservice (Flask)

This folder contains a minimal Flask microservice that provides a `/chat` endpoint for the frontend.

Features:
- Loads `intents.json` (patterns + responses).
- Uses `sentence-transformers` `all-MiniLM-L6-v2` to encode user queries and patterns.
- Matches intent by cosine similarity (threshold configurable via `SIMILARITY_THRESHOLD`).
- Returns a JSON response with `response`, `intent`, `score`, and optional `recommendations`.

Quick start (Linux / macOS / WSL / PowerShell):

```bash
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
export FLASK_APP=app.py
export FLASK_ENV=development
export SENTENCE_MODEL=all-MiniLM-L6-v2
export SIMILARITY_THRESHOLD=0.75
python app.py
```

To expose locally for frontend testing, use `ngrok`:

```bash
# install ngrok and run
ngrok http 5005
# then use the generated public URL in the frontend API calls
```

Notes:
- The first run may download model weights (a few MB). Use a machine with CPU support.
- For production, consider running behind a WSGI server (gunicorn) and caching pattern embeddings.
