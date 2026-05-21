import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

app = Flask(__name__)
CORS(app)

print("🧠 Chargement de BERT Multilingual Sentiment (Section 5.3.3)...")
model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
classifier = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

def nettoyer_texte(texte):
    """Fonction de nettoyage officielle de la section 5.3.2"""
    if not texte or not isinstance(texte, str):
        return ""
    texte = texte.lower()
    texte = re.sub(r"[^\w\ssàâçéèêëîïôûùüÿñæœ]", " ", texte)
    texte = re.sub(r"\s+", " ", texte).strip()
    return texte

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json() or {}
        commentaire = data.get("commentaire", "")
        
        commentaire_nettoye = nettoyer_texte(commentaire)
        if not commentaire_nettoye:
            return jsonify({"note": 3, "score": 0.5}), 200
            
        # Pipeline Transformers (Section 5.3.4)
        resultat = classifier(commentaire_nettoye)[0]
        label_etoiles = resultat['label']  # Ex: "5 stars"
        note_calculee = int(label_etoiles.split()[0])  # Extraction de l'entier
        
        return jsonify({
            "note": note_calculee,
            "score": round(float(resultat['score']), 3)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Tourne sur le port 5002
    app.run(port=5002, debug=True)