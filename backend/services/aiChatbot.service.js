const axios = require('axios');
const crypto = require('crypto');
const logger = require('../logger');
const Product = require('../models/product.model');
const { cacheGet, cacheSet } = require('../config/redis.config');

const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const USE_AI = OPENAI_API_KEY || GEMINI_API_KEY;
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 30000);
const AI_MAX_RETRIES = Number(process.env.AI_MAX_RETRIES || 2);
const CHATBOT_CACHE_TTL_SECONDS = Number(process.env.CHATBOT_CACHE_TTL_SECONDS || 1800);
const CONVERSATION_HISTORY_LIMIT = Number(process.env.CHATBOT_HISTORY_LIMIT || 6);
const CONTACT_PHONE = process.env.STAR_MOUSSE_PHONE || '+216 22 900 131';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sanitizeMessage = (message = '') => String(message || '').trim().slice(0, 1000);

const hashMessage = (value) => crypto.createHash('sha256').update(value).digest('hex');

const callWithRetry = async (handler) => {
  let attempt = 0;

  while (attempt <= AI_MAX_RETRIES) {
    try {
      return await handler();
    } catch (error) {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) throw error;
      if (attempt >= AI_MAX_RETRIES) throw error;
      attempt += 1;
      await delay(Math.min(1000 * 2 ** attempt, 5000));
    }
  }
};

async function callOpenAI(messages, systemPrompt) {
  try {
    const response = await callWithRetry(() => axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: AI_TIMEOUT_MS,
      }
    ));

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty OpenAI response');
    return content;
  } catch (error) {
    logger.error('OpenAI API error:', error.response?.data || error.message);
    throw error;
  }
}

async function callGemini(messages, systemPrompt) {
  try {
    const prompt = `${systemPrompt}\n\n${messages.map((message) => `${message.role}: ${message.content}`).join('\n')}`;
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    const response = await callWithRetry(() => axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.9,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: AI_TIMEOUT_MS,
      }
    ));

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Empty Gemini response');
    return content;
  } catch (error) {
    logger.error('Gemini API error:', error.response?.data || error.message);
    throw error;
  }
}

function extractIntent(message) {
  const text = String(message || '').toLowerCase();

  const budgetMatch = text.match(/(\d+)\s*(dt|dinar|dinars|tnd)/i);
  const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;

  const dimensionMatch = text.match(/(\d{2,3})\s*[x*×]\s*(\d{2,3})|(\d{2,3})\s*(cm|m)/i);
  const dimension = dimensionMatch ? dimensionMatch[0] : null;

  let intent = 'general';

  if (text.match(/dos|dhar|mal de dos|lombaire|orthop[ée]dique|orthom[ée]dicale/i)) {
    intent = 'back_pain';
  } else if (text.match(/livraison|livrer|delivery|delai|délai|48h|72h/i)) {
    intent = 'delivery';
  } else if (text.match(/paiement|payer|payement|t5alsou|cash|carte|facilite|facilité/i)) {
    intent = 'payment';
  } else if (text.match(/garantie|sav|retour|echange|échange/i)) {
    intent = 'warranty';
  } else if (text.match(/budget|prix|co[uû]t|combien|kadech|aswem/i)) {
    intent = 'budget';
  } else if (text.match(/premium|luxe|haut de gamme|ergonomique/i)) {
    intent = 'premium';
  } else if (text.match(/oreiller|coussin|cervical|pillow/i)) {
    intent = 'pillow';
  } else if (text.match(/b[ée]b[ée]|enfant|petit/i)) {
    intent = 'baby';
  } else if (text.match(/best|meilleur|populaire|recommand|bestseller/i)) {
    intent = 'bestseller';
  } else if (text.match(/dimension|taille|mesure|9yes|qyes/i)) {
    intent = 'dimension';
  } else if (text.match(/commande|acheter|nheb|nhb|nechri|nchri|jraya|matelas/i)) {
    intent = 'order';
  }

  return { intent, budget, dimension };
}

