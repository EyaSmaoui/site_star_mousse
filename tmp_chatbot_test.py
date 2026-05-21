import sys
import os
import json

# Trouve le chemin absolu du projet automatiquement
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHATBOT_PATH = os.path.join(BASE_DIR, 'backend', 'chatbot')

# Ajoute les répertoires au chemin de recherche de Python
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, CHATBOT_PATH)

print(f"[Debug] Recherche du chatbot dans : {CHATBOT_PATH}")

try:
    # Importation directe depuis le dossier chatbot
    import app
    from app import app as flask_app
except ImportError as e:
    print(f"\n❌ Erreur d'importation : {e}")
    print("Vérifie que le dossier 'backend/chatbot' contient bien un fichier nommé 'app.py'.")
    sys.exit(1)

with flask_app.test_client() as client:
    # Parcours utilisateur complet
    tests = ['soum', 'Nheb nechri jraya', '190*160', 'orthopedique']
    USER_ID_SIMULATION = "test_session_jury"

    print("\n" + "="*50)
    print("=== DÉBUT DU TEST DU MICROSERVICE FLASK ===")
    print("="*50)
    
    for t in tests:
        r = client.post('/chat', json={
            'message': t,
            'userId': USER_ID_SIMULATION
        })
        
        print(f"\n➡️ MSG envoyé : '{t}'")
        print(f"Status HTTP  : {r.status_code}")
        
        try:
            print("Réponse JSON :")
            print(json.dumps(r.get_json(), ensure_ascii=False, indent=2))
        except Exception:
            print(f"Réponse brute : {r.data.decode('utf-8')}")
            
        print("─" * 40)

    print("\n=== FIN DU TEST ===")