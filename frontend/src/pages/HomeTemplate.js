import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCloud,
  FiClock,
  FiHeart,
  FiHeadphones,
  FiMoon,
  FiSmile,
  FiShield,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { getCatalogProducts } from "../services/productCatalog";
import httpClient from "../services/httpClient";
import AccessibleLottie from "../components/AccessibleLottie";
import babyAnimation from "../assets/lottie/baby.json";

const fallbackProducts = [
  {
    name: "Relax Plus",
    type: "Matelas ergonomique · Soutien équilibré",
    price: "À partir de 530 DT",
    badge: "Le plus choisi",
    features: "18 cm · Accueil équilibré",
    image: "/relax.png",
    to: "/product/relax-plus",
  },
  {
    name: "Medico Plus",
    type: "Matelas orthomédical · Maintien renforcé",
    price: "À partir de 440 DT",
    badge: "Populaire",
    features: "25 cm · Soutien ferme",
    image: "/medico.jpg",
    to: "/product/medico-plus",
  },
  {
    name: "Tendresse",
    type: "Matelas ergonomique · Accueil moelleux",
    price: "À partir de 730 DT",
    badge: "Nouveau",
    features: "30 cm · Accueil moelleux",
    image: "/tendresse.jpg",
    to: "/product/tendresse",
  },
];

const quizQuestions = [
  {
    title: "Dans quelle position dormez-vous le plus souvent ?",
    hint: "Cela nous aide à définir votre besoin de soutien.",
    options: [
      { label: "Sur le côté", icon: FiHeart },
      { label: "Sur le dos", icon: FiMoon },
      { label: "Sur le ventre", icon: FiCloud },
      { label: "Je bouge beaucoup", icon: FiSmile },
    ],
  },
  {
    title: "Quel accueil préférez-vous ?",
    hint: "Il n'y a pas de mauvaise réponse.",
    options: [
      { label: "Très moelleux", icon: FiCloud },
      { label: "Équilibré", icon: FiSmile },
      { label: "Plutôt ferme", icon: FiShield },
      { label: "Je ne sais pas", icon: FiHeadphones },
    ],
  },
  {
    title: "Quel est votre principal défi sommeil ?",
    hint: "Nous adapterons notre conseil à votre besoin.",
    options: [
      { label: "Mal de dos", icon: FiShield },
      { label: "J'ai souvent chaud", icon: FiCloud },
      { label: "Sommeil à deux", icon: FiHeart },
      { label: "Mieux récupérer", icon: FiMoon },
    ],
  },
];

const benefits = [
  { title: "Livraison rapide", text: "Partout en Tunisie", icon: FiTruck },
  { title: "10 ans de garantie", text: "Sur une sélection de matelas", icon: FiShield },
  { title: "Paiement à la livraison", text: "Commandez en toute sérénité", icon: FiClock },
  { title: "Conseils d'experts", text: "À votre écoute 6j/7", icon: FiHeadphones },
];

const sleepPaths = [
  {
    tag: "Je cherche",
    title: "Un meilleur soutien",
    text: "Des matelas ergonomiques pour aligner confort et récupération.",
    to: "/nos-matelas",
    tone: "green",
  },
  {
    tag: "Je veux",
    title: "Un cocon complet",
    text: "Oreillers, linge et meubles pour créer une chambre qui vous ressemble.",
    to: "/products",
    tone: "sand",
  },
  {
    tag: "J'hésite",
    title: "Être bien conseillé",
    text: "Notre quiz vous guide vers le confort adapté à vos habitudes.",
    to: "/quiz",
    tone: "orange",
  },
];

