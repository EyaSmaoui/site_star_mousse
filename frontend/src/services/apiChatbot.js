import axios from "axios";

const CHATBOT_API_URL = process.env.REACT_APP_CHATBOT_API_URL || "";
const API_URL = process.env.REACT_APP_API_URL || "";
const useMock = process.env.REACT_APP_CHATBOT_USE_MOCK === "true";
const LEGACY_GREETING = "Bonjour, je suis l'assistant Star Mousse. Je peux vous recommander un matelas ou un oreiller selon votre besoin.";
const LEGACY_FALLBACK = "Je peux vous aider. Précisez votre besoin : mal de dos, budget, luxe, oreiller, bébé, ou dimension souhaitée.";
const DALI_GREETING = "Bonjour, je suis l'assistant Star Mousse. Comment puis-je vous aider aujourd'hui ?";
const DALI_FALLBACK = "Je n'ai pas bien compris votre demande. Souhaitez-vous parler de matelas, oreiller, livraison, paiement, garantie, ou commande ?";
const conversationState = {
  dimension: null,
  category: null,
};
const CATALOGUE_PRICES = {
  orthopedique: [
    {
      id: "soft-plus",
      name: "Matelas orthopedique Soft Plus",
      path: "/product/soft-plus",
      image: "/venise.jpg",
      description: "Soutien ferme et confort accessible.",
      prices: {
        "80x190": 255,
        "90x190": 285,
        "120x190": 385,
        "140x190": 395,
        "160x190": 445,
        "160x200": 505,
        "180x200": 605,
      },
    },
    {
      id: "venise-plus",
      name: "Matelas orthopedique Venise Plus",
      path: "/product/venise-plus",
      image: "/venise.jpg",
      description: "Maintien orthopedique ferme pour le dos.",
      prices: {
        "80x190": 305,
        "90x190": 335,
        "120x190": 445,
        "140x190": 465,
        "160x190": 525,
        "160x200": 595,
        "180x200": 705,
      },
    },
  ],
  orthomedical: [
    {
      id: "medico-plus",
      name: "Matelas Medico Plus",
      path: "/product/medico-plus",
      image: "/medico.jpg",
      description: "Recommande en orthomedical pour un soutien renforce.",
      prices: {
        "80x190": 425,
        "90x190": 475,
        "120x190": 675,
        "140x190": 695,
        "160x190": 805,
        "160x200": 880,
        "180x200": 1055,
      },
    },
  ],
  ergonomique: [
    {
      id: "relax-plus",
      name: "Matelas Relax Plus",
      path: "/product/relax-plus",
      image: "/relax1.png",
      description: "Confort ergonomique haut de gamme.",
      prices: {
        "80x190": 515,
        "90x190": 575,
        "120x190": 810,
        "140x190": 835,
        "160x190": 965,
        "160x200": 1105,
        "180x200": 1305,
      },
    },
    {
      id: "tendresse",
      name: "Matelas Tendresse Plus",
      path: "/product/tendresse",
      image: "/tendresse.jpg",
      description: "Accueil premium et soutien avance.",
      prices: {
        "80x190": 705,
        "90x190": 775,
        "120x190": 1105,
        "140x190": 1155,
        "160x190": 1335,
        "160x200": 1475,
        "180x200": 1755,
      },
    },
  ],
};
const GREETING_WORDS = new Set([
  "bonjour",
  "salut",
  "hello",
  "coucou",
  "aslema",
  "aslama",
  "slem",
  "salem",
  "mar7ba",
  "marhba",
  "ahla",
]);

if (process.env.NODE_ENV === "development") {
  console.debug("[Chatbot] API:", CHATBOT_API_URL || "/api/chatbot");
}

const normalizeMessage = (message = "") =>
  message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[23579]/g, (digit, offset, text) => {
      const previous = text[offset - 1] || "";
      const next = text[offset + 1] || "";
      if (/\d/.test(previous) || /\d/.test(next)) return digit;
      return {
        2: "a",
        3: "a",
        5: "kh",
        7: "h",
        9: "q",
      }[digit];
    })
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractDimension = (message = "") => {
  const normalized = normalizeMessage(message);
  const match = normalized.match(/(\d{2,3})\s*[xX*/\s-]\s*(\d{2,3})/);
  if (!match) return null;
  const first = Number(match[1]);
  const second = Number(match[2]);
  return `${Math.min(first, second)}x${Math.max(first, second)}`;
};

