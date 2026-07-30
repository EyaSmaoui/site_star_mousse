import React, { useMemo, useState } from "react";

const initialForm = {
  company: "",
  contact: "",
  phone: "",
  email: "",
  establishmentType: "",
  units: "",
  country: "",
  deadline: "",
  message: "",
};

const sectors = [
  "Hotel",
  "Clinique",
  "Residence",
  "Distributeur",
  "Projet immobilier",
  "Autre",
];

const capabilities = [
  {
    value: "Matelas hotellerie",
    detail: "Gammes fermes, pillow top et orthopediques pour chambres standard, suites et residences.",
  },
  {
    value: "Dimensions sur mesure",
    detail: "Adaptation aux lits existants, appels d'offres et cahiers des charges professionnels.",
  },
  {
    value: "Accessoires literie",
    detail: "Oreillers medicaux, protege-matelas et solutions mousse pour equiper les chambres completes.",
  },
  {
    value: "Livraison projet",
    detail: "Preparation par lot, coordination delais et accompagnement pour projets en Tunisie ou export.",
  },
];

const proofPoints = [
  "Showroom et conseil professionnel a Borj Chakir, Tunis",
  "Paiement et livraison adaptes aux commandes en volume",
  "Selection de fermetes pour hotellerie, sante et distribution",
  "Devis personnalise selon quantite, dimensions et pays de livraison",
];

