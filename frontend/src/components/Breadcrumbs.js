import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(p => p);
    const breadcrumbs = [{ label: 'Accueil', href: '/' }];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Map URL paths to display labels
      const labels = {
        'nos-matelas': 'Nos Matelas',
        'product': 'Produit',
        'a-propos': 'À Propos',
        'contact': 'Contact',
        'faq': 'FAQ',
        'cart': 'Panier',
        'about': 'À Propos',
        'help': 'Aide',
        'products': 'Nos Matelas',
        'promos': 'Promotions',
      };

      // Get product name from path (for /product/relax-plus)
      if (path === 'product' && paths[index + 1]) {
        const productName = paths[index + 1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ label: 'Nos Matelas', href: '/nos-matelas' });
        breadcrumbs.push({ label: productName, href: currentPath + '/' + paths[index + 1], isActive: true });
        return; // Skip next iteration
      } else if (labels[path]) {
        breadcrumbs.push({
          label: labels[path],
          href: currentPath,
          isActive: index === paths.length - 1,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="breadcrumbs-container" aria-label="Fil d'Ariane">
      <style>{`
        .breadcrumbs-container {
          width: 100%;
          background: #fbfaf8;
          padding: 12px 20px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 13px;
        }

        .breadcrumbs-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb-link {
          color: #b52f2f;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .breadcrumb-link:hover {
          color: #8f2424;
          text-decoration: underline;
        }

        .breadcrumb-current {
          color: #666;
          font-weight: 600;
        }

        .breadcrumb-separator {
          color: #999;
          user-select: none;
        }

        @media (max-width: 768px) {
          .breadcrumbs-container {
            padding: 10px 12px;
            font-size: 12px;
          }

          .breadcrumbs-wrapper {
            gap: 6px;
          }
        }
      `}</style>

      <div className="breadcrumbs-wrapper">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={index} className="breadcrumb-item">
            {breadcrumb.isActive ? (
              <span className="breadcrumb-current">{breadcrumb.label}</span>
            ) : (
              <>
                <a href={breadcrumb.href} className="breadcrumb-link">
                  {breadcrumb.label}
                </a>
                {index < breadcrumbs.length - 1 && (
                  <span className="breadcrumb-separator">/</span>
                )}
              </>
            )}
            {index < breadcrumbs.length - 1 && !breadcrumb.isActive && (
              <span className="breadcrumb-separator">/</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