const detectCategory = (message = "") => {
  const normalized = normalizeMessage(message);
  if (/orthomedical|medico|medico plus/.test(normalized)) return "orthomedical";
  if (/orthopedique|ortho|soft plus|venise plus|dhar|dos/.test(normalized)) return "orthopedique";
  if (/ergonomique|relax|tendresse|premium|haut de gamme|haut gamme|luxe/.test(normalized)) return "ergonomique";
  return null;
};

const detectBudget = (message = "") => {
  const normalized = normalizeMessage(message);
  return /budget|prix|soum|tnd|dt|tarif|kadech|aswem/.test(normalized);
};

const categoryLabel = (category) => ({
  orthopedique: "orthopedique",
  orthomedical: "orthomedicale",
  ergonomique: "ergonomique haut de gamme",
}[category] || category);

const buildRecommendationQuery = ({ dimension, category }) =>
  [categoryLabel(category), dimension, "matelas"].filter(Boolean).join(" ");

const buildCatalogueRecommendations = ({ dimension, category }) =>
  (CATALOGUE_PRICES[category] || []).map((product) => {
    const price = product.prices[dimension];
    return {
      id: `${product.id}-${dimension}`,
      name: product.name,
      price: typeof price === "number" ? price : 0,
      path: product.path,
      image: product.image,
      description: typeof price === "number"
        ? `${dimension} - ${product.description}`
        : `${dimension} - Prix sur demande`,
      priceLabel: typeof price === "number" ? `${price.toFixed(2)} DT` : "Sur demande",
    };
  });

const buildProductReply = ({ dimension, category }) => {
  const intro = category === "orthomedical"
    ? `Pour ${dimension} en gamme ${categoryLabel(category)}, je recommande Medico Plus avec le prix exact de cette dimension.`
    : `Pour ${dimension} en gamme ${categoryLabel(category)}, voici les modeles disponibles avec le prix exact de cette dimension.`;

  return {
    intent: "recommendation",
    response: intro,
    recommendations: buildCatalogueRecommendations({ dimension, category }),
    recommendationQuery: buildRecommendationQuery({ dimension, category }),
  };
};

const detectServiceIntent = (message = "") => {
  const normalized = normalizeMessage(message);

  if (/livraison|livrer|delivery|delai|48h|72h/.test(normalized)) {
    return {
      intent: "livraison",
      response: "La livraison est disponible en Tunisie. Generalement, elle se fait sous 48h a 72h selon la ville et la disponibilite du produit. Vous pouvez aussi payer a la livraison.",
      recommendations: [],
    };
  }

  if (/paiement|payer|payement|t5alsou|cash|carte|versement|facilite/.test(normalized)) {
    return {
      intent: "paiement",
      response: "Vous pouvez payer a la livraison. Pour commander, envoyez la dimension, le modele souhaite et votre numero de telephone afin qu'un conseiller confirme avec vous.",
      recommendations: [],
    };
  }

  if (/garantie|warranty|sav|retour|echange/.test(normalized)) {
    return {
      intent: "garantie",
      response: "La garantie depend du modele choisi. Donnez-moi le nom du matelas ou la gamme, et je vous indique les informations utiles avant la commande.",
      recommendations: [],
    };
  }

  return null;
};

const isGreeting = (message = "") => {
  const normalized = normalizeMessage(message);
  return GREETING_WORDS.has(normalized);
};