function HomeTemplate() {
  const [products, setProducts] = useState(fallbackProducts);
  const [testimonials, setTestimonials] = useState([]);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const currentQuestion = quizQuestions[quizStep];
  const activeTestimonial = testimonials[testimonialIndex] || {
    quote: "Découvrez les avis de nos clients après leur achat.",
    name: "Avis clients",
    location: "Star Mousse",
  };

  useEffect(() => {
    let active = true;
    getCatalogProducts().then((catalog) => {
      if (!active || !catalog.length) return;
      setProducts(catalog.slice(0, 3).map((product) => ({
        name: product.name.replace(/^Matelas\s+/i, ""),
        type: product.category || "Matelas Star Mousse",
        price: `À partir de ${product.price.toLocaleString("fr-FR")} DT`,
        badge: product.reviewCount ? "Avis clients" : "Collection Star Mousse",
        features: product.dimensions?.height ? `${product.dimensions.height} cm` : "Confort durable",
        image: product.image,
        to: `/product/${product.slug}`,
      })));
    }).catch(() => {});
    httpClient.get("/api/reviews/getAllReviews")
      .then((response) => response.data)
      .then((data) => {
        if (!active || !Array.isArray(data)) return;
        const verifiedReviews = data.filter((review) => review.comment && review.user);
        setTestimonials(verifiedReviews.slice(0, 5).map((review) => ({
          quote: review.comment,
          name: review.user.username || "Client Star Mousse",
          location: review.product?.name || "Client vérifié",
        })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const selectQuizAnswer = (answer) => {
    const nextAnswers = [...quizAnswers];
    nextAnswers[quizStep] = answer;
    setQuizAnswers(nextAnswers);
  };

  const nextQuizStep = () => {
    if (!quizAnswers[quizStep]) return;
    if (quizStep === quizQuestions.length - 1) {
      setQuizComplete(true);
      return;
    }
    setQuizStep((step) => step + 1);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizComplete(false);
  };

  return (
    <main className="sm-home-template">
      <section className="sm-template-hero" aria-labelledby="home-template-title">
        <div className="sm-template-hero-copy">
          <p className="sm-template-eyebrow">
            <span aria-hidden="true" /> Le confort depuis 2017
          </p>
          <h1 id="home-template-title">
            Vos plus belles nuits
            <em>commencent ici.</em>
          </h1>
          <p className="sm-template-hero-description">
            Des matelas conçus en Tunisie, avec exigence et savoir-faire, pour
            un sommeil plus profond et des réveils plus légers.
          </p>
          <div className="sm-template-actions">
            <Link className="sm-template-button sm-template-button-primary" to="/products">
              Découvrir nos matelas <FiArrowUpRight aria-hidden="true" />
            </Link>
            <Link className="sm-template-text-link" to="/quiz">
              Trouver mon confort <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="sm-template-proof">
            <div>
              <div className="sm-template-stars" aria-label="Avis clients">★★★★★</div>
              <p><strong>Avis clients</strong> · Retours partagés après achat</p>
            </div>
          </div>
        </div>
        <div className="sm-template-hero-visual">
          <img
            src="/sleeping_home.jpg"
            alt="Personne dormant sereinement dans une chambre lumineuse"
            width="960"
            height="570"
          />
          <div className="sm-template-hero-badge">
            <strong>10</strong>
            <span>ans</span>
            <small>sur une sélection</small>
          </div>
          <AccessibleLottie className="sm-template-hero-baby-avatar" animationData={babyAnimation} label="Avatar animé bébé" />
          <div className="sm-template-image-caption">
            <span aria-hidden="true" /> Collection Star Mousse
          </div>
          <Link className="sm-template-hero-floating-card" to="/nos-matelas">
            <span>Votre confort</span>
            <strong>Commence par<br />le bon soutien.</strong>
            <span className="sm-template-floating-link">Explorer <FiArrowUpRight aria-hidden="true" /></span>
          </Link>
        </div>
      </section>

      <section className="sm-template-benefits" aria-label="Nos engagements">
        <div className="sm-template-container sm-template-benefits-grid">
          {benefits.map(({ title, text, icon: Icon }) => (
            <article key={title}>
              <div className="sm-template-benefit-icon"><Icon aria-hidden="true" /></div>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sm-template-paths" aria-labelledby="sleep-paths-title">
        <div className="sm-template-container">
          <div className="sm-template-section-heading sm-template-paths-heading">
            <div>
              <p className="sm-template-eyebrow"><span aria-hidden="true" /> Par où commencer ?</p>
              <h2 id="sleep-paths-title">Votre sommeil,<br />à votre façon.</h2>
            </div>
            <p>Un parcours simple pour trouver rapidement les produits et les conseils qui correspondent à votre quotidien.</p>
          </div>
          <div className="sm-template-path-grid">
            {sleepPaths.map((path, index) => (
              <Link className={`sm-template-path-card sm-template-path-${path.tone}`} to={path.to} key={path.title}>
                <span className="sm-template-path-number">0{index + 1}</span>
                <small>{path.tag}</small>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
                <span className="sm-template-path-action">
                  {index === 0 ? "Trouver mon matelas" : index === 1 ? "Composer ma chambre" : "Faire le quiz"}
                  <FiArrowUpRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sm-template-products" aria-labelledby="best-sellers-title">
        <div className="sm-template-container">
          <div className="sm-template-section-heading">
            <div>
              <p className="sm-template-eyebrow"><span aria-hidden="true" /> Les essentiels Star Mousse</p>
              <h2 id="best-sellers-title">Nos matelas préférés</h2>
            </div>
            <Link className="sm-template-text-link" to="/products">Voir toute la collection <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className="sm-template-product-grid">
            {products.map((product) => (
              <article className="sm-template-product-card" key={product.name}>
                <Link to={product.to} className="sm-template-product-image">
                  <img src={product.image} alt={product.name} width="600" height="310" loading="lazy" decoding="async" />
                  <span>{product.badge}</span>
                </Link>
                <div className="sm-template-product-body">
                  <p>{product.type}</p>
                  <h3>{product.name}</h3>
                  <p className="sm-template-product-features">{product.features}</p>
                  <div>
                    <strong>{product.price}</strong>
                    <Link className="sm-template-product-link" to={product.to}>
                      Voir le matelas <FiArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sm-template-testimonial" aria-label="Avis clients">
        <div className="sm-template-container sm-template-testimonial-inner">
          <div className="sm-template-quote-mark" aria-hidden="true">“</div>
          <div className="sm-template-testimonial-content">
            <p className="sm-template-eyebrow sm-template-eyebrow-light"><span aria-hidden="true" /> Ils dorment mieux</p>
            <blockquote>{activeTestimonial.quote}</blockquote>
            <p className="sm-template-testimonial-author">
              <span className="sm-template-testimonial-avatar" aria-hidden="true"><FiUser /></span>
              <span><strong>{activeTestimonial.name}</strong> · {activeTestimonial.location}</span>
            </p>
          </div>
          <div className="sm-template-carousel-controls">
            <button type="button" disabled={!testimonials.length} onClick={() => setTestimonialIndex((index) => (index - 1 + testimonials.length) % testimonials.length)} aria-label="Avis précédent">←</button>
            <span>{testimonials.length ? `${testimonialIndex + 1} / ${testimonials.length}` : "Avis vérifiés"}</span>
            <button type="button" disabled={!testimonials.length} onClick={() => setTestimonialIndex((index) => (index + 1) % testimonials.length)} aria-label="Avis suivant">→</button>
          </div>
        </div>
      </section>

      <section className="sm-template-quiz" id="quiz-confort" aria-labelledby="quiz-title">
        <div className="sm-template-container sm-template-quiz-card">
          {!quizComplete ? (
            <>
              <div className="sm-template-quiz-heading">
                <p className="sm-template-eyebrow"><span aria-hidden="true" /> Le quiz confort</p>
                    <span>Question {quizStep + 1} sur {quizQuestions.length}</span>
                <div className="sm-template-progress"><span style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }} /></div>
                <h2 id="quiz-title">{currentQuestion.title}</h2>
                <p>{currentQuestion.hint}</p>
              </div>
              <div className="sm-template-quiz-options">
                {currentQuestion.options.map(({ label: option, icon: Icon }) => (
                  <button type="button" className={quizAnswers[quizStep] === option ? "is-selected" : ""} key={option} onClick={() => selectQuizAnswer(option)}>
                    <Icon aria-hidden="true" />
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              <div className="sm-template-quiz-actions">
                <button type="button" className="sm-template-button sm-template-button-primary" onClick={nextQuizStep} disabled={!quizAnswers[quizStep]}>
                  {quizStep === quizQuestions.length - 1 ? "Voir ma recommandation" : "Continuer"}
                </button>
              </div>
            </>
          ) : (
            <div className="sm-template-quiz-result">
              <p className="sm-template-eyebrow"><span aria-hidden="true" /> Votre recommandation</p>
              <h2>Le Relax Plus pour retrouver un sommeil équilibré.</h2>
              <p>Votre profil correspond à un soutien ergonomique polyvalent, confortable et durable.</p>
              <div className="sm-template-quiz-result-actions">
                <Link className="sm-template-button sm-template-button-primary" to="/product/relax-plus">Découvrir Relax Plus</Link>
                <button type="button" className="sm-template-text-link" onClick={resetQuiz}>Recommencer le quiz</button>
              </div>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}

export default HomeTemplate;
