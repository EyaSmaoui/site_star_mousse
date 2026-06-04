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
      bottom: 220px;
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
    }

    .whatsapp-icon {
      width: 32px;
      height: 32px;
      display: block;
      fill: #ffffff;
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
        bottom: calc(180px + env(safe-area-inset-bottom));
        right: 14px;
      }

      .whatsapp-button {
        width: 55px;
        height: 55px;
      }

      .whatsapp-icon {
        width: 30px;
        height: 30px;
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
          <svg className="whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16.02 3.2C8.96 3.2 3.22 8.91 3.22 15.94c0 2.25.6 4.45 1.73 6.38L3.12 29l6.85-1.79a12.84 12.84 0 0 0 6.05 1.53c7.06 0 12.8-5.72 12.8-12.75S23.08 3.2 16.02 3.2Zm0 23.36c-1.9 0-3.75-.51-5.37-1.48l-.39-.23-4.06 1.06 1.08-3.95-.26-.41a10.55 10.55 0 0 1-1.62-5.61c0-5.82 4.77-10.56 10.62-10.56s10.62 4.74 10.62 10.56-4.77 10.62-10.62 10.62Zm5.82-7.91c-.32-.16-1.89-.93-2.18-1.04-.29-.1-.5-.16-.71.16-.21.31-.82 1.03-1 1.24-.19.21-.37.23-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.84-1.59-1.88-1.78-2.2-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.55.16-.18.21-.31.32-.52.11-.21.05-.39-.03-.55-.08-.16-.71-1.71-.98-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.32-1.1 1.07-1.1 2.61s1.13 3.03 1.29 3.24c.16.21 2.22 3.38 5.38 4.74.75.32 1.34.52 1.8.66.76.24 1.44.21 1.98.13.6-.09 1.89-.77 2.16-1.51.27-.74.27-1.37.19-1.51-.08-.13-.29-.21-.61-.37Z" />
          </svg>
        </a>
        <div className="whatsapp-tooltip">
          Contactez-nous!
        </div>
      </div>
    </>
  );
}