export default function B2BExport() {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);

  const whatsappText = useMemo(() => {
    const lines = [
      "Bonjour Star Mousse, je souhaite un devis B2B/export.",
      `Entreprise: ${form.company || "-"}`,
      `Contact: ${form.contact || "-"}`,
      `Telephone: ${form.phone || "-"}`,
      `Email: ${form.email || "-"}`,
      `Type d'etablissement: ${form.establishmentType || "-"}`,
      `Nombre d'unites: ${form.units || "-"}`,
      `Pays de livraison: ${form.country || "-"}`,
      `Delai souhaite: ${form.deadline || "-"}`,
      `Message: ${form.message || "-"}`,
    ];

    return encodeURIComponent(lines.join("\n"));
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? value.replace(/[^\d+ ]/g, "").slice(0, 18) : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    window.open(`https://wa.me/21622900207?text=${whatsappText}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <style>{`
        .b2b-page {
          background: #fbfaf8;
          color: #242436;
          font-family: "DM Sans", "Segoe UI", system-ui, -apple-system, sans-serif;
        }

        .b2b-hero {
          min-height: 620px;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
          gap: 56px;
          align-items: center;
          max-width: 1280px;
          margin: 0 auto;
          padding: 78px 40px 72px;
        }

        .b2b-kicker,
        .b2b-section-kicker {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          border: 1px solid rgba(183, 139, 63, 0.16);
          border-radius: 999px;
          background: #ffffff;
          color: #8f2f2f;
          font-size: 13px;
          font-weight: 800;
          padding: 8px 14px;
          margin-bottom: 22px;
        }

        .b2b-hero h1 {
          max-width: 680px;
          color: #151522;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.55rem, 5vw, 4.8rem);
          line-height: 1.04;
          letter-spacing: 0;
          margin: 0 0 24px;
        }

        .b2b-hero p {
          max-width: 610px;
          color: #5f6377;
          font-size: 16px;
          line-height: 1.8;
          margin: 0 0 30px;
        }

        .b2b-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 34px;
        }

        .b2b-btn {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid #151522;
          padding: 0 20px;
          font: inherit;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .b2b-btn.primary {
          background: #151522;
          color: #ffffff;
        }

        .b2b-btn.secondary {
          background: #ffffff;
          color: #151522;
          border-color: rgba(21, 21, 34, 0.14);
        }

        .b2b-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 34px rgba(21, 21, 34, 0.12);
        }

        .b2b-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          max-width: 620px;
        }

        .b2b-stat {
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(21,21,34,0.08);
          border-radius: 8px;
          padding: 18px;
        }

        .b2b-stat strong {
          display: block;
          color: #151522;
          font-size: 20px;
          margin-bottom: 4px;
        }

        .b2b-stat span {
          color: #6f7180;
          font-size: 12.5px;
          font-weight: 700;
        }

        .b2b-visual {
          position: relative;
          min-height: 520px;
        }

        .b2b-visual img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 28px 80px rgba(21,21,34,0.16);
          display: block;
        }

        .b2b-floating {
          position: absolute;
          left: -22px;
          bottom: 24px;
          width: min(320px, 82%);
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(21,21,34,0.08);
          border-radius: 8px;
          padding: 18px;
          box-shadow: 0 22px 56px rgba(21,21,34,0.15);
        }

        .b2b-floating strong {
          display: block;
          color: #151522;
          margin-bottom: 6px;
        }

        .b2b-floating span {
          color: #5f6377;
          font-size: 13px;
          line-height: 1.55;
        }

        .b2b-section {
          padding: 78px 40px;
          border-top: 1px solid #ebe6df;
          background: #ffffff;
        }

        .b2b-section.alt {
          background: linear-gradient(180deg, #ffffff 0%, #f8f3ed 100%);
        }

        .b2b-inner {
          max-width: 1180px;
          margin: 0 auto;
        }

        .b2b-section-head {
          max-width: 720px;
          margin-bottom: 34px;
        }

        .b2b-section-head h2 {
          color: #151522;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2rem, 3.2vw, 3rem);
          line-height: 1.12;
          margin: 0 0 14px;
        }

        .b2b-section-head p {
          color: #666a78;
          line-height: 1.75;
          margin: 0;
        }

        .b2b-capabilities {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .b2b-capability,
        .b2b-proof,
        .b2b-form-panel {
          background: #ffffff;
          border: 1px solid #ebe6df;
          border-radius: 8px;
          box-shadow: 0 18px 46px rgba(21,21,34,0.07);
        }

        .b2b-capability {
          padding: 22px;
        }

        .b2b-capability strong {
          display: block;
          color: #151522;
          margin-bottom: 10px;
        }

        .b2b-capability p,
        .b2b-proof li {
          color: #666a78;
          font-size: 14px;
          line-height: 1.65;
          margin: 0;
        }

        .b2b-proof {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 0;
          overflow: hidden;
        }

        .b2b-proof img {
          width: 100%;
          height: 100%;
          min-height: 360px;
          object-fit: cover;
          display: block;
        }

        .b2b-proof-content {
          padding: 34px;
        }

        .b2b-proof-content h3 {
          color: #151522;
          font-size: 22px;
          margin: 0 0 16px;
        }

        .b2b-proof ul {
          display: grid;
          gap: 14px;
          padding-left: 18px;
          margin: 0;
        }

        .b2b-form-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.78fr) minmax(340px, 1fr);
          gap: 28px;
          align-items: start;
        }

        .b2b-form-copy {
          padding: 8px 0;
        }

        .b2b-form-copy h2 {
          color: #151522;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          line-height: 1.12;
          margin: 0 0 16px;
        }

        .b2b-form-copy p {
          color: #666a78;
          line-height: 1.75;
          margin: 0 0 20px;
        }

        .b2b-form-panel {
          padding: 26px;
        }

        .b2b-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .b2b-field.full {
          grid-column: 1 / -1;
        }

        .b2b-field label {
          display: block;
          color: #4c4f5f;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .b2b-field input,
        .b2b-field select,
        .b2b-field textarea {
          width: 100%;
          border: 1px solid #ded8cf;
          border-radius: 8px;
          background: #ffffff;
          color: #151522;
          font: inherit;
          font-size: 14px;
          padding: 12px 13px;
          outline: none;
        }

        .b2b-field textarea {
          min-height: 110px;
          resize: vertical;
        }

        .b2b-field input:focus,
        .b2b-field select:focus,
        .b2b-field textarea:focus {
          border-color: #8f2f2f;
          box-shadow: 0 0 0 4px rgba(183, 139, 63,0.08);
        }

        .b2b-form-note {
          color: #6f7180;
          font-size: 12.5px;
          line-height: 1.6;
          margin: 14px 0 0;
        }

        .b2b-success {
          border: 1px solid rgba(37, 128, 83, 0.2);
          background: #eef8f1;
          color: #236b43;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 14px;
        }

        @media (max-width: 980px) {
          .b2b-hero,
          .b2b-form-layout,
          .b2b-proof {
            grid-template-columns: 1fr;
          }

          .b2b-hero {
            padding: 54px 24px 60px;
          }

          .b2b-visual,
          .b2b-visual img {
            min-height: auto;
            height: auto;
          }

          .b2b-capabilities {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .b2b-floating {
            left: 18px;
          }
        }

        @media (max-width: 620px) {
          .b2b-section {
            padding: 54px 18px;
          }

          .b2b-stats,
          .b2b-capabilities,
          .b2b-form-grid {
            grid-template-columns: 1fr;
          }

          .b2b-hero {
            padding: 42px 18px 52px;
          }

          .b2b-actions .b2b-btn {
            width: 100%;
          }

          .b2b-floating {
            position: static;
            width: 100%;
            margin-top: 12px;
          }

          .b2b-form-panel,
          .b2b-proof-content {
            padding: 20px;
          }
        }
      `}</style>

      <div className="b2b-page">

        <section className="b2b-hero">
          <div>
            <span className="b2b-kicker">B2B & Export</span>
            <h1>Literie professionnelle pour hotels, cliniques et distributeurs.</h1>
            <p>
              Star Mousse accompagne les projets de literie en volume: matelas pour chambres
              d'hotel, cliniques, residences, distributeurs et projets immobiliers en Tunisie
              ou a l'export.
            </p>
            <div className="b2b-actions">
              <a className="b2b-btn primary" href="#devis-pro">Demander un devis pro</a>
              <a className="b2b-btn secondary" href="tel:+21622900131">Appeler le service commercial</a>
            </div>
            <div className="b2b-stats" aria-label="Avantages Star Mousse pour professionnels">
              <div className="b2b-stat">
                <strong>10 ans</strong>
                <span>garantie selon gamme</span>
              </div>
              <div className="b2b-stat">
                <strong>Sur mesure</strong>
                <span>dimensions et fermetes</span>
              </div>
              <div className="b2b-stat">
                <strong>Volume</strong>
                <span>devis par quantite</span>
              </div>
            </div>
          </div>

          <div className="b2b-visual">
            <img
              src="/showroom1.jpg"
              alt="Showroom Star Mousse pour projets de literie professionnelle"
              width="620"
              height="520"
              loading="eager"
              decoding="async"
            />
            <div className="b2b-floating">
              <strong>Un interlocuteur pour votre projet</strong>
              <span>Quantite, delai, pays de livraison et specifications techniques sont centralises dans une demande claire.</span>
            </div>
          </div>
        </section>

        <section className="b2b-section alt">
          <div className="b2b-inner">
            <header className="b2b-section-head">
              <span className="b2b-section-kicker">Solutions professionnelles</span>
              <h2>Des gammes adaptees aux usages intensifs.</h2>
              <p>
                Les besoins d'un hotel, d'une clinique ou d'un distributeur ne sont pas les memes.
                La page B2B qualifie les projets avant le premier contact pour accelerer le devis.
              </p>
            </header>

            <div className="b2b-capabilities">
              {capabilities.map((item) => (
                <article className="b2b-capability" key={item.value}>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="b2b-section">
          <div className="b2b-inner">
            <div className="b2b-proof">
              <img
                src="/showroom6.jpg"
                alt="Espace showroom Star Mousse et conseil literie"
                width="520"
                height="380"
                loading="lazy"
                decoding="async"
              />
              <div className="b2b-proof-content">
                <span className="b2b-section-kicker">Pourquoi Star Mousse</span>
                <h3>Une offre lisible pour les acheteurs professionnels.</h3>
                <ul>
                  {proofPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="b2b-section alt" id="devis-pro">
          <div className="b2b-inner">
            <div className="b2b-form-layout">
              <div className="b2b-form-copy">
                <span className="b2b-section-kicker">Devis professionnel</span>
                <h2>Qualifiez votre demande en moins de deux minutes.</h2>
                <p>
                  Le formulaire ouvre WhatsApp avec les informations deja structurees. L'equipe
                  commerciale peut repondre plus vite avec une proposition adaptee.
                </p>
                <p>
                  Champs prioritaires: nombre d'unites, type d'etablissement, delai souhaite
                  et pays de livraison.
                </p>
              </div>

              <form className="b2b-form-panel" onSubmit={handleSubmit}>
                {sent && (
                  <div className="b2b-success">
                    Votre demande est prete dans WhatsApp. Envoyez le message pour finaliser la prise de contact.
                  </div>
                )}

                <div className="b2b-form-grid">
                  <div className="b2b-field">
                    <label htmlFor="company">Entreprise</label>
                    <input id="company" name="company" value={form.company} onChange={handleChange} required placeholder="Nom de l'entreprise" />
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="contact">Contact</label>
                    <input id="contact" name="contact" value={form.contact} onChange={handleChange} required placeholder="Nom du responsable" />
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="phone">Telephone</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+216 22 900 131" />
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="contact@entreprise.com" />
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="establishmentType">Etablissement</label>
                    <select id="establishmentType" name="establishmentType" value={form.establishmentType} onChange={handleChange} required>
                      <option value="">Choisir</option>
                      {sectors.map((sector) => (
                        <option value={sector} key={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="units">Unites</label>
                    <input id="units" name="units" type="number" min="1" value={form.units} onChange={handleChange} required placeholder="Ex: 200" />
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="country">Pays de livraison</label>
                    <input id="country" name="country" value={form.country} onChange={handleChange} required placeholder="Tunisie, Libye, Algerie..." />
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="deadline">Delai souhaite</label>
                    <input id="deadline" name="deadline" value={form.deadline} onChange={handleChange} placeholder="Ex: avant septembre" />
                  </div>

                  <div className="b2b-field full">
                    <label htmlFor="message">Details du projet</label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Dimensions, niveau de fermete, budget, contraintes de livraison..." />
                  </div>
                </div>

                <button type="submit" className="b2b-btn primary" style={{ width: "100%", marginTop: 18 }}>
                  Envoyer la demande sur WhatsApp
                </button>
                <p className="b2b-form-note">
                  Pour les appels d'offres, ajoutez les dimensions, la quantite par taille et le calendrier de livraison.
                </p>
              </form>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

