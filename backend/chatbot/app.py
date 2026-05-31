import re
import unicodedata
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dictionnaire complet : prix par dimension, standardises en petit x grand.
PRIX_CATALOGUE = {
    "gamme_orthopedique": {
        "Soft Plus": {"80x190": 255, "90x190": 285, "120x190": 385, "140x190": 395, "160x190": 445, "160x200": 505, "180x200": 605},
        "Venise Plus": {"80x190": 305, "90x190": 335, "120x190": 445, "140x190": 465, "160x190": 525, "160x200": 595, "180x200": 705}
    },
    "gamme_orthomedical": {
        "Medico Plus": {"80x190": 425, "90x190": 475, "120x190": 675, "140x190": 695, "160x190": 805, "160x200": 880, "180x200": 1055}
    },
    "gamme_ergonomique": {
        "Relax Plus": {"80x190": 515, "90x190": 575, "120x190": 810, "140x190": 835, "160x190": 965, "160x200": 1105, "180x200": 1305},
        "Tendresse Plus": {"80x190": 705, "90x190": 775, "120x190": 1105, "140x190": 1155, "160x190": 1335, "160x200": 1475, "180x200": 1755}
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


def detect_service_intent(text: str):
    if any(keyword in text for keyword in ["livraison", "livrer", "delivery", "delai", "48h", "72h"]):
        return {
            "response": "La livraison est disponible en Tunisie, generalement sous 48h a 72h selon la ville et la disponibilite. Vous pouvez aussi payer a la livraison.",
            "intent": "livraison",
            "recommendations": []
        }
    if any(keyword in text for keyword in ["paiement", "payer", "payement", "t5alsou", "cash", "carte", "facilite"]):
        return {
            "response": "Vous pouvez payer a la livraison. Pour commander, envoyez la dimension, le modele souhaite et votre numero de telephone afin qu'un conseiller confirme avec vous.",
            "intent": "paiement",
            "recommendations": []
        }
    if any(keyword in text for keyword in ["garantie", "sav", "retour", "echange"]):
        return {
            "response": "La garantie depend du modele choisi. Donnez-moi le nom du matelas ou la gamme, et je vous indique les informations utiles avant la commande.",
            "intent": "garantie",
            "recommendations": []
        }
    return None


def build_response_legacy(category_tag: str, dimension: str):
    product_map = PRIX_CATALOGUE.get(category_tag)
    if not product_map:
        return None

    category_label = category_tag.replace("_", " ").replace("gamme ", "").strip()
    lines = [f"Pour le {dimension} ({category_label}), voici nos modèles :"]
    for product_name, prices in product_map.items():
        price = prices.get(dimension, "Sur demande")
        lines.append(f"• {product_name} : {price} DT")
    return "\n".join(lines)


def build_response(category_tag: str, dimension: str):
    product_map = PRIX_CATALOGUE.get(category_tag)
    if not product_map:
        return None

    category_label = category_tag.replace("_", " ").replace("gamme ", "").strip()
    if category_tag == "gamme_orthomedical":
        lines = [f"Pour {dimension} en gamme {category_label}, je recommande Medico Plus avec le prix exact de cette dimension :"]
    else:
        lines = [f"Pour {dimension} en gamme {category_label}, voici les modeles disponibles avec le prix exact de cette dimension :"]
    for product_name, prices in product_map.items():
        price = prices.get(dimension)
        price_label = f"{price} DT" if isinstance(price, int) else "Sur demande"
        lines.append(f"- {product_name} : {price_label}")
    return "\n".join(lines)


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    raw_message = data.get("message", "")
    user_id = data.get("userId", "default_user")

    normalized_input = normalize_text(raw_message)
    dimension = extraire_dimension(normalized_input)
    category_tag = detect_category(normalized_input)
    session = user_sessions.get(user_id)
    if not isinstance(session, dict):
        session = {"dimension": session} if session else {}
        user_sessions[user_id] = session

    # Greeting should respond quickly
    if detect_greeting(normalized_input):
        return jsonify({
            "response": "Bonjour, je suis l'assistant Star Mousse. Comment puis-je vous aider aujourd'hui ?",
            "intent": "greeting"
        })

    service_reply = detect_service_intent(normalized_input)
    if service_reply:
        return jsonify(service_reply)

    # If user provides both dimension and category in one message, répondre immédiatement
    if dimension and category_tag:
        session["dimension"] = dimension
        session["category"] = category_tag
        response_text = build_response(category_tag, dimension)
        return jsonify({"response": response_text, "intent": category_tag})

    # Purchase intent without dimension can still guide user
    if detect_purchase_intent(normalized_input) and not dimension:
        return jsonify({
            "response": "Je peux vous aider à choisir un matelas. Indiquez-moi la dimension souhaitée et si vous préférez une gamme orthopédique, orthomédicale ou ergonomique.",
            "intent": "purchase_intent"
        })

    # Save the dimension if set, and ask for la gamme
    if dimension:
        session["dimension"] = dimension
        if session.get("category"):
            response_text = build_response(session["category"], dimension)
            return jsonify({"response": response_text, "intent": session["category"]})
        return jsonify({
            "response": f"J'ai bien noté {dimension}. Quelle gamme recherchez-vous ? Orthopédique, Orthomédicale ou Ergonomique haut de gamme ?",
            "intent": "dimension_captured"
        })

    # If the user mentions a category after dimension, use the stored dimension
    if category_tag:
        session["category"] = category_tag
        dimension = session.get("dimension")
        if not dimension:
            return jsonify({
                "response": "Gamme bien notee. Donnez-moi la dimension (ex: 160x190) pour vous proposer les modeles exacts.",
                "intent": "category_selected",
                "recommendations": []
            })
        response_text = build_response(category_tag, dimension)
        return jsonify({"response": response_text, "intent": category_tag})

    # If the user asks about budget/prix, guide the next step
    if detect_budget(normalized_input):
        return jsonify({
            "response": "Je peux vous proposer des matelas dans votre budget. Donnez-moi la dimension souhaitée et la gamme préférée pour trouver la meilleure option.",
            "intent": "budget"
        })

    return jsonify({
        "response": "Pour mieux vous aider, parlez-moi de votre matelas : dimension, gamme (orthopédique/orthomédicale/ergonomique), budget ou confort dos.",
        "intent": "fallback"
    })
if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True, use_reloader=False)