async function getProductRecommendations(intent, budget = null, limit = 3) {
  try {
    const safeLimit = Math.min(Math.max(Number(limit) || 3, 1), 8);
    let query = { isActive: true };
    let sort = { averageRating: -1, reviewCount: -1 };

    switch (intent) {
      case 'back_pain':
        query.category = { $in: ['orthopedique', 'orthomedical', 'orthomédicale'] };
        break;
      case 'premium':
        query.category = 'ergonomique';
        sort = { price: -1 };
        break;
      case 'budget':
        if (budget) query.price = { $lte: budget };
        sort = { price: 1 };
        break;
      case 'bestseller':
      case 'order':
        sort = { reviewCount: -1, averageRating: -1, isRecommended: -1 };
        break;
      case 'pillow':
        query.$or = [
          { category: /oreiller|pillow|cervical/i },
          { name: /oreiller|pillow|cervical/i },
          { description: /oreiller|pillow|cervical/i },
        ];
        break;
      case 'baby':
        query.$or = [
          { category: /beb[eé]|baby|enfant/i },
          { name: /beb[eé]|baby|enfant/i },
          { description: /beb[eé]|baby|enfant/i },
        ];
        break;
      default:
        sort = { isRecommended: -1, averageRating: -1, reviewCount: -1 };
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(safeLimit)
      .select('name price category image averageRating reviewCount description stock')
      .lean();

    return products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || '/default-product.jpg',
      rating: product.averageRating || 0,
      reviews: product.reviewCount || 0,
      description: product.description || '',
      path: `/product/${product.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}`,
    }));
  } catch (error) {
    logger.error('Product recommendation error:', { message: error.message, stack: error.stack });
    return [];
  }
}

function buildSystemPrompt(products) {
  const productList = products.length
    ? products.map((product) => `- ${product.name} (${product.price} DT) - ${product.category} - Note: ${product.rating}/5 (${product.reviews} avis)`).join('\n')
    : '- Aucun produit spécifique disponible dans le catalogue pour cette requête.';

  return `Tu es Dali, l'assistant virtuel de Star Mousse, spécialiste en matelas et literie en Tunisie.

PERSONNALITÉ:
- Amical, professionnel et serviable
- Tu parles français et dialecte tunisien quand c'est naturel
- Tu es expert en matelas orthopédiques, orthomédicaux et ergonomiques
- Contact showroom: ${CONTACT_PHONE}

PRODUITS DISPONIBLES:
${productList}

CATÉGORIES:
- Orthopédique: soutien du dos et confort quotidien
- Orthomédicale: problèmes de dos sérieux
- Ergonomique: haut de gamme et confort premium

INSTRUCTIONS:
1. Réponds en 2 à 3 phrases maximum
2. Sois empathique et orienté conversion
3. Recommande les produits listés si pertinent
4. Mentionne le prix, le bénéfice client et une question de qualification si besoin
5. Si le client demande une dimension, demande: "Chniya l 9yes lli 7achtek biha?"`;
}

