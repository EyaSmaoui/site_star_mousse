import React, { useState } from 'react';
import GoogleMapsEmbed from '../components/GoogleMapsEmbed';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0,8);
      setFormData(prev => ({ ...prev, [name]: digits }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate phone if provided
    if (formData.phone && formData.phone.toString().replace(/\D/g, '').length !== 8) {
      alert('Le numéro de téléphone doit contenir exactement 8 chiffres.');
      return;
    }
    // For now, just show success message
    // In production, this would send to backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <style>{`
        .contact-page {
          background: white;
          min-height: 100vh;
          padding: 40px 20px;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 50px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .contact-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
          font-family: "Syne", sans-serif;
        }

        .contact-header p {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
        }

        .contact-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .contact-section {
          margin-bottom: 50px;
        }

        .contact-form-wrapper {
          background: #fbfaf8;
          padding: 40px;
          border-radius: 12px;
          margin-bottom: 50px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s ease;
          background: white;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #b52f2f;
          box-shadow: 0 0 0 3px rgba(181, 47, 47, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-buttons {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .btn-submit {
          flex: 1;
          padding: 14px 24px;
          background: #b52f2f;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-submit:hover {
          background: #8f2424;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(181, 47, 47, 0.3);
        }

        .btn-reset {
          padding: 14px 24px;
          background: white;
          color: #333;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-reset:hover {
          border-color: #b52f2f;
          color: #b52f2f;
        }

        .success-message {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .contact-info-card {
          background: #fbfaf8;
          padding: 24px;
          border-radius: 12px;
          border-left: 4px solid #b52f2f;
          text-align: center;
        }

        .contact-info-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .contact-info-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .contact-info-value {
          font-size: 14px;
          color: #666;
          word-break: break-word;
        }

        .contact-info-value a {
          color: #b52f2f;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .contact-info-value a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .contact-page {
            padding: 24px 16px;
          }

          .contact-header h1 {
            font-size: 28px;
          }

          .contact-form-wrapper {
            padding: 24px;
          }

          .form-buttons {
            flex-direction: column;
          }

          .btn-submit,
          .btn-reset {
            width: 100%;
          }

          .contact-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="contact-header">
        <h1>📞 Contactez-Nous</h1>
        <p>Vous avez une question? Nous sommes là pour vous aider! Remplissez le formulaire ci-dessous ou appelez-nous directement.</p>
      </div>

      <div className="contact-content">
        <div className="contact-section">
          <div className="contact-form-wrapper">
            {submitted && (
              <div className="success-message">
                ✅ Votre message a été envoyé avec succès! Nous vous répondrons bientôt.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label htmlFor="name">Nom Complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="22 900 131"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Sujet *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Information sur les matelas"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  📧 Envoyer le message
                </button>
                <button type="reset" className="btn-reset" onClick={() => setFormData({ name: '', email: '', phone: '', subject: '', message: '' })}>
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>

          <GoogleMapsEmbed />

          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon">📍</div>
              <div className="contact-info-title">Adresse</div>
              <div className="contact-info-value">Borj Chakir, Tunis, Tunisie</div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">📞</div>
              <div className="contact-info-title">Téléphone</div>
              <div className="contact-info-value">
                <a href="tel:+21622900131">22 900 131</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">💬</div>
              <div className="contact-info-title">WhatsApp</div>
              <div className="contact-info-value">
                <a href="https://wa.me/21622900207">22 900 207</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">📧</div>
              <div className="contact-info-title">Email</div>
              <div className="contact-info-value">
                <a href="/contact">Formulaire de contact</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">⏰</div>
              <div className="contact-info-title">Horaires</div>
              <div className="contact-info-value">
                Lun-Sam: 8h-18h<br />
                Dim: 10h-16h
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">🚚</div>
              <div className="contact-info-title">Livraison</div>
              <div className="contact-info-value">
                Gratuite en Tunisie<br />
                2-3 jours ouvrables
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
