import axios from "axios";

const CHATBOT_API_URL = process.env.REACT_APP_CHATBOT_API_URL || "";
const API_URL = process.env.REACT_APP_API_URL || "";
const useMock = process.env.REACT_APP_CHATBOT_USE_MOCK === "true";
const LEGACY_GREETING = "Bonjour, je suis l'assistant Star Mousse. Je peux vous recommander un matelas ou un oreiller selon votre besoin.";
const LEGACY_FALLBACK = "Je peux vous aider. Precisez votre besoin : mal de dos, budget, luxe, oreiller, bebe, ou dimension souhaitee.";
const DALI_GREETING = "Aslema, ena Dali mte3 Star Mousse. 9olli chnowa 7achtek w n3awnk direct.";
const DALI_FALLBACK = "Sam7ni, ma fhimtech mrigel. 9olli t7eb ta7ki 3la soum, livraison, paiement, garantie, dhar, m5adda wala commande ?";
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

const isGreeting = (message = "") => {
  const normalized = normalizeMessage(message);
  return GREETING_WORDS.has(normalized);
};

const detectLocalIntent = (message = "") => {
  const normalized = normalizeMessage(message);
  const tokens = normalized.split(" ");
  const hasAny = (words) => words.some((word) => normalized.includes(word));

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
      response: "3la ra7bi w sa3ti ! Dali dima houni.",
      recommendations: [],
    };
  }

  const wantsToBuy = hasAny(["nheb", "nhb", "nechri", "nchri", "acheter", "commander", "commande"]);
  const mattressWords = hasAny(["jraya", "jaraya", "jaraa", "matelas"]);

  if (wantsToBuy && mattressWords) {
    return {
      intent: "commande",
      response: "Mrigel, t7eb nechri jraya. 9olli juste l 9yes, budgetek, w ken t7ebha ferme wala rtwiba bech n9arblek choix behi.",
      recommendations: [],
    };
  }

  if (hasAny(["ama khir", "ama khir", "a5ir", "akhir", "khir"]) && mattressWords) {
    return {
      intent: "conseil_matelas",
      response: "A7sen jraya tetbadal 3la 7seb badnek : ken dharek yoja3 5oudh ferme/orthopedique, ken t7eb confort 5oudh equilibree. 9olli budgetek w l 9yes nfassarlek akther.",
      recommendations: [],
    };
  }

  if (tokens.length <= 4 && mattressWords) {
    return {
      intent: "conseil_matelas",
      response: "Jraya mrigla, behi. 9olli l 9yes w budgetek, w ken 3andek wej3 dhar wala t7eb confort rtab.",
      recommendations: [],
    };
  }

  return null;
};

const adaptChatbotReply = (message, data = {}) => {
  const localIntent = detectLocalIntent(message);

  if (localIntent && (!data.intent || data.intent === "fallback" || data.response === LEGACY_GREETING || data.response === LEGACY_FALLBACK)) {
    return {
      ...data,
      ...localIntent,
    };
  }

  if (data.intent === "fallback" || data.response === LEGACY_FALLBACK) {
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

  if (normalized.includes("dos") || normalized.includes("mal au dos")) {
    return {
      response: "Pour le dos, je recommande un matelas avec soutien lombaire et une mousse a memoire de forme.",
      recommendations: [
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
  }

  if (normalized.includes("oreiller")) {
    return {
      response: "Un oreiller cervical est ideal pour un alignement confortable du cou.",
      recommendations: [
        {
          id: "medico-pillow",
          name: "Medico Pillow",
          price: 55,
          path: "/product/medico-pillow",
          image: "/medico_pillow.png",
          description: "Soutien cervical pour la nuque.",
        },
      ],
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
        timeout: 12000,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const sendChatMessage = async (message) => {
  if (useMock) {
    return mockResponse(message);
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
    return mockResponse(query);
  }

  try {
    return await requestFirstAvailable({
      method: "get",
      path: "/recommendations",
      params: { q: query, limit },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Chatbot] Recommendations serveur indisponibles, reponse locale utilisee.", error);
    }
    return mockResponse(query);
  }
};
