import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendChatMessage, getRecommendations } from "../services/apiChatbot";
import "../styles/chatbot.css";
import formatPrice from '../utils/formatPrice';

const QUICK_PROMPTS = [
  "Je cherche un matelas pour le dos",
  "Budget 300 DT pour un matelas",
  "Un oreiller cervical",
  "Quels sont vos best-sellers ?",
];

const FALLBACK_RECOMMENDATIONS = [
  {
    id: "medico-plus",
    name: "Medico Plus",
    price: 520,
    path: "/product/medico-plus",
    image: "/medico.jpg",
    description: "Soutien ferme pour le dos.",
  },
  {
    id: "confort-plus",
    name: "Confort Plus",
    price: 219,
    path: "/product/confort-plus",
    image: "/confort.png",
    description: "Bon choix budget.",
  },
  {
    id: "tendresse",
    name: "Tendresse",
    price: 730,
    path: "/product/tendresse",
    image: "/tendresse.jpg",
    description: "Confort premium.",
  },
];

// use shared formatPrice util for consistent formatting

function shouldShowRecommendations(messages) {
  return messages.filter((message) => message.from === "user").length >= 2;
}

function canRecommend(intent) {
  return [
    "dos",
    "budget",
    "premium",
    "oreiller",
    "bebe",
    "commande",
    "conseil_matelas",
    "recommendation",
  ].includes(intent);
}

export default function ChatbotAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bonjour, je suis l'assistant Star Mousse. Comment puis-je vous aider aujourd'hui ?",
      recommendations: [],
    },
  ]);

  const inputRef = useRef(null);
  const endRef = useRef(null);

  const hasRecommendations = useMemo(
    () => messages.some((message) => message.recommendations?.length),
    [messages]
  );

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, scrollToBottom]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      const isDesktop = window.matchMedia("(min-width: 641px)").matches;
      if (isDesktop) {
        window.setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  }, [open]);

  // REMOVED: No longer lock body scroll - use CSS modal scrolling instead
  // This was causing mobile users to be unable to scroll when chatbot is open

  const submitMessage = useCallback(
    async (text = input) => {
      const message = text.trim();
      if (!message || loading) return;

      setInput("");
      setLoading(true);
      setMessages((current) => [...current, { from: "user", text: message }]);

      try {
        const data = await sendChatMessage(message);
        let recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];

        if (!recommendations.length && canRecommend(data.intent)) {
          try {
            recommendations = await getRecommendations(data.recommendationQuery || message, 3);
          } catch (recommendationError) {
            console.warn('[Chatbot] Impossible de charger des recommandations additionnelles.', recommendationError);
          }
        }

        setMessages((current) => [
          ...current,
          {
            from: "bot",
            text: data.response || "Désolé, je n'ai pas encore de réponse.",
            recommendations,
          },
        ]);
      } catch (error) {
        setMessages((current) => {
          const recommendations = FALLBACK_RECOMMENDATIONS;

          return [
            ...current,
            {
              from: "bot",
              text: recommendations.length
                ? "Je n'arrive pas à joindre le serveur pour le moment. Voici quelques recommandations utiles."
                : "Je n'arrive pas à joindre le serveur. Réessaie avec un autre message, s'il te plaît.",
              recommendations,
            },
          ];
        });
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  const handleQuickPrompt = useCallback((prompt) => {
    submitMessage(prompt);
  }, [submitMessage]);

  return (
    <div className={`sm-chatbot ${open ? "is-open" : ""}`}>
      {open && (
        <section
          className="sm-chatbot-panel"
          role="dialog"
          aria-labelledby="sm-chatbot-title"
          aria-describedby="sm-chatbot-desc"
          aria-modal="false"
        >
          <header className="sm-chatbot-head">
            <div className="sm-chatbot-head-info">
              <button type="button" className="sm-chatbot-back" onClick={() => setOpen(false)} aria-label="Retour">
                &larr;
              </button>
              <div>
                <div className="sm-chatbot-avatars" aria-hidden="true">
                  <span className="avatar">SM</span>
                  <span className="avatar">AS</span>
                  <span className="avatar">A</span>
                </div>
                <h2 id="sm-chatbot-title">Bonjour</h2>
                <p className="sm-chatbot-status"><span className="status-dot" />Nous repondons generalement sous 5 minutes</p>
              </div>
            </div>
            <button type="button" className="sm-chatbot-icon" aria-label="Plus d'options">
              ...
            </button>
          </header>

          <div className="sm-chatbot-messages" aria-live="polite" aria-label="Historique des messages">
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`sm-chatbot-message ${message.from}`}>
                <div className={`sm-chatbot-message-row ${message.from}`}>
                  <div className="sm-chatbot-message-avatar" aria-hidden="true">
                    {message.from === "bot" ? "SM" : "Me"}
                  </div>
                  <div className="sm-chatbot-message-bubble">
                    <p>{message.text}</p>
                  </div>
                </div>

                {message.recommendations?.length > 0 && (
                  <div className="sm-chatbot-products">
                    {message.recommendations.map((product) => (
                      <a key={product.id || product.path} className="sm-chatbot-product" href={product.path}>
                        <img src={product.image} alt={product.name} loading="lazy" />
                        <span>
                          <strong>{product.name}</strong>
                          <small>{product.description}</small>
                          <em>{product.priceLabel || formatPrice(product.price)}</em>
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="sm-chatbot-typing" aria-live="off" aria-label="Assistant est en train d'ecrire">
                <span className="sm-chatbot-dot" />
                <span className="sm-chatbot-dot" />
                <span className="sm-chatbot-dot" />
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="sm-chatbot-quick" aria-label="Questions rapides">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                disabled={loading}
                aria-label={`Question rapide: ${prompt}`}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="sm-chatbot-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitMessage();
            }}
          >
            <label htmlFor="sm-chatbot-input" className="sr-only">
              Message pour l'assistant
            </label>
            <input
              id="sm-chatbot-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ex: Je cherche un matelas pour le dos"
              aria-label="Message pour l'assistant"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Envoyer le message">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="sm-chatbot-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Fermer le chatbot" : "Ouvrir le chatbot"}
        aria-expanded={open}
      >
        <span className="sm-chatbot-toggle-icon">{hasRecommendations ? "SM" : "?"}</span>
        <span>Conseil</span>
      </button>
    </div>
  );
}