const detectLocalIntent = (message = "") => {
  const normalized = normalizeMessage(message);
  const tokens = normalized.split(" ");
  const hasAny = (words) => words.some((word) => normalized.includes(word));
  const dimension = extractDimension(message);
  const category = detectCategory(message);
  const wantsToBuy = hasAny(["nheb", "nhb", "nechri", "nchri", "acheter", "commander", "commande", "matelas", "jraya"]);
  const mattressWords = hasAny(["matelas", "jraya", "jaraya", "jaraa"]);
  const backCareRequest = /dos|dhar|mal au dos|soutien du dos|lombaire/.test(normalized);
  const budgetRequest = detectBudget(message);

  if (isGreeting(message)) {
    return {
      intent: "salutation",
      response: DALI_GREETING,
      recommendations: [],
    };
  }

  if (hasAny(["merci", "yrah", "yrahem", "yaaychek", "sahit", "saha", "baraka"])) {
    return {
      intent: "thanks",
      response: "Avec plaisir, je suis là pour vous aider.",
      recommendations: [],
    };
  }

  const serviceIntent = detectServiceIntent(message);
  if (serviceIntent) return serviceIntent;

  if (dimension) conversationState.dimension = dimension;
  if (category) conversationState.category = category;

  const knownDimension = dimension || conversationState.dimension;
  const knownCategory = category || conversationState.category;

  if (knownDimension && knownCategory && (dimension || category)) {
    return buildProductReply({ dimension: knownDimension, category: knownCategory });
  }

  if (dimension && !knownCategory) {
    return {
      intent: "dimension_captured",
      response: `J'ai bien noté ${dimension}. Quelle gamme souhaitez-vous ? Orthopédique, Orthomédicale ou Ergonomique haut de gamme ?`,
      recommendations: [],
    };
  }

  if (category && !knownDimension) {
    return {
      intent: "category_selected",
      response: `Vous cherchez une gamme ${categoryLabel(category)}. Precisez la dimension (ex: 160x190) pour que je puisse choisir le meilleur produit.`,
      recommendations: [],
    };
  }

  if (dimension && category) {
    return buildProductReply({ dimension, category });
  }

  if (backCareRequest && wantsToBuy) {
    return {
      intent: "recommendation",
      response: "Pour votre dos, je vous conseille un matelas avec soutien lombaire et mousse mémoire. Donnez-moi votre dimension et votre budget pour affiner le choix.",
      recommendations: [],
    };
  }

  if (budgetRequest && wantsToBuy) {
    return {
      intent: "budget",
      response: "Je peux trouver un matelas dans votre budget. Merci de préciser la taille souhaitée et la gamme préférée.",
      recommendations: [],
    };
  }

  if (wantsToBuy && mattressWords) {
    return {
      intent: "commande",
      response: "Très bien, je vous aide à trouver le bon matelas. Donnez-moi la taille, le budget et si vous préférez un soutien ferme ou moelleux.",
      recommendations: [],
    };
  }

  if (tokens.length <= 4 && mattressWords) {
    return {
      intent: "conseil_matelas",
      response: "Je peux vous proposer un matelas adapté à votre dos. Donnez-moi la taille et votre budget pour affiner la sélection.",
      recommendations: [],
    };
  }

  return null;
};

const adaptChatbotReply = (message, data = {}) => {
  const localIntent = detectLocalIntent(message);

  const fallbackResponse =
    data.intent === "fallback" ||
    data.response === LEGACY_FALLBACK ||
    /Je n'ai pas bien compris|Sam7ni|ma fhimtech|t7eb ta7ki/i.test(data.response || "");

  if (localIntent && (
    !data.intent ||
    fallbackResponse ||
    data.response === LEGACY_GREETING ||
    ["dimension_captured", "category_selected", "recommendation", "livraison", "paiement", "garantie"].includes(localIntent.intent)
  )) {
    return {
      ...data,
      ...localIntent,
    };
  }

  if (fallbackResponse) {
    return {
      ...data,
      intent: "fallback",
      response: DALI_FALLBACK,
      recommendations: [],
    };
  }

  return data;
};

