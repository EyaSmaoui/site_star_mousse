import React, { useMemo, useState } from "react";

const phases = [
  {
    id: "phase-1",
    label: "Phase 1",
    title: "Fondations credibilite & domaine",
    period: "Mois 1-2",
    theme: "Credibilite",
    features: [
      {
        name: "Domaine propre",
        description: "starmousse.tn + .com, canonical, sitemap et JSON-LD mis a jour.",
        tools: ["DNS", "Vercel"],
        guide: [
          "Acheter starmousse.tn, starmousse.com.tn et starmousse.com.",
          "Choisir un domaine principal selon la strategie locale ou export.",
          "Mettre a jour VITE_SITE_URL, canonical, sitemap, robots.txt et schema.org.",
        ],
        code: "VITE_SITE_URL=https://starmousse.tn",
      },
      {
        name: "Migration Next.js 15",
        description: "SSR + SSG, pages produits indexables et App Router.",
        tools: ["Next.js 15", "TypeScript"],
        guide: [
          "Creer une app Next.js parallele pour migrer sans bloquer le site actuel.",
          "Generer les pages produits via generateStaticParams.",
          "Conserver les routes e-commerce critiques avec redirections 301.",
        ],
        code: "export const revalidate = 3600;",
      },
      {
        name: "Multilingue fr/ar/en",
        description: "RTL arabe, hreflang et detection automatique de la langue visiteur.",
        tools: ["next-intl", "RTL"],
        guide: [
          "Structurer les routes en /fr, /ar et /en.",
          "Appliquer dir=rtl pour l'arabe au niveau du layout.",
          "Tester navigation, cartes, formulaires et prix en RTL.",
        ],
        code: '<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>',
      },
      {
        name: "Medias optimises",
        description: "WebP/AVIF, video hero sous 3 Mo, lazy load et images optimisees.",
        tools: ["FFmpeg", "next/image"],
        guide: [
          "Convertir les images catalogue en WebP/AVIF.",
          "Creer une video courte WebM/MP4 sous 3 Mo pour mobile.",
          "Charger les videos apres interaction ou apres le premier scroll.",
        ],
        code: "ffmpeg -i video1.mp4 -vf scale=1280:-2 -b:v 1200k hero.webm",
      },
    ],
  },
  {
    id: "phase-2",
    label: "Phase 2",
    title: "Confiance & conversion",
    period: "Mois 2-3",
    theme: "Preuve sociale",
    features: [
      {
        name: "Avis clients verifies",
        description: "Google Reviews integres, schema.org et photos reelles.",
        tools: ["schema.org", "Google API"],
        guide: [
          "Afficher les avis Google et les avis commandes verifiees.",
          "Ajouter AggregateRating uniquement si les donnees sont reelles.",
          "Publier photos clients/showroom pour renforcer la confiance.",
        ],
        code: '"aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8" }',
      },
      {
        name: "Tunnel de commande",
        description: "Taille, couleur, adresse, puis WhatsApp ou paiement.",
        tools: ["React", "Formik"],
        guide: [
          "Reduire le tunnel a une seule page mobile.",
          "Pre-remplir WhatsApp avec produit, taille, prix et adresse.",
          "Ajouter une option paiement en ligne seulement apres validation operationnelle.",
        ],
        code: "const steps = ['taille', 'adresse', 'confirmation'];",
      },
      {
        name: "Analytics serieux",
        description: "GA4, Meta Pixel, TikTok Pixel et evenements conversion.",
        tools: ["GA4", "Meta Pixel"],
        guide: [
          "Suivre view_item, add_to_cart, begin_checkout et purchase/lead.",
          "Mesurer appels, clics WhatsApp, formulaires B2B et panier abandonne.",
          "Creer un tableau hebdomadaire conversion par source.",
        ],
        code: "gtag('event', 'generate_lead', { lead_type: 'b2b_export' });",
      },
      {
        name: "Page B2B / Export",
        description: "Hotels, cliniques, distributeurs, formulaire pro et fiche PDF.",
        tools: ["PDF", "Email API"],
        guide: [
          "Qualifier nombre d'unites, pays, delai et type d'etablissement.",
          "Generer une fiche PDF avec gammes et specifications.",
          "Connecter le formulaire a WhatsApp Business ou a l'email commercial.",
        ],
        code: "POST /api/b2b-leads",
      },
    ],
  },
  {
    id: "phase-3",
    label: "Phase 3",
    title: "Innovation IA & 3D",
    period: "Mois 3-5",
    theme: "Experience",
    features: [
      {
        name: "Conseiller IA matelas",
        description: "Questions sur dos, poids, budget et recommandation du bon modele.",
        tools: ["Claude API", "Streaming"],
        guide: [
          "Limiter l'IA a un parcours guide pour eviter les reponses vagues.",
          "Mapper chaque reponse vers des produits et tailles reels.",
          "Tracer les recommandations pour mesurer le taux de conversion.",
        ],
        code: "recommend({ position, poids, budget, douleurDos })",
      },
      {
        name: "Visualiseur 3D",
        description: "Rotation 360, coupe transversale et couches mousse.",
        tools: ["Three.js", "GLTF"],
        guide: [
          "Demarrer avec un modele GLTF leger du matelas.",
          "Ajouter une vue coupe avec couches et labels.",
          "Prevoir fallback image pour les mobiles faibles.",
        ],
        code: "<Canvas><Model url='/models/matelas.glb' /></Canvas>",
      },
      {
        name: "Essai AR chambre",
        description: "Voir le matelas dans sa chambre via camera mobile.",
        tools: ["WebXR", "8thWall"],
        guide: [
          "Verifier la compatibilite mobile avant investissement lourd.",
          "Commencer par une experience WebXR simple avec taille reelle.",
          "Ajouter un bouton partager vers WhatsApp pour le devis.",
        ],
        code: "navigator.xr?.isSessionSupported('immersive-ar')",
      },
      {
        name: "Configurateur sur mesure",
        description: "Dimensions, fermete, tissu et prix calcule en temps reel.",
        tools: ["React", "Zustand"],
        guide: [
          "Definir les contraintes de fabrication avant l'interface.",
          "Calculer le prix selon dimensions, matiere et options.",
          "Envoyer la configuration dans le devis WhatsApp/B2B.",
        ],
        code: "price = base + surface * densityRate + optionsTotal;",
      },
    ],
  },
  {
    id: "phase-4",
    label: "Phase 4",
    title: "Plateforme B2B & dashboard",
    period: "Mois 5-8",
    theme: "Operation",
    features: [
      {
        name: "Dashboard B2B client",
        description: "Suivi commandes, factures PDF, historique et renouvellement.",
        tools: ["Next.js", "Prisma"],
        guide: [
          "Creer des comptes entreprise separes des comptes retail.",
          "Afficher devis, commandes, statuts et factures.",
          "Ajouter renouvellement rapide pour hotels et distributeurs.",
        ],
        code: "model BusinessAccount { id String @id @default(cuid()) }",
      },
      {
        name: "Paiement en ligne TN",
        description: "Konnect, Flouci, virement et paiement en plusieurs fois.",
        tools: ["Konnect", "Flouci"],
        guide: [
          "Activer d'abord paiement acompte pour grosses commandes.",
          "Garder le virement bancaire pour B2B.",
          "Tracer paiement, facture et statut commande dans le dashboard.",
        ],
        code: "createPayment({ amount, orderId, provider: 'konnect' })",
      },
      {
        name: "Notifications auto",
        description: "WhatsApp Business API: confirmation, livraison et SAV.",
        tools: ["WhatsApp API", "Webhooks"],
        guide: [
          "Utiliser des templates WhatsApp approuves.",
          "Declencher confirmation, expedition et suivi SAV.",
          "Centraliser les statuts via webhooks.",
        ],
        code: "POST /webhooks/whatsapp",
      },
      {
        name: "Fidelite & parrainage",
        description: "Points, codes promo et parrainage client.",
        tools: ["Custom", "Redis"],
        guide: [
          "Demarrer simple: code parrainage + remise prochaine commande.",
          "Limiter la gamification au retail, garder B2B oriente renouvellement.",
          "Mesurer cout de remise vs valeur client.",
        ],
        code: "referralCode = `${customerId.slice(0, 6)}SM`;",
      },
    ],
  },
];

