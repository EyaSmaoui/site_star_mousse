const express = require('express');
const axios = require('axios');
const { extractDimension } = require('../services/chatbot.utils');
const { fetchRecommendedProducts } = require('../controllers/product.Controller');

const router = express.Router();

// Port 5001 aligné sur la réussite de ton test Python Flask
const FLASK_CHATBOT_URL = 'http://127.0.0.1:5001';

const isLegacyChatbotResponse = (text = "") => {
  const normalized = String(text).toLowerCase();
  return /9yes|sam7ni|ma fhimtech|t7eb ta7ki|t7eb orthop|orthopédique, orthomédicale|orthomédicale, wala ergonomique|t7eb orthopédique, orthomédicale|a3tini l 9yes/i.test(normalized);
};

const buildLocalDimensionReply = (message) => {
  const dimension = extractDimension(message);
  if (!dimension) return null;

  return {
    response: `J'ai bien noté ${dimension}. Quelle gamme souhaitez-vous ? Orthopédique, Orthomédicale ou Ergonomique haut de gamme ?`,
    intent: 'dimension_captured',
    source: 'node_local',
  };
};

const buildLocalFallbackReply = async (message) => {
  const normalized = String(message || '').toLowerCase();
  const isProductRequest = /matelas|jraya|oreiller|pillow|dos|dhar|orthop|orthoped|premium|luxe|bebe|bébé|budget|prix|commande|acheter|soutien|lombaire/.test(normalized);

  if (/livraison|livrer|delivery|delai|48h|72h/.test(normalized)) {
    return {
      response: 'La livraison est disponible en Tunisie, generalement sous 48h a 72h selon la ville et la disponibilite. Vous pouvez aussi payer a la livraison.',
      intent: 'livraison',
      recommendations: [],
      source: 'node_local',
    };
  }

  if (/paiement|payer|payement|t5alsou|cash|carte|facilite/.test(normalized)) {
    return {
      response: "Vous pouvez payer a la livraison. Pour commander, envoyez la dimension, le modele souhaite et votre numero de telephone afin qu'un conseiller confirme avec vous.",
      intent: 'paiement',
      recommendations: [],
      source: 'node_local',
    };
  }

  if (/garantie|sav|retour|echange/.test(normalized)) {
    return {
      response: 'La garantie depend du modele choisi. Donnez-moi le nom du matelas ou la gamme, et je vous indique les informations utiles avant la commande.',
      intent: 'garantie',
      recommendations: [],
      source: 'node_local',
    };
  }

  if (extractDimension(message)) {
    return buildLocalDimensionReply(message);
  }

  if (isProductRequest) {
    try {
      const recommendations = await fetchRecommendedProducts({ q: message, limit: 3 });
      return {
        response: recommendations.length
          ? 'Voici une sélection adaptée à votre demande. Cliquez sur un produit pour voir les détails.'
          : 'Je cherche le meilleur produit pour vous. Pouvez-vous préciser la dimension ou le budget ?',
        intent: 'recommendation',
        recommendations,
        source: 'node_local',
      };
    } catch (recError) {
      console.error('[Local Recommendations] Erreur:', recError.message);
    }
  }

  return {
    response: "Bonjour, je suis l'assistant Star Mousse. Parlez-moi de votre matelas : dimension, gamme, budget ou confort dos.",
    intent: 'fallback',
    source: 'node_local',
  };
};

router.post('/chat', async (req, res) => {
  const message = req.body?.message || '';
  const userId = req.body?.userId || req.session?.id || 'default_user';

  if (!message.trim()) {
    return res.status(400).json({ error: 'Message vide' });
  }

  try {
    // 🚀 ÉTAPE DE SÉCURITÉ ABSOLUE : Si Node voit passer une dimension,
    // il court-circuite tout traitement local et l'envoie de force à Flask.
    const hasDim = extractDimension(message);

    console.log(`[Proxy] Message reçu : "${message}" | Dimension détectée localement : ${hasDim}`);

    // Appel au microservice Flask (Python)
    const response = await axios.post(`${FLASK_CHATBOT_URL}/chat`, {
      message: message,
      userId: userId
    }, { timeout: 4000 });

    if (response.data && response.data.response) {
      const legacyResponse = isLegacyChatbotResponse(response.data.response) || response.data.intent === 'fallback';
      if (legacyResponse) {
        const localReply = await buildLocalFallbackReply(message);
        return res.json(localReply);
      }

      return res.json({
        response: response.data.response,
        intent: response.data.intent,
        recommendations: response.data.recommendations || [],
        source: 'flask_backend'
      });
    }

  } catch (error) {
    console.error("[Proxy Error] Impossible de joindre Flask sur le port 5001:", error.message);
    const localReply = await buildLocalFallbackReply(message);
    return res.json(localReply);
  }

  // Fallback général si tout échoue
  const localReply = await buildLocalFallbackReply(message);
  return res.json(localReply);
});

router.get('/recommendations', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const limit = Math.min(Number(req.query.limit) || 3, 12);

  try {
    const recommendations = await fetchRecommendedProducts({ q, limit });
    return res.json(recommendations);
  } catch (error) {
    console.error('[Chatbot] Impossible de charger les recommandations :', error.message);
    return res.status(500).json({ error: 'Impossible de charger les recommandations.' });
  }
});

module.exports = router;
