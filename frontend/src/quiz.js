import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const questions = [
  {
    id: "usage",
    step: 1,
    label: "Pour couple ou solo ?",
    title: "Pour couple ou solo ?",
    subtitle: "Cela nous aide à déterminer le niveau de fermeté idéal.",
    options: [
      { value: "couple", icon: "👫", label: "Couple", sub: "Deux personnes partagent le matelas" },
      { value: "solo", icon: "🧍", label: "Solo", sub: "Une seule personne utilise le matelas" },
    ],
  },
  {
    id: "poids",
    step: 2,
    label: "Votre poids",
    title: "Quel est votre poids ?",
    subtitle: "Pour un couple : poids total des deux personnes. Pour solo : votre poids.",
    options: [
      { value: "p80",  icon: "🌿", label: "Moins de 80 kg",  sub: "Très léger — soutien doux recommandé" },
      { value: "p90",  icon: "🍃", label: "Moins de 90 kg",  sub: "Léger — confort souple recommandé" },
      { value: "p110", icon: "⚖️", label: "Moins de 110 kg", sub: "Modéré — soutien équilibré recommandé" },
      { value: "p130", icon: "💪", label: "Moins de 130 kg", sub: "Élevé — soutien ferme recommandé" },
      { value: "p150", icon: "🏋️", label: "Moins de 150 kg", sub: "Très élevé — soutien renforcé recommandé" },
    ],
  },
  {
    id: "probleme",
    step: 3,
    label: "Votre problème de sommeil",
    title: "Quel est votre problème de sommeil ?",
    subtitle: "Nous adaptons notre recommandation à vos besoins spécifiques.",
    options: [
      { value: "dos",     icon: "🔙", label: "Mal au dos",              sub: "Douleurs lombaires ou cervicales" },
      { value: "medical", icon: "🏥", label: "Problème médical",        sub: "Condition médicale particulière" },
      { value: "aucun",   icon: "✅", label: "Aucun problème particulier", sub: "Je dors bien en général" },
    ],
  },
];

const matelas = [
  {
    name: "Soft Plus",
    type: "MATELAS DOUX",
    desc: "Conçu pour les personnes légères, le Soft Plus offre un accueil moelleux et un soutien délicat qui épouse parfaitement les courbes du corps pour un sommeil réparateur.",
    price: "440,00 – 1 350,00 د.ت",
    discount: "-18%",
    img: "/relax1.png",
    features: ["Accueil doux", "Léger & confortable", "Idéal morphologie fine"],
    match: (a) => a.poids === "p80",
  },
  {
    name: "Venise Plus",
    type: "MATELAS CONFORT",
    desc: "Le Venise Plus allie douceur et maintien pour les profils légers. Sa structure équilibrée garantit un confort optimal toute la nuit.",
    price: "480,00 – 1 550,00 د.ت",
    discount: "-17%",
    img: "/tendresse.jpg",
    features: ["Confort équilibré", "Douceur premium", "Soutien adapté"],
    match: (a) => a.poids === "p90",
  },
  {
    name: "Medico Plus",
    type: "MATELAS ORTHOMÉDICALE",
    desc: "Recommandé pour les morphologies modérées et les douleurs dorsales. Le Medico Plus offre une correction posturale avancée pour un réveil sans douleurs.",
    price: "530,00 – 1 850,00 د.ت",
    discount: "-19%",
    img: "/relax_pillow1.png",
    features: ["Correction posturale", "Fermeté modérée", "Anti-douleurs"],
    match: (a) => a.poids === "p110",
  },
  {
    name: "Relax Plus",
    type: "MATELAS ERGONOMIQUE",
    desc: "Soutien ferme et ergonomique pour les morphologies lourdes. Le Relax Plus redistribue les pressions pour un sommeil profond et réparateur.",
    price: "580,00 – 2 050,00 د.ت",
    discount: "-19%",
    img: "/relax1.png",
    features: ["Soutien ferme", "Technologie ergonomique", "Réversible"],
    match: (a) => a.poids === "p130",
  },
  {
    name: "Tendresse Plus",
    type: "MATELAS RENFORCÉ",
    desc: "Conçu pour les morphologies très lourdes, le Tendresse Plus associe un soutien ultra-renforcé à un confort enveloppant pour les nuits les plus exigeantes.",
    price: "730,00 – 2 555,00 د.ت",
    discount: "-20%",
    img: "/tendresse.jpg",
    features: ["Ultra-renforcé", "Longévité maximale", "Confort intense"],
    match: (a) => a.poids === "p150",
  },
];