async function getAIResponse(userMessage, conversationHistory = []) {
  const message = sanitizeMessage(userMessage);

  if (!message) {
    return {
      response: 'Je peux vous aider à choisir un matelas. Dites-moi votre besoin : dos, budget, dimension ou confort.',
      intent: 'general',
      recommendations: [],
      provider: 'basic',
    };
  }

  try {
    const { intent, budget, dimension } = extractIntent(message);
    const products = await getProductRecommendations(intent, budget, 3);
    const normalizedMessage = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cacheKey = `chatbot:${hashMessage(`${normalizedMessage}:${intent}:${budget || ''}`)}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    if (!USE_AI) {
      const payload = {
        response: getBasicResponse(intent, products),
        intent,
        recommendations: products,
        provider: 'basic',
        entities: { budget, dimension },
        sentiment: analyzeSentiment(message),
      };
      await cacheSet(cacheKey, payload, CHATBOT_CACHE_TTL_SECONDS);
      return payload;
    }

    const messages = [
      ...(Array.isArray(conversationHistory) ? conversationHistory : []).slice(-CONVERSATION_HISTORY_LIMIT),
      { role: 'user', content: message },
    ];
    const systemPrompt = buildSystemPrompt(products);

    let aiResponse;
    let provider = AI_PROVIDER;
    if (AI_PROVIDER === 'gemini' && GEMINI_API_KEY) {
      aiResponse = await callGemini(messages, systemPrompt);
    } else if (OPENAI_API_KEY) {
      aiResponse = await callOpenAI(messages, systemPrompt);
      provider = 'openai';
    } else {
      throw new Error('No AI provider configured');
    }

    const payload = {
      response: aiResponse,
      intent,
      recommendations: products,
      provider,
      entities: { budget, dimension },
      sentiment: analyzeSentiment(message),
    };

    await cacheSet(cacheKey, payload, CHATBOT_CACHE_TTL_SECONDS);
    return payload;
  } catch (error) {
    logger.error('AI chatbot error:', { message: error.message, stack: error.stack });

    const { intent } = extractIntent(message);
    const products = await getProductRecommendations(intent, null, 3);

    return {
      response: getBasicResponse(intent, products),
      intent,
      recommendations: products,
      provider: 'fallback',
      error: error.message,
      sentiment: analyzeSentiment(message),
    };
  }
}

function getBasicResponse(intent, products) {
  const productNames = products.map((product) => product.name).join(', ');
  const productIntro = productNames ? ` : ${productNames}` : '';

  const responses = {
    back_pain: `Pour le mal de dos, je recommande notre gamme orthopédique/orthomédicale${productIntro}. Elle apporte un bon soutien lombaire et un maintien équilibré.`,
    delivery: 'La livraison est disponible en Tunisie, généralement sous 48h à 72h selon la ville et la disponibilité. Paiement à la livraison disponible.',
    payment: 'Vous pouvez payer à la livraison. Pour confirmer une commande, envoyez la dimension, le modèle souhaité et votre numéro de téléphone.',
    warranty: 'La garantie dépend du modèle choisi. Dites-moi le matelas ou la gamme et je vous confirme les détails.',
    budget: `Voici nos meilleures options dans votre budget${productIntro}. Elles offrent un bon rapport confort/prix.`,
    premium: `Pour du haut de gamme, découvrez notre collection ergonomique${productIntro}. Confort premium et finition soignée.`,
    bestseller: `Nos produits les plus populaires${productIntro}. Ils sont plébiscités par nos clients.`,
    pillow: `Pour les oreillers, vous pouvez nous contacter au ${CONTACT_PHONE} ou passer au showroom pour essayer les modèles.`,
    baby: `Pour les matelas bébé, contactez-nous au ${CONTACT_PHONE} pour une recommandation personnalisée.`,
    dimension: 'Chniya l 9yes (dimension) lli 7achtek biha? Par exemple: 90x190, 140x190, 160x200?',
    order: `Je peux vous aider à choisir le bon matelas${productIntro}. Donnez-moi la taille, le budget et le confort souhaité.`,
    general: `Aslema! Je suis là pour vous aider à trouver le matelas parfait${productIntro}. Dites-moi ce que vous cherchez.`,
  };

  return responses[intent] || responses.general;
}

function analyzeSentiment(message) {
  const text = String(message || '').toLowerCase();

  const positiveWords = ['merci', 'super', 'parfait', 'excellent', 'génial', 'top', 'bien', 'bon', 'mrigel'];
  const negativeWords = ['mauvais', 'nul', 'cher', 'problème', 'déçu', 'pas content', '3jebni'];

  let score = 0;
  positiveWords.forEach((word) => {
    if (text.includes(word)) score += 1;
  });
  negativeWords.forEach((word) => {
    if (text.includes(word)) score -= 1;
  });

  return {
    score,
    sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
  };
}

module.exports = {
  getAIResponse,
  extractIntent,
  getProductRecommendations,
  analyzeSentiment,
};
