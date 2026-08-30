import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="sm-not-found">
      <style>{`
        .sm-not-found {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px 72px;
          background: #fafaf8;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        .sm-not-found-card {
          max-width: 560px;
          text-align: center;
          background: #fff;
          border: 1px solid #e2e2de;
          border-radius: 24px;
          padding: 48px 32px;
          box-shadow: 0 24px 60px rgba(10, 10, 10, 0.08);
        }
        .sm-not-found-code {
          font-size: 72px;
          font-weight: 800;
          line-height: 1;
          color: #0a0a0a;
          margin: 0 0 12px;
        }
        .sm-not-found h1 {
          margin: 0 0 12px;
          font-size: 28px;
          color: #0a0a0a;
        }
        .sm-not-found p {
          margin: 0 0 28px;
          color: #6b6b6b;
          line-height: 1.6;
        }
        .sm-not-found-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        .sm-not-found-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          border-radius: 999px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .sm-not-found-btn.primary {
          background: #0a0a0a;
          color: #fff;
        }
        .sm-not-found-btn.secondary {
          background: #fff;
          color: #0a0a0a;
          border: 1px solid #e2e2de;
        }
        .sm-not-found-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(10, 10, 10, 0.12);
        }
      `}</style>
      <div className="sm-not-found-card">
        <p className="sm-not-found-code">404</p>
        <h1>Page introuvable</h1>
        <p>
          Cette page n&apos;existe pas ou a ete deplacee. Retournez a l&apos;accueil
          ou parcourez nos matelas Star Mousse.
        </p>
        <div className="sm-not-found-actions">
          <Link to="/" className="sm-not-found-btn primary">Retour accueil</Link>
          <Link to="/products" className="sm-not-found-btn secondary">Voir les produits</Link>
        </div>
      </div>
    </section>
  );
}
