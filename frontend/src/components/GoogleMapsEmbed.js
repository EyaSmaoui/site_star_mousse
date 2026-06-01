import React from 'react';

export default function GoogleMapsEmbed() {
  const showroomAddress = "Borj Chakir, Tunis, Tunisie";
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(showroomAddress)}`;
  const mapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.123456789!2d10.123456!3d36.789456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd35bd04c39e35%3A0x123456789abc!2sBorj%20Chakir%2C%20Tunis";

  return (
    <div className="google-maps-container">
      <style>{`
        .google-maps-container {
          width: 100%;
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
        }

        .maps-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .maps-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
          font-family: "Syne", sans-serif;
        }

        .maps-header p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .maps-wrapper {
          position: relative;
          width: 100%;
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
          border: 1px solid #e0e0e0;
          margin-bottom: 20px;
        }

        .maps-wrapper iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .maps-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .maps-fallback-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .maps-fallback-text {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        .maps-button-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .maps-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #b52f2f;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .maps-button:hover {
          background: #8f2424;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(181, 47, 47, 0.3);
        }

        .maps-info {
          background: #fbfaf8;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #b52f2f;
          margin-top: 20px;
        }

        .maps-info-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .maps-info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #333;
        }

        .maps-info-item:last-child {
          margin-bottom: 0;
        }

        .maps-info-label {
          font-weight: 600;
          color: #b52f2f;
          min-width: 80px;
        }

        .maps-info-value {
          color: #555;
        }

        .maps-info-value a {
          color: #b52f2f;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .maps-info-value a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .maps-wrapper {
            height: 300px;
          }

          .maps-header h2 {
            font-size: 22px;
          }

          .maps-button-group {
            flex-direction: column;
            width: 100%;
          }

          .maps-button {
            width: 100%;
            justify-content: center;
          }

          .maps-info {
            padding: 16px;
          }

          .maps-info-item {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>

      <div className="maps-header">
        <h2>📍 Trouvez Notre Showroom</h2>
        <p>Venez visiter notre showroom à Borj Chakir, Tunis</p>
      </div>

      <div className="maps-wrapper">
        <iframe
          src={mapsEmbedUrl}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Star Mousse Showroom - Borj Chakir, Tunis"
        />
      </div>

      <div className="maps-button-group">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="maps-button">
          🗺️ Ouvrir dans Google Maps
        </a>
        <a href="tel:+21622900131" className="maps-button">
          📞 Appeler maintenant
        </a>
        <a href="https://wa.me/21622900207?text=Bonjour%20Star%20Mousse%2C%20je%20voudrais%20visiter%20votre%20showroom." target="_blank" rel="noopener noreferrer" className="maps-button">
          💬 WhatsApp
        </a>
      </div>

      <div className="maps-info">
        <div className="maps-info-title">✨ Informations Showroom</div>
        <div className="maps-info-item">
          <span className="maps-info-label">📍 Adresse:</span>
          <span className="maps-info-value">Borj Chakir, Tunis, Tunisie</span>
        </div>
        <div className="maps-info-item">
          <span className="maps-info-label">📞 Téléphone:</span>
          <span className="maps-info-value">
            <a href="tel:+21622900131">22 900 131</a>
          </span>
        </div>
        <div className="maps-info-item">
          <span className="maps-info-label">💬 WhatsApp:</span>
          <span className="maps-info-value">
            <a href="https://wa.me/21622900207">22 900 207</a>
          </span>
        </div>
        <div className="maps-info-item">
          <span className="maps-info-label">📧 Email:</span>
          <span className="maps-info-value">
            <a href="/contact">Formulaire de contact</a>
          </span>
        </div>
        <div className="maps-info-item">
          <span className="maps-info-label">⏰ Horaires:</span>
          <span className="maps-info-value">Lun-Sam: 8h-18h | Dim: 10h-16h</span>
        </div>
      </div>
    </div>
  );
}
