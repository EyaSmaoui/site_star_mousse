const express = require('express');
const axios = require('axios');
const { extractDimension } = require('../services/chatbot.utils');

const router = express.Router();

// Port 5001 aligné sur la réussite de ton test Python Flask
const FLASK_CHATBOT_URL = 'http://127.0.0.1:5001';

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
      return res.json({
        response: response.data.response,
        intent: response.data.intent,
        recommendations: response.data.recommendations || [],
        source: 'flask_backend'
      });
    }

  } catch (error) {
    console.error("[Proxy Error] Impossible de joindre Flask sur le port 5001:", error.message);
    
    // Fallback de secours uniquement si le script Python est éteint
    if (extractDimension(message)) {
      return res.json({
        response: `9yes ${extractDimension(message)} mrigel ! Chnowa t7eb l gamme : Orthopédique, Orthomédicale, wala Ergonomique haut de gamme ?`,
        intent: "dimension_captured",
        source: "node_fallback"
      });
    }
  }

  // Fallback général si tout échoue
  return res.json({
    response: "Aslema bik fi Star Mousse ! A3tini l 9yes (dimension) lli 7achtek biha ? (Ex: 160x190)",
    intent: "fallback"
  });
});

module.exports = router;