const stack = [
  "Next.js 15",
  "TypeScript",
  "Tailwind CSS v4",
  "Three.js / R3F",
  "Claude API",
  "Prisma + PostgreSQL",
  "next-intl",
  "WebXR",
  "Vercel Edge",
  "Konnect Pay",
  "WhatsApp Business API",
  "Cloudinary",
];

const metrics = [
  { value: "6", label: "Modules innovants" },
  { value: "4", label: "Phases de deploiement" },
  { value: "3", label: "Marches cibles" },
  { value: "+3", label: "Langues" },
];

export default function InternationalRoadmap() {
  const allFeatures = useMemo(() => phases.flatMap((phase) => phase.features.map((feature) => ({
    ...feature,
    phase: phase.label,
    phaseTitle: phase.title,
  }))), []);

  const [activeFeature, setActiveFeature] = useState(allFeatures[0]);

  return (
    <>
      <style>{`
        .roadmap-page {
          background: #fbfaf8;
          color: #242436;
          font-family: "DM Sans", "Segoe UI", system-ui, -apple-system, sans-serif;
        }

        .roadmap-hero {
          max-width: 1280px;
          margin: 0 auto;
          padding: 76px 40px 54px;
          display: grid;
          grid-template-columns: minmax(0, 1.04fr) minmax(320px, 0.96fr);
          gap: 52px;
          align-items: center;
        }

        .roadmap-kicker {
          display: inline-flex;
          width: fit-content;
          border: 1px solid rgba(183, 139, 63,0.16);
          border-radius: 999px;
          background: #ffffff;
          color: #8f2f2f;
          font-size: 13px;
          font-weight: 900;
          padding: 8px 14px;
          margin-bottom: 22px;
        }

        .roadmap-hero h1 {
          max-width: 760px;
          color: #151522;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.45rem, 4.8vw, 4.7rem);
          line-height: 1.04;
          margin: 0 0 22px;
          letter-spacing: 0;
        }

        .roadmap-hero p {
          max-width: 650px;
          color: #5f6377;
          font-size: 16px;
          line-height: 1.8;
          margin: 0 0 30px;
        }

        .roadmap-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .roadmap-metric,
        .roadmap-card,
        .roadmap-guide,
        .roadmap-stack {
          background: rgba(255,255,255,0.92);
          border: 1px solid #ebe6df;
          border-radius: 8px;
          box-shadow: 0 18px 46px rgba(21,21,34,0.07);
        }

        .roadmap-metric {
          padding: 18px 16px;
        }

        .roadmap-metric strong {
          display: block;
          color: #151522;
          font-size: 25px;
          margin-bottom: 4px;
        }

        .roadmap-metric span {
          color: #6f7180;
          font-size: 12.5px;
          font-weight: 800;
        }

        .roadmap-visual {
          position: relative;
        }

        .roadmap-visual img {
          width: 100%;
          aspect-ratio: 1 / 0.86;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 28px 80px rgba(21,21,34,0.16);
          display: block;
        }

        .roadmap-visual-note {
          position: absolute;
          right: 20px;
          bottom: 20px;
          width: min(310px, calc(100% - 40px));
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(21,21,34,0.08);
          border-radius: 8px;
          padding: 16px;
          color: #5f6377;
          font-size: 13px;
          line-height: 1.55;
          box-shadow: 0 20px 44px rgba(21,21,34,0.13);
        }

        .roadmap-section {
          padding: 66px 40px;
          border-top: 1px solid #ebe6df;
        }

        .roadmap-section.alt {
          background: #ffffff;
        }

        .roadmap-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .roadmap-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(330px, 0.45fr);
          gap: 24px;
          align-items: start;
        }

        .roadmap-phases {
          display: grid;
          gap: 22px;
        }

        .roadmap-phase {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .roadmap-phase-side {
          position: sticky;
          top: 92px;
          background: #151522;
          color: #ffffff;
          border-radius: 8px;
          padding: 20px;
        }

        .roadmap-phase-side span {
          color: #f4c84f;
          display: block;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .roadmap-phase-side h2 {
          font-size: 19px;
          line-height: 1.25;
          margin: 0 0 12px;
        }

        .roadmap-phase-side p {
          color: #d8d4cc;
          margin: 0;
          font-size: 13px;
          font-weight: 800;
        }

        .roadmap-feature-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .roadmap-card {
          width: 100%;
          min-height: 174px;
          text-align: left;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }

        .roadmap-card:hover,
        .roadmap-card.active {
          transform: translateY(-2px);
          border-color: rgba(183, 139, 63,0.34);
          box-shadow: 0 22px 58px rgba(21,21,34,0.12);
        }

        .roadmap-card h3 {
          color: #151522;
          font-size: 17px;
          margin: 0 0 10px;
        }

        .roadmap-card p {
          color: #666a78;
          font-size: 13.5px;
          line-height: 1.58;
          margin: 0 0 16px;
        }

        .roadmap-tools {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .roadmap-tools span,
        .roadmap-stack span {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          background: #fff5cf;
          color: #151522;
          border: 1px solid rgba(244,200,79,0.42);
          padding: 6px 10px;
          font-size: 11.5px;
          font-weight: 900;
        }

        .roadmap-guide {
          position: sticky;
          top: 92px;
          padding: 24px;
        }

        .roadmap-guide small {
          color: #8f2f2f;
          font-weight: 900;
          text-transform: uppercase;
        }

        .roadmap-guide h2 {
          color: #151522;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          line-height: 1.15;
          margin: 10px 0 12px;
        }

        .roadmap-guide p {
          color: #666a78;
          line-height: 1.65;
          margin: 0 0 18px;
        }

        .roadmap-guide ol {
          display: grid;
          gap: 10px;
          color: #404253;
          line-height: 1.55;
          margin: 0 0 18px;
          padding-left: 22px;
        }

        .roadmap-code {
          background: #151522;
          color: #f7f1e8;
          border-radius: 8px;
          padding: 14px;
          font-family: Consolas, "Courier New", monospace;
          font-size: 12.5px;
          overflow-x: auto;
        }

        .roadmap-stack {
          padding: 26px;
        }

        .roadmap-stack h2 {
          color: #151522;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.9rem, 3vw, 2.8rem);
          margin: 0 0 16px;
        }

        .roadmap-stack p {
          color: #666a78;
          line-height: 1.7;
          margin: 0 0 22px;
        }

        .roadmap-stack-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        @media (max-width: 1080px) {
          .roadmap-hero,
          .roadmap-grid {
            grid-template-columns: 1fr;
          }

          .roadmap-guide {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .roadmap-hero,
          .roadmap-section {
            padding-left: 18px;
            padding-right: 18px;
          }

          .roadmap-metrics,
          .roadmap-feature-grid,
          .roadmap-phase {
            grid-template-columns: 1fr;
          }

          .roadmap-phase-side {
            position: static;
          }

          .roadmap-visual-note {
            position: static;
            width: 100%;
            margin-top: 12px;
          }
        }
      `}</style>

      <div className="roadmap-page">

        <section className="roadmap-hero">
          <div>
            <span className="roadmap-kicker">Roadmap internationale 2026</span>
            <h1>Passer de site local a plateforme literie internationale.</h1>
            <p>
              Une trajectoire en quatre phases pour renforcer la credibilite, augmenter la
              conversion, ajouter des experiences IA/3D et structurer le B2B.
            </p>
            <div className="roadmap-metrics">
              {metrics.map((metric) => (
                <div className="roadmap-metric" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="roadmap-visual">
            <img
              src="/showroom5.jpg"
              alt="Showroom Star Mousse comme base de developpement international"
              width="620"
              height="530"
              loading="eager"
              decoding="async"
            />
            <div className="roadmap-visual-note">
              Cliquez sur une fonctionnalite pour afficher les etapes, la stack et un point de depart technique.
            </div>
          </div>
        </section>

        <section className="roadmap-section alt">
          <div className="roadmap-inner roadmap-grid">
            <div className="roadmap-phases">
              {phases.map((phase) => (
                <article className="roadmap-phase" key={phase.id}>
                  <aside className="roadmap-phase-side">
                    <span>{phase.label} - {phase.theme}</span>
                    <h2>{phase.title}</h2>
                    <p>{phase.period}</p>
                  </aside>

                  <div className="roadmap-feature-grid">
                    {phase.features.map((feature) => {
                      const isActive = activeFeature.name === feature.name;
                      return (
                        <button
                          type="button"
                          className={`roadmap-card${isActive ? " active" : ""}`}
                          key={feature.name}
                          onClick={() => setActiveFeature({
                            ...feature,
                            phase: phase.label,
                            phaseTitle: phase.title,
                          })}
                        >
                          <h3>{feature.name}</h3>
                          <p>{feature.description}</p>
                          <div className="roadmap-tools">
                            {feature.tools.map((tool) => (
                              <span key={tool}>{tool}</span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>

            <aside className="roadmap-guide" aria-live="polite">
              <small>{activeFeature.phase} - {activeFeature.phaseTitle}</small>
              <h2>{activeFeature.name}</h2>
              <p>{activeFeature.description}</p>
              <ol>
                {activeFeature.guide.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="roadmap-code">{activeFeature.code}</div>
            </aside>
          </div>
        </section>

        <section className="roadmap-section">
          <div className="roadmap-inner">
            <div className="roadmap-stack">
              <h2>Stack technologique recommandee 2026</h2>
              <p>
                Une stack moderne, orientee SEO, commerce, B2B, IA et experiences immersives,
                avec une trajectoire realiste depuis l'application React actuelle.
              </p>
              <div className="roadmap-stack-list">
                {stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