const mockResponse = async (message) => {
  const normalized = normalizeMessage(message);

  if (isGreeting(message)) {
    return {
      response: DALI_GREETING,
      intent: "salutation",
      recommendations: [],
    };
  }

  const localIntent = detectLocalIntent(message);
  if (localIntent) return localIntent;

  if (normalized.includes("dos") || normalized.includes("mal au dos") || normalized.includes("soutien du dos") || normalized.includes("lombaire")) {
    return {
      response: "Pour le dos, je vous recommande un matelas avec soutien lombaire, maintien équilibré et mousse mémoire de forme. Donnez-moi la taille et le budget pour vous proposer les meilleurs modèles.",
      recommendations: [
        {
          id: "medico-plus",
          name: "Medico Plus",
          price: 520,
          path: "/product/medico-plus",
          image: "/medico.jpg",
          description: "Soutien ferme et ergonomique pour le dos.",
        },
      ],
    };
  }

  if (/orthopedique|ortho|soft plus|venise plus/.test(normalized)) {
    return {
      response: "Vous cherchez une gamme orthopédique. Indiquez-moi la dimension souhaitée pour que je puisse sélectionner le meilleur matelas.",
      recommendations: [],
    };
  }

  if (/orthomedical|medico|medico plus/.test(normalized)) {
    return {
      response: "Vous cherchez une gamme orthomédicale. Donnez-moi la taille du matelas et votre budget pour affiner la sélection.",
      recommendations: [],
    };
  }

  if (/ergonomique|relax|tendresse|premium|haut de gamme|luxe/.test(normalized)) {
    return {
      response: "Vous cherchez une gamme ergonomique haut de gamme. Merci de préciser la dimension souhaitée pour vous proposer les modèles adaptés.",
      recommendations: [],
    };
  }

  if (normalized.includes("budget") || normalized.includes("prix") || normalized.includes("dt") || normalized.includes("tnd")) {
    return {
      response: "Je peux vous aider avec le budget. Dites-moi la dimension du matelas (ex: 160x190) et je chercherai des options dans cette fourchette.",
      recommendations: [],
    };
  }

  return {
    response: "Voici des suggestions produits adaptees a votre demande.",
    recommendations: [
      {
        id: "confort-plus",
        name: "Confort Plus",
        price: 219,
        path: "/product/confort-plus",
        image: "/confort.png",
        description: "Bon choix budget.",
      },
      {
        id: "medico-plus",
        name: "Medico Plus",
        price: 520,
        path: "/product/medico-plus",
        image: "/medico.jpg",
        description: "Soutien ferme pour le dos.",
      },
    ],
  };
};

const uniqueUrls = (urls) => [...new Set(urls.filter(Boolean).map((url) => url.replace(/\/$/, "")))];

const chatbotBaseUrls = () => uniqueUrls([
  CHATBOT_API_URL,
  API_URL ? `${API_URL.replace(/\/$/, "")}/chatbot` : "",
  "/api/chatbot",
  "http://localhost:5000/api/chatbot",
  "http://127.0.0.1:5000/api/chatbot",
  "http://localhost:5005",
  "http://127.0.0.1:5005",
]);

const requestFirstAvailable = async ({ method, path, params, data }) => {
  let lastError;

  for (const baseUrl of chatbotBaseUrls()) {
    try {
      const response = await axios({
        method,
        url: `${baseUrl}${path}`,
        params,
        data,
        timeout: 2500,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

const isFastLocalIntent = (intent) => [
  "salutation",
  "thanks",
  "dimension_captured",
  "category_selected",
  "recommendation",
  "livraison",
  "paiement",
  "garantie",
].includes(intent);

export const sendChatMessage = async (message) => {
  if (useMock) {
    return mockResponse(message);
  }

  const localIntent = detectLocalIntent(message);
  if (localIntent && isFastLocalIntent(localIntent.intent)) {
    return localIntent;
  }

  try {
    const data = await requestFirstAvailable({
      method: "post",
      path: "/chat",
      data: { message },
    });
    return adaptChatbotReply(message, data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Chatbot] Serveur indisponible, reponse locale utilisee.", error);
    }
    return mockResponse(message);
  }
};

export const getRecommendations = async (query, limit = 3) => {
  if (useMock) {
    const local = await mockResponse(query);
    return local.recommendations || [];
  }

  try {
    const data = await requestFirstAvailable({
      method: "get",
      path: "/recommendations",
      params: { q: query, limit },
    });
    return Array.isArray(data) ? data : data.recommendations || [];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Chatbot] Recommendations serveur indisponibles, reponse locale utilisee.", error);
    }
    const local = await mockResponse(query);
    return local.recommendations || [];
  }
};
