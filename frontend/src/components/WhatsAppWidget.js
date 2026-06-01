import React from 'react';

export default function WhatsAppWidget() {
  const whatsappNumber = '21622900207';
  const whatsappMessage = encodeURIComponent(
    'Bonjour Star Mousse! Je voudrais des informations sur vos matelas. Pouvez-vous m\'aider?'
  );
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const styles = `
    .whatsapp-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 5002;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .whatsapp-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #25D366;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
      transition: all 0.3s ease;
      text-decoration: none;
      font-size: 28px;
    }

    .whatsapp-button:hover {
      background: #20BA5A;
      box-shadow: 0 6px 16px rgba(37, 211, 102, 0.6);
      transform: scale(1.1);
    }

    .whatsapp-button:active {
      transform: scale(0.95);
    }

    .whatsapp-tooltip {
      position: absolute;
      bottom: 75px;
      right: 0;
      background: #25D366;
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      pointer-events: none;
    }

    .whatsapp-button:hover ~ .whatsapp-tooltip {
      opacity: 1;
      visibility: visible;
    }

    @media (max-width: 520px) {
      .whatsapp-widget {
        bottom: 15px;
        right: 15px;
      }

      .whatsapp-button {
        width: 55px;
        height: 55px;
        font-size: 26px;
      }

      .whatsapp-tooltip {
        font-size: 11px;
        bottom: 70px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="whatsapp-widget">
        <a
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-button"
          title="Contactez-nous sur WhatsApp"
          aria-label="Contact WhatsApp"
        >
          💬
        </a>
        <div className="whatsapp-tooltip">
          Contactez-nous!
        </div>
      </div>
    </>
  );
}