const Quiz = () => {
  const [screen, setScreen] = useState("intro"); // intro | quiz | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (value) => setSelected(value);

  const handleNext = () => {
    const q = questions[currentQ];
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setScreen("result");
    }
  };

  const getResult = () => {
    return matelas.find((m) => m.match(answers)) || matelas[0];
  };

  const restart = () => {
    setScreen("intro");
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
  };

  const q = questions[currentQ];
  const result = screen === "result" ? getResult() : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Playfair+Display:wght@600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .qz-page {
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          color: #2a2a3d;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── HERO BANNER ── */
        .qz-hero {
          background: #f8f8fd;
          border-bottom: 1px solid #ebebf5;
          padding: 60px 40px 56px;
          text-align: center;
        }
        .qz-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #f3f3fb;
          color: #4a4ade;
          border: 1px solid #ddddf0;
          font-size: 13px;
          font-weight: 500;
          padding: 7px 15px;
          border-radius: 50px;
          margin-bottom: 22px;
          letter-spacing: 0.1px;
        }
        .qz-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1.18;
          margin-bottom: 14px;
          letter-spacing: -0.5px;
        }
        .qz-hero h1 em { color: #4a4ade; font-style: italic; }
        .qz-hero p {
          font-size: 16px;
          color: #60607a;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto 32px;
        }

        /* Steps preview */
        .qz-steps-preview {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .qz-step-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #60607a;
          padding: 0 20px;
          border-right: 1px solid #ddddf0;
        }
        .qz-step-pill:last-child { border-right: none; }
        .qz-step-num {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: #4a4ade;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .qz-btn-start {
          background: #1a1a2e;
          color: #fff;
          border: none;
          padding: 15px 36px;
          border-radius: 11px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.1px;
        }
        .qz-btn-start:hover {
          background: #4a4ade;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(74,74,222,0.25);
        }

        /* ── QUIZ BODY ── */
        .qz-body {
          flex: 1;
          max-width: 760px;
          margin: 0 auto;
          padding: 60px 40px 80px;
          width: 100%;
        }

        /* Progress */
        .qz-progress-wrap {
          margin-bottom: 48px;
        }
        .qz-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .qz-progress-label {
          font-size: 13px;
          color: #9090b0;
          font-weight: 500;
        }
        .qz-progress-count {
          font-size: 13px;
          color: #9090b0;
        }
        .qz-progress-track {
          width: 100%;
          height: 4px;
          background: #ebebf5;
          border-radius: 4px;
          overflow: hidden;
        }
        .qz-progress-fill {
          height: 100%;
          background: #4a4ade;
          border-radius: 4px;
          transition: width 0.4s ease;
        }

        /* Question */
        .qz-question-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #4a4ade;
          margin-bottom: 10px;
        }
        .qz-question-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }
        .qz-question-sub {
          font-size: 14px;
          color: #9090b0;
          margin-bottom: 36px;
          line-height: 1.6;
        }

        /* Options grid */
        .qz-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 36px;
        }
        .qz-option {
          background: #ffffff;
          border: 1.5px solid #ebebf5;
          border-radius: 16px;
          padding: 22px 18px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          text-align: left;
          user-select: none;
        }
        .qz-option:hover {
          border-color: #4a4ade;
          box-shadow: 0 0 0 3px rgba(74,74,222,0.08);
        }
        .qz-option.active {
          border-color: #4a4ade;
          background: #f3f3fb;
          box-shadow: 0 0 0 3px rgba(74,74,222,0.12);
          transform: translateY(-2px);
        }
        .qz-option-icon {
          font-size: 26px;
          margin-bottom: 12px;
          display: block;
        }
        .qz-option-label {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 4px;
          display: block;
        }
        .qz-option-sub {
          font-size: 12.5px;
          color: #9090b0;
          line-height: 1.4;
          display: block;
        }

        /* Nav buttons */
        .qz-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .qz-btn-back {
          background: transparent;
          border: 1.5px solid #ddddf0;
          color: #60607a;
          padding: 12px 22px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .qz-btn-back:hover {
          border-color: #4a4ade;
          color: #4a4ade;
        }
        .qz-btn-next {
          background: #1a1a2e;
          color: #fff;
          border: none;
          padding: 13px 30px;
          border-radius: 11px;
          font-size: 14.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          opacity: 0.35;
          pointer-events: none;
        }
        .qz-btn-next.ready {
          opacity: 1;
          pointer-events: auto;
        }
        .qz-btn-next.ready:hover {
          background: #4a4ade;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(74,74,222,0.25);
        }

        /* ── RESULT ── */
        .qz-result-wrap {
          flex: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 60px 40px 80px;
          width: 100%;
        }
        .qz-result-header {
          text-align: center;
          margin-bottom: 44px;
        }
        .qz-result-header .qz-hero-badge {
          background: #f0fdf4;
          color: #15803d;
          border-color: #bbf7d0;
        }
        .qz-result-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }
        .qz-result-header p {
          font-size: 15px;
          color: #9090b0;
        }
        .qz-result-card {
          background: #f8f8fd;
          border: 1px solid #ebebf5;
          border-radius: 24px;
          display: flex;
          gap: 48px;
          padding: 48px;
          align-items: flex-start;
          flex-wrap: wrap;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .qz-result-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, #eeeeff 0%, transparent 70%);
          pointer-events: none;
        }
        .qz-result-img-wrap {
          flex: 1;
          min-width: 220px;
          max-width: 300px;
          position: relative;
          z-index: 1;
        }
        .qz-result-img-wrap img {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(26,26,46,0.1);
          object-fit: cover;
          aspect-ratio: 4/3;
        }
        .qz-result-discount {
          position: absolute;
          top: 12px; left: 12px;
          background: #d44f0f;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 50px;
          letter-spacing: 0.3px;
        }
        .qz-result-info {
          flex: 1.5;
          min-width: 240px;
          position: relative;
          z-index: 1;
        }
        .qz-result-type {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #4a4ade;
          margin-bottom: 10px;
          display: block;
        }
        .qz-result-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 14px;
          letter-spacing: -0.3px;
          line-height: 1.15;
        }
        .qz-result-desc {
          font-size: 14.5px;
          color: #60607a;
          line-height: 1.72;
          margin-bottom: 22px;
        }
        .qz-result-features {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }
        .qz-feature-tag {
          background: #ffffff;
          border: 1px solid #ddddf0;
          color: #4a4ade;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 50px;
        }
        .qz-result-price {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a2e;
          letter-spacing: -0.3px;
          margin-bottom: 22px;
        }
        .qz-result-btns {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .qz-btn-primary {
          background: #1a1a2e;
          color: #fff;
          border: none;
          padding: 13px 26px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .qz-btn-primary:hover {
          background: #4a4ade;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(74,74,222,0.25);
        }
        .qz-btn-ghost {
          background: transparent;
          color: #60607a;
          border: 1.5px solid #ddddf0;
          padding: 13px 22px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .qz-btn-ghost:hover {
          border-color: #4a4ade;
          color: #4a4ade;
        }

        /* Summary bar */
        .qz-summary {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .qz-summary-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f3f3fb;
          border: 1px solid #ddddf0;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12.5px;
          color: #4a4ade;
          font-weight: 500;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .qz-hero { padding: 44px 24px 40px; }
          .qz-body { padding: 40px 24px 60px; }
          .qz-result-wrap { padding: 40px 24px 60px; }
          .qz-result-card { padding: 28px 22px; gap: 28px; }
          .qz-result-img-wrap { max-width: 100%; }
          .qz-steps-preview { gap: 12px; }
          .qz-step-pill { border-right: none; }
        }
      `}</style>

      <div className="qz-page">
        <NavBar />

        {/* ── INTRO ── */}
        {screen === "intro" && (
          <>
            <div className="qz-hero">
              <div className="qz-hero-badge">🛏 Trouvez votre matelas idéal</div>
              <h1>
                Quel matelas <em>vous correspond</em> ?
              </h1>
              <p>
                Répondez à 3 questions rapides et trouvez le soutien idéal
                pour votre corps et votre position de sommeil.
              </p>
              <div className="qz-steps-preview">
                {["Couple ou solo", "Votre poids total", "Problème de sommeil"].map((s, i) => (
                  <div className="qz-step-pill" key={i}>
                    <span className="qz-step-num">{i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>
              <button className="qz-btn-start" onClick={() => setScreen("quiz")}>
                Lancer le quiz →
              </button>
            </div>

            {/* Reassurance strip */}
            <div style={{ background: "#fff", borderBottom: "1px solid #ebebf5", padding: "28px 40px" }}>
              <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
                {[
                  { icon: "⚡", text: "2 minutes maximum" },
                  { icon: "🎯", text: "Résultat personnalisé" },
                  { icon: "🔒", text: "Sans inscription" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#60607a" }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── QUIZ ── */}
        {screen === "quiz" && (
          <div className="qz-body">
            {/* Progress */}
            <div className="qz-progress-wrap">
              <div className="qz-progress-top">
                <span className="qz-progress-label">{q.label}</span>
                <span className="qz-progress-count">{currentQ + 1} / {questions.length}</span>
              </div>
              <div className="qz-progress-track">
                <div
                  className="qz-progress-fill"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <p className="qz-question-label">Question {currentQ + 1}</p>
            <h2 className="qz-question-title">{q.title}</h2>
            <p className="qz-question-sub">{q.subtitle}</p>

            {/* Options */}
            <div className="qz-options">
              {q.options.map((opt) => (
                <div
                  key={opt.value}
                  className={`qz-option${selected === opt.value ? " active" : ""}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className="qz-option-icon">{opt.icon}</span>
                  <span className="qz-option-label">{opt.label}</span>
                  <span className="qz-option-sub">{opt.sub}</span>
                </div>
              ))}
            </div>

            {/* Nav */}
            <div className="qz-nav">
              <button
                className="qz-btn-back"
                onClick={() => {
                  if (currentQ === 0) { setScreen("intro"); }
                  else { setCurrentQ(currentQ - 1); setSelected(answers[questions[currentQ - 1].id] || null); }
                }}
              >
                ← Retour
              </button>
              <button
                className={`qz-btn-next${selected ? " ready" : ""}`}
                onClick={handleNext}
              >
                {currentQ < questions.length - 1 ? "Suivant →" : "Voir mon résultat →"}
              </button>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {screen === "result" && result && (
          <div className="qz-result-wrap">
            <div className="qz-result-header">
              <div className="qz-hero-badge">✅ Analyse complète</div>
              <h2>Notre recommandation pour vous</h2>
              <p>Basé sur vos réponses, voici le matelas qui vous correspond le mieux.</p>
            </div>

            {/* Answers summary */}
            <div className="qz-summary">
              {questions.map((q) => {
                const opt = q.options.find((o) => o.value === answers[q.id]);
                return opt ? (
                  <div className="qz-summary-item" key={q.id}>
                    <span>{opt.icon}</span>
                    {q.label} : {opt.label}
                  </div>
                ) : null;
              })}
            </div>

            {/* Result card */}
            <div className="qz-result-card">
              <div className="qz-result-img-wrap">
                <img src={result.img} alt={result.name} />
                <span className="qz-result-discount">{result.discount}</span>
              </div>
              <div className="qz-result-info">
                <span className="qz-result-type">{result.type}</span>
                <h3 className="qz-result-name">{result.name}</h3>
                <p className="qz-result-desc">{result.desc}</p>
                <div className="qz-result-features">
                  {result.features.map((f, i) => (
                    <span className="qz-feature-tag" key={i}>{f}</span>
                  ))}
                </div>
                <p className="qz-result-price">{result.price}</p>
                <div className="qz-result-btns">
                  <button className="qz-btn-primary">Voir le produit →</button>
                  <button className="qz-btn-ghost" onClick={restart}>
                    ↩ Recommencer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Quiz;