import re
import unicodedata
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dictionnaire complet : Soft Plus et Venise Plus sont bien dans la gamme orthopedique
PRIX_CATALOGUE = {
    "gamme_orthopedique": {
        "Soft Plus": {"90x190": 250, "120x190": 350, "140x190": 450, "160x190": 520, "160x200": 550, "180x200": 600},
        "Venise Plus": {"90x190": 300, "120x190": 450, "140x190": 600, "160x190": 420, "160x200": 750, "180x200": 935}
    },
    "gamme_orthomedical": {
        "Medico Plus": {"90x190": 420, "120x190": 650, "140x190": 950, "160x190": 1200, "160x200": 1530}
    },
    "gamme_ergonomique": {
        "Relax Plus": {"90x190": 510, "120x190": 750, "140x190": 1100, "160x190": 1500, "160x200": 1500, "180x200": 1850},
        "Tendresse Plus": {"90x190": 700, "120x190": 1100, "140x190": 1600, "160x190": 2100, "160x200": 2100, "180x200": 2555}
    }
}

user_sessions = {}

CATEGORY_KEYWORDS = {
    "gamme_orthomedical": ["medico", "orthomedical", "orthomedicale"],
    "gamme_orthopedique": ["orthopedique", "ortho", "soft", "venise", "dhar", "dos"],
    "gamme_ergonomique": ["relax", "tendresse", "ergonomique", "haut gamme", "haut de gamme", "premium", "luxe"],
}

BUDGET_KEYWORDS = ["aswem", "soum", "budget", "prix", "b9addech", "nheb 7aja r5isa", "merhbe", "kadech", "livraison", "paiement", "garantie", "m5adda", "commande", "t5alsou"]

GREETING_KEYWORDS = ["bonjour", "aslema", "salam", "salem", "hi", "hello"]

PURCHASE_KEYWORDS = ["nechri", "jraya", "tharira", "matela", "rahma"]

DEFAULT_DIMENSION = "160x190"


def normalize_text(text: str) -> str:
    text = unicodedata.normalize("NFD", text.lower())
    text = re.sub(r"[\u0300-\u036f]", "", text)
    text = re.sub(r"[^a-z0-9\s\-xX*/]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def extraire_dimension(texte: str):
    match = re.search(r"(\d{2,3})\s*[xX*/\s-]\s*(\d{2,3})", texte)
    if match:
        d1, d2 = match.group(1), match.group(2)
        if int(d1) > int(d2):
            d1, d2 = d2, d1
        return f"{d1}x{d2}"
    return None


def detect_category(text: str):
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return category
    return None


def detect_budget(text: str):
    return any(keyword in text for keyword in BUDGET_KEYWORDS)


def detect_greeting(text: str):
    return any(keyword in text for keyword in GREETING_KEYWORDS)


def detect_purchase_intent(text: str):
    return any(keyword in text for keyword in PURCHASE_KEYWORDS)


def build_response(category_tag: str, dimension: str):
    product_map = PRIX_CATALOGUE.get(category_tag)
    if not product_map:
        return None

    category_label = category_tag.replace("_", " ").replace("gamme ", "").strip()
    lines = [f"Pour le {dimension} ({category_label}), voici nos modèles :"]
    for product_name, prices in product_map.items():
        price = prices.get(dimension, "Sur demande")
        lines.append(f"• {product_name} : {price} DT")
    return "\n".join(lines)


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    raw_message = data.get("message", "")
    user_id = data.get("userId", "default_user")

    normalized_input = normalize_text(raw_message)
    
    # Check for greeting first
    if detect_greeting(normalized_input):
        return jsonify({
            "response": "Aslema, ena Dali mte3 Star Mousse. 9olli chnowa 7achtek w n3awnk direct.",
            "intent": "greeting"
        })
    
    # Check for purchase intent
    if detect_purchase_intent(normalized_input):
        return jsonify({
            "response": "Mrigel, t7eb nechri jraya. 9olli juste l 9yes, budgetek, w ken t7ebha ferme wala rtwiba bech n9arblek choix behi.",
            "intent": "purchase_intent"
        })
    
    # Check for budget/price questions
    if detect_budget(normalized_input):
        return jsonify({
            "response": "Sam7ni, ma fhimtech mrigel. 9olli t7eb ta7ki 3la soum, livraison, paiement, garantie, dhar, m5adda wala commande ?",
            "intent": "budget"
        })
    
    dimension = extraire_dimension(normalized_input)
    category_tag = detect_category(normalized_input)

    if dimension and category_tag:
        user_sessions[user_id] = dimension
        response_text = build_response(category_tag, dimension)
        return jsonify({"response": response_text, "intent": category_tag})

    if dimension:
        user_sessions[user_id] = dimension
        return jsonify({
            "response": f"9yes {dimension} mrigel ! Chnowa t7eb l gamme : Orthopédique, Orthomedical, wala Ergonomique ?",
            "intent": "dimension_captured"
        })

    dimension = user_sessions.get(user_id, "160x190")

    if category_tag:
        response_text = build_response(category_tag, dimension)
        return jsonify({"response": response_text, "intent": category_tag})

    return jsonify({"response": "T7eb Orthopédique, Orthomedical wala Ergonomique ?", "intent": "fallback"})
if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True, use_reloader=False)