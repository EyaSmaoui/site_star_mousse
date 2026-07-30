import React from 'react';
import formatPrice from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import { getProductBySlug } from '../../data/products';

const getSizePrice = (slug) => {
  const product = getProductBySlug(slug);
  const size = product?.sizes?.find((item) =>
    String(item.label).replace(/[×*]/g, 'x').toLowerCase() === '90x190'
  );

  return {
    price: size?.price ?? product?.price,
    oldPrice: size?.oldPrice ?? product?.oldPrice,
  };
};

export default function ProductShowcase() {
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: 'Matelas Relax Plus',
      description: 'Ergonomique et soutien optimal',
      image: '/relax_eluproduit-card.jpg',
      altText: 'Matelas Relax Plus - Matelas ergonomique mousse HR 18cm avec soutien optimal pour le confort quotidien',
      ...getSizePrice('relax-plus'),
      specs: ['28 cm', 'Ressorts ensachés', 'Réversible été/hiver'],
      badge: '⭐ BEST SELLER',
      route: '/product/relax-plus'
    },
    {
      id: 2,
      name: 'Matelas Medico Plus',
      description: 'Spécialement conçu pour le mal de dos',
      image: '/medico.jpg',
      altText: 'Matelas Medico Plus - Matelas orthopédique 25cm avec soutien ferme conçu pour soulager les douleurs dorsales',
      ...getSizePrice('medico-plus'),
      specs: ['25 cm', 'Ressorts Bonnell', 'Double face mi-ferme'],
      route: '/product/medico-plus'
    },
    {
      id: 3,
      name: 'Matelas Tendresse',
      description: 'Confort enveloppant et moelleux',
      image: '/tendresse.jpg',
      altText: 'Matelas Tendresse - Matelas ultra confortable mousse HR 30cm avec confort enveloppant et moelleux',
      ...getSizePrice('tendresse'),
      specs: ['30 cm', 'Tissu couture anti-acarien', 'Confort enveloppant'],
      route: '/product/tendresse'
    },
    {
      id: 4,
      name: 'Matelas Venise Plus',
      description: 'Ressorts ensachés premium',
      image: '/venise.jpg',
      altText: 'Matelas Venise Plus - Matelas premium 23cm avec ressorts ensachés pour durabilité maximale et confort',
      ...getSizePrice('venise-plus'),
      specs: ['23 cm', 'Coton anti-acarien', 'Soutien orthopédique'],
      route: '/product/venise-plus'
    }
  ];

  const styles = `
    .ssn-showcase-section {
      padding: 64px 20px;
      background: #fffdf8;
      text-align: center;
    }

    .ssn-showcase-header {
      margin-bottom: 48px;
    }

    .ssn-showcase-header h2 {
      font-size: 2.4em;
      font-weight: 700;
      color: #12231f;
      margin-bottom: 14px;
    }

    .ssn-showcase-header p {
      font-size: 1.05em;
      color: #64706c;
      max-width: 680px;
      margin: 0 auto;
    }

    .ssn-showcase-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1280px;
      margin: 0 auto;
      margin-bottom: 40px;
    }

    .ssn-product-card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e4ddd0;
      box-shadow: 0 18px 40px rgba(18, 35, 31, 0.08);
      transition: transform 0.28s ease, box-shadow 0.28s ease;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      position: relative;
    }

    .ssn-product-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 22px 54px rgba(18, 35, 31, 0.12);
    }

    .ssn-product-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #e86f45;
      color: #ffffff;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 0.78em;
      font-weight: 800;
      z-index: 2;
      letter-spacing: 0.02em;
    }

    .ssn-product-image {
      width: 100%;
      height: 220px;
      object-fit: cover;
      background: #f0f0f0;
    }

    .ssn-product-content {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .ssn-product-title {
      font-size: 1.2em;
      font-weight: 600;
      color: #12231f;
      margin-bottom: 8px;
      text-align: left;
    }

    .ssn-product-desc {
      font-size: 0.95em;
      color: #64706c;
      margin-bottom: 16px;
      text-align: left;
      flex: 1;
      line-height: 1.7;
    }

    .ssn-product-specs {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 18px;
      justify-content: flex-start;
    }

    .ssn-product-spec {
      background: #e9f4ee;
      color: #0f4f43;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 0.78em;
      font-weight: 700;
    }

    .ssn-product-price {
      margin-bottom: 16px;
      text-align: left;
      min-height: 54px;
    }

    .ssn-product-price-label {
      display: block;
      margin-bottom: 3px;
      color: #64706c;
      font-size: 0.78em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .ssn-product-price-row {
      display: flex;
      align-items: baseline;
      gap: 14px;
      flex-wrap: wrap;
    }

    .ssn-product-price-new {
      font-size: 1.55em;
      font-weight: 900;
      color: #0f4f43;
      white-space: nowrap;
    }

    .ssn-product-price-old {
      color: #9ca3af;
      font-size: 0.95em;
      font-weight: 700;
      text-decoration: line-through;
      white-space: nowrap;
    }

    .ssn-product-buttons {
      display: flex;
      gap: 10px;
      flex-direction: column;
    }

    .ssn-product-btn {
      min-height: 48px;
      padding: 14px 18px;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.95em;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .ssn-product-btn-primary {
      background: #0f4f43;
      color: white;
    }

    .ssn-product-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 26px rgba(15, 79, 67, 0.2);
    }

    .ssn-product-btn-secondary {
      background: #ffffff;
      color: #12231f;
      border: 2px solid #e4ddd0;
    }

    .ssn-product-btn-secondary:hover {
      background: #f4efe6;
      color: #0f4f43;
    }

    .ssn-showcase-cta {
      text-align: center;
    }

    .ssn-showcase-cta-btn {
      display: inline-block;
      min-height: 48px;
      padding: 16px 40px;
      background: #e86f45;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1em;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .ssn-showcase-cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(232, 111, 69, 0.24);
    }

    @media (max-width: 768px) {
      .ssn-showcase-section {
        padding: 40px 16px;
      }

      .ssn-showcase-header h2 {
        font-size: 1.8em;
      }

      .ssn-showcase-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .ssn-product-image {
        height: 180px;
      }

      .ssn-product-buttons {
        flex-direction: row;
      }

      .ssn-product-btn {
        padding: 10px 12px;
        font-size: 0.85em;
      }
    }

    @media (max-width: 520px) {
      .ssn-showcase-grid {
        grid-template-columns: 1fr;
      }

      .ssn-product-card {
        flex-direction: row;
      }

      .ssn-product-image {
        width: 100px;
        height: 100px;
        flex-shrink: 0;
      }

      .ssn-product-content {
        padding: 12px;
      }

      .ssn-product-title {
        font-size: 0.95em;
      }

      .ssn-showcase-header h2 {
        font-size: 1.4em;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <section className="ssn-showcase-section">
        <div className="ssn-showcase-header">
          <h2>Nos Matelas Star Mousse</h2>
          <p>Choisissez le confort qui vous convient — Garantie jusqu'à 10 ans selon le modèle</p>
        </div>

        <div className="ssn-showcase-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="ssn-product-card">
              {product.badge && <div className="ssn-product-badge">{product.badge}</div>}
              <img 
                src={product.image} 
                alt={product.altText} 
                className="ssn-product-image"
                width="320"
                height="220"
                loading="lazy"
                decoding="async"
              />
              <div className="ssn-product-content">
                <h3 className="ssn-product-title">{product.name}</h3>
                <p className="ssn-product-desc">{product.description}</p>
                <div className="ssn-product-specs">
                  {product.specs.map((spec, idx) => (
                    <span key={idx} className="ssn-product-spec">{spec}</span>
                  ))}
                </div>
                <div className="ssn-product-price">
                  <span className="ssn-product-price-label">À partir de 190x90</span>
                  <div className="ssn-product-price-row">
                    <span className="ssn-product-price-new">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                      <span className="ssn-product-price-old">{formatPrice(product.oldPrice)}</span>
                    )}
                  </div>
                </div>
                <div className="ssn-product-buttons">
                  <button 
                    className="ssn-product-btn ssn-product-btn-primary"
                    onClick={() => navigate(product.route)}
                    aria-label={`Voir les détails du ${product.name}`}
                    title={`Voir les détails du ${product.name}`}
                  >
                    Voir détails →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ssn-showcase-cta">
          <button 
            className="ssn-showcase-cta-btn"
            onClick={() => {
              if (window.trackProductView) {
                window.trackProductView('all-products', 'Voir tous les matelas');
              }
              navigate('/products');
            }}
          >
            Voir tous les matelas →
          </button>
        </div>
      </section>
    </>
  );
}
