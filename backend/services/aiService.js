// backend/services/aiService.js
require('dotenv').config();
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_LOCAL_AI = process.env.USE_LOCAL_AI === 'true';
const LOCAL_AI_URL = process.env.LOCAL_AI_URL || 'http://localhost:11434';

class AIService {
  /**
   * Générer embeddings pour recherche sémantique
   */
  async generateEmbedding(text) {
    try {
      if (USE_LOCAL_AI) {
        return await this.generateLocalEmbedding(text);
      }
      return await this.generateOpenAIEmbedding(text);
    } catch (error) {
      console.error('Erreur embedding:', error);
      return null;
    }
  }

  /**
   * Embedding OpenAI
   */
  async generateOpenAIEmbedding(text) {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configuré');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-3-small',
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data[0].embedding;
  }

  /**
   * Embedding local (Ollama)
   */
  async generateLocalEmbedding(text) {
    const response = await axios.post(
      `${LOCAL_AI_URL}/api/embeddings`,
      {
        model: 'nomic-embed-text',
        prompt: text,
      }
    );
    return response.data.embedding;
  }

  /**
   * Générer recommandations IA
   */
  async generateRecommendations(userId, userHistory, products, count = 5) {
    try {
      const prompt = `
Tu es un expert en recommandations de matelas, oreillers et lits.

Historique d'achat utilisateur: ${JSON.stringify(userHistory)}

Produits disponibles: ${JSON.stringify(products.slice(0, 10).map(p => ({
  id: p._id,
  name: p.name,
  category: p.category,
  price: p.price,
  rating: p.averageRating,
})))}

Recommande les ${count} meilleurs produits pour cet utilisateur.
Retourne un JSON: { recommendations: [{ productId, reason }] }
      `;

      const response = await this.callAI(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { recommendations: [] };
    } catch (error) {
      console.error('Erreur recommandations:', error);
      return { recommendations: [] };
    }
  }

  /**
   * Analyser sentiment d'un avis
   */
  async analyzeSentiment(reviewText) {
    try {
      const prompt = `
Analyse cet avis client et retourne:
{ sentiment: "positive" | "neutral" | "negative", score: 0-1, keywords: [] }

Avis: "${reviewText}"
      `;

      const response = await this.callAI(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { sentiment: 'neutral', score: 0.5, keywords: [] };
    } catch (error) {
      console.error('Erreur sentiment:', error);
      return { sentiment: 'neutral', score: 0.5, keywords: [] };
    }
  }

  /**
   * Générer réponse chatbot
   */
  async chatbot(userMessage, context = {}) {
    try {
      const systemPrompt = `
Tu es l'assistant IA de Star Mousse, une boutique tunisienne spécialisée en matelas, oreillers et lits de qualité.
Tu fournis des conseils, recommandations et support client en français.
Sois amical, professionnel et utile.
`;

      const response = await this.callAI(userMessage, systemPrompt);
      return response;
    } catch (error) {
      console.error('Erreur chatbot:', error);
      return 'Désolé, je n\'arrive pas à répondre en ce moment. Veuillez nous contacter directement.';
    }
  }

  /**
   * Appeler l'API IA (OpenAI ou Local)
   */
  async callAI(userMessage, systemPrompt = null) {
    if (USE_LOCAL_AI) {
      return await this.callLocalAI(userMessage, systemPrompt);
    }
    return await this.callOpenAI(userMessage, systemPrompt);
  }

  /**
   * Appeler OpenAI
   */
  async callOpenAI(userMessage, systemPrompt = null) {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configuré');
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userMessage });

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Appeler Ollama (local)
   */
  async callLocalAI(userMessage, systemPrompt = null) {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userMessage });

    const response = await axios.post(
      `${LOCAL_AI_URL}/api/chat`,
      {
        model: 'llama2',
        messages,
        stream: false,
      }
    );

    return response.data.message.content;
  }

  /**
   * Pricing dynamique basé sur demande
   */
  calculateDynamicPrice(basePrice, demandScore, stockLevel, seasonFactor = 1) {
    // demandScore: 0-1 (0 = faible demande, 1 = forte demande)
    // stockLevel: nombre d'unités restantes

    let priceMultiplier = 1;

    // Facteur demande (20% max de variation)
    priceMultiplier += demandScore * 0.2;

    // Facteur stock (si peu de stock, augmente le prix)
    if (stockLevel < 5) {
      priceMultiplier += 0.15;
    } else if (stockLevel > 50) {
      priceMultiplier -= 0.10;
    }

    // Facteur saisonnier
    priceMultiplier *= seasonFactor;

    const dynamicPrice = Math.round(basePrice * priceMultiplier * 100) / 100;
    return {
      basePrice,
      dynamicPrice,
      multiplier: priceMultiplier,
      demandFactor: demandScore * 0.2,
      stockFactor: stockLevel < 5 ? 0.15 : (stockLevel > 50 ? -0.10 : 0),
    };
  }

  /**
   * Prédire stock nécessaire
   */
  predictStockNeeded(historySales, currentStock, forecastDays = 30) {
    // Moyenne ventes par jour
    const avgDailyMail = historySales.reduce((a, b) => a + b, 0) / historySales.length;
    const projectedDemand = avgDailyMail * forecastDays;
    const recommendation = Math.ceil(projectedDemand * 1.2); // +20% de buffer

    return {
      avgDailyMail: Math.round(avgDailyMail * 100) / 100,
      projectedDemand: Math.round(projectedDemand),
      currentStock,
      recommendation,
      needsRestock: currentStock < (avgDailyMail * 7),
    };
  }
}

module.exports = new AIService();
