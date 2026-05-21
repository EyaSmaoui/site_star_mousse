import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const dropdownProducts = useMemo(
    () => [
      { to: "/product/confort-plus", label: "Confort Plus", desc: "Soutien quotidien renforcé" },     
      { to: "/product/soft-plus", label: "Soft Plus", desc: "Matelas Orthopédique " },
      { to: "/product/venise-plus", label: "Venise Plus", desc: "Matelas Super Orthopédique " },
      { to: "/product/medico-plus", label: "Medico Plus", desc: "Matelas Ortho-Medical " },
      { to: "/product/relax-plus", label: "Relax Plus", desc: "Matelas Ergonomique " },
      { to: "/product/oreillers", label: "Oreillers", desc: "Oreillers Medicals " },
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    setIsLoggedIn(Boolean(token));

    if (!userData) {
      setUserRole(null);
      return;
    }

    try {
      setUserRole(JSON.parse(userData).role);
    } catch {
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const accountPath =
    userRole === "admin"
      ? "/admin-dashboard"
      : userRole === "manager" || userRole === "employee" || userRole === "employeur"
        ? "/employee-dashboard"
        : "/client-dashboard";

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    closeMenu();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');

        * { box-sizing: border-box; }

        .ssn-header {
          position: sticky;
          top: 0;
          z-index: 5000;
          font-family: 'DM Sans', sans-serif;
          background: rgba(251,250,248,0.86);
          border-bottom: 1px solid rgba(26,26,46,0.08);
          backdrop-filter: blur(18px);
          transition: background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .ssn-header.scrolled {
          background: rgba(255,255,255,0.94);
          border-color: rgba(26,26,46,0.1);
          box-shadow: 0 18px 55px rgba(21,21,34,0.1);
        }

        .ssn-promo {
          min-height: 34px;
          padding: 8px 40px;
          background: #151522;
          color: #f7f1e8;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.1px;
        }
        .ssn-promo span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .ssn-promo strong {
          color: #f4c84f;
          font-weight: 900;
        }
        .ssn-promo-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f4c84f;
          box-shadow: 0 0 0 4px rgba(244,200,79,0.12);
        }

        .ssn-nav {
          max-width: 1440px;
          min-height: 76px;
          margin: 0 auto;
          padding: 14px 40px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 24px;
          transition: min-height 0.25s ease, padding 0.25s ease;
        }
        .ssn-header.scrolled .ssn-nav {
          min-height: 68px;
          padding-top: 10px;
          padding-bottom: 10px;
        }

        .ssn-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .ssn-logo img {
          height: 52px;
          width: auto;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 10px 18px rgba(21,21,34,0.08));
          transition: transform 0.22s ease, height 0.22s ease;
        }
        .ssn-header.scrolled .ssn-logo img { height: 46px; }
        .ssn-logo:hover img { transform: translateY(-1px); }

        .ssn-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ssn-link,
        .ssn-dropdown-trigger {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 13px;
          border: 1px solid transparent;
          border-radius: 999px;
          color: #242436;
          background: transparent;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .ssn-link:hover,
        .ssn-dropdown-trigger:hover,
        .ssn-link.active,
        .ssn-dropdown-trigger.active {
          background: #ffffff;
          color: #b52f2f;
          border-color: rgba(181,47,47,0.12);
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(21,21,34,0.06);
        }
        .ssn-promo-link {
          color: #b52f2f;
          background: rgba(181,47,47,0.08);
        }

        .ssn-dropdown { position: relative; }
        .ssn-chevron {
          width: 8px;
          height: 8px;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: rotate(45deg) translateY(-2px);
          transition: transform 0.2s ease;
          opacity: 0.72;
        }
        .ssn-chevron.open { transform: rotate(225deg) translateY(-1px); }

        .ssn-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          width: 330px;
          margin: 0;
          padding: 10px;
          list-style: none;
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(26,26,46,0.08);
          border-radius: 22px;
          box-shadow: 0 28px 80px rgba(21,21,34,0.16);
          backdrop-filter: blur(18px);
          animation: ssn-menu-in 0.2s ease both;
        }
        @keyframes ssn-menu-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .ssn-dropdown-menu::before {
          content: "";
          position: absolute;
          top: -7px;
          left: 50%;
          width: 14px;
          height: 14px;
          transform: translateX(-50%) rotate(45deg);
          background: rgba(255,255,255,0.96);
          border-left: 1px solid rgba(26,26,46,0.08);
          border-top: 1px solid rgba(26,26,46,0.08);
        }
        .ssn-dropdown-menu a {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 11px;
          align-items: center;
          padding: 11px;
          border-radius: 16px;
          color: #242436;
          text-decoration: none;
          transition: background 0.16s ease, transform 0.16s ease;
        }
        .ssn-dropdown-menu a:hover {
          background: #f8f3ed;
          transform: translateX(2px);
        }
        .ssn-menu-icon {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #b52f2f;
          background: rgba(181,47,47,0.1);
          font-size: 15px;
          font-weight: 900;
        }
        .ssn-menu-title {
          display: block;
          color: #151522;
          font-size: 13.8px;
          font-weight: 900;
        }
        .ssn-menu-desc {
          display: block;
          margin-top: 2px;
          color: #77798a;
          font-size: 12px;
          font-weight: 600;
        }

        .ssn-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          min-width: 0;
        }
        .ssn-search {
          width: min(240px, 22vw);
          min-height: 42px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 13px;
          border-radius: 999px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(26,26,46,0.1);
          box-shadow: 0 10px 24px rgba(21,21,34,0.05);
          transition: width 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ssn-search:focus-within {
          width: 270px;
          background: #ffffff;
          border-color: rgba(181,47,47,0.24);
          box-shadow: 0 0 0 4px rgba(181,47,47,0.08), 0 16px 34px rgba(21,21,34,0.08);
        }
        .ssn-search-icon {
          width: 18px;
          height: 18px;
          border: 2px solid #6d6d7c;
          border-radius: 50%;
          position: relative;
          flex-shrink: 0;
        }
        .ssn-search-icon::after {
          content: "";
          position: absolute;
          width: 7px;
          height: 2px;
          right: -6px;
          bottom: -3px;
          border-radius: 999px;
          background: #6d6d7c;
          transform: rotate(45deg);
        }
        .ssn-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #242436;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
        }
        .ssn-search input::placeholder { color: #9b9cab; }

        .ssn-login,
        .ssn-account,
        .ssn-cart {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 900;
          white-space: nowrap;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, color 0.18s ease;
        }
        .ssn-login {
          padding: 0 16px;
          color: #242436;
          background: #ffffff;
          border: 1px solid rgba(26,26,46,0.1);
        }
        .ssn-account {
          padding: 0 17px;
          color: #ffffff;
          background: #151522;
          border: 1px solid #151522;
        }
        .ssn-login:hover,
        .ssn-account:hover,
        .ssn-cart:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(21,21,34,0.14);
        }
        .ssn-account:hover { background: #b52f2f; border-color: #b52f2f; }
        .ssn-cart {
          position: relative;
          width: 44px;
          color: #151522;
          background: #f4c84f;
          border: 1px solid rgba(21,21,34,0.08);
        }
        .ssn-cart-icon {
          width: 18px;
          height: 15px;
          border: 2px solid currentColor;
          border-top: 0;
          border-radius: 0 0 5px 5px;
          position: relative;
        }
        .ssn-cart-icon::before {
          content: "";
          position: absolute;
          left: 2px;
          right: 2px;
          top: -7px;
          height: 9px;
          border: 2px solid currentColor;
          border-bottom: 0;
          border-radius: 999px 999px 0 0;
        }
        .ssn-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: #b52f2f;
          border: 2px solid #ffffff;
          font-size: 10px;
          font-weight: 900;
        }

        .ssn-hamburger {
          display: none;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(26,26,46,0.1);
          border-radius: 14px;
          background: #ffffff;
          color: #151522;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          box-shadow: 0 12px 24px rgba(21,21,34,0.08);
        }
        .ssn-hamburger span {
          width: 18px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .ssn-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .ssn-hamburger.open span:nth-child(2) { opacity: 0; }
        .ssn-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .ssn-mobile-menu {
          display: none;
          padding: 0 20px 22px;
        }
        .ssn-mobile-menu.open { display: block; }
        .ssn-mobile-panel {
          max-width: 520px;
          margin: 0 auto;
          padding: 12px;
          border: 1px solid rgba(26,26,46,0.08);
          border-radius: 24px;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 24px 70px rgba(21,21,34,0.16);
        }
        .ssn-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 46px;
          padding: 0 12px;
          border-radius: 15px;
          color: #242436;
          text-decoration: none;
          font-size: 14.5px;
          font-weight: 900;
        }
        .ssn-mobile-link:hover { background: #f8f3ed; color: #b52f2f; }
        .ssn-mobile-link.sub {
          min-height: 40px;
          margin-left: 10px;
          color: #747587;
          font-size: 13px;
          font-weight: 800;
        }
        .ssn-mobile-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }
        .ssn-mobile-actions a {
          min-height: 44px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 14px;
          font-weight: 900;
        }
        .ssn-mobile-login {
          background: #f8f3ed;
          color: #151522;
        }
        .ssn-mobile-cart {
          background: #151522;
          color: #ffffff;
        }

        @media (max-width: 1120px) {
          .ssn-search { display: none; }
          .ssn-nav { gap: 16px; }
        }
        @media (max-width: 960px) {
          .ssn-promo {
            justify-content: flex-start;
            gap: 18px;
            overflow-x: auto;
            padding: 8px 20px;
            scrollbar-width: none;
          }
          .ssn-promo::-webkit-scrollbar { display: none; }
          .ssn-nav {
            display: flex;
            min-height: 68px;
            padding: 10px 20px !important;
          }
          .ssn-links,
          .ssn-actions { display: none; }
          .ssn-hamburger { display: inline-flex; margin-left: auto; }
          .ssn-logo img { height: 46px; }
        }
        @media (max-width: 520px) {
          .ssn-promo { font-size: 11.5px; }
          .ssn-mobile-actions { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className={`ssn-header ${scrolled ? "scrolled" : ""}`}>
        <div className="ssn-promo">
          <span><i className="ssn-promo-dot"></i> Promos sommeil: <strong>jusqu'à -50%</strong></span>
          <span><i className="ssn-promo-dot"></i> Paiement à la livraison</span>
          <span><i className="ssn-promo-dot"></i> Livraison partout en Tunisie</span>
        </div>

        <nav className="ssn-nav" aria-label="Navigation principale">
          <Link to="/" className="ssn-logo" onClick={closeMenu} aria-label="Star Mousse accueil">
            <img src="/logo-star-mousse.png" alt="Star Mousse" />
          </Link>

          <ul className="ssn-links">
            <li>
              <Link className={`ssn-link ${isActive("/") ? "active" : ""}`} to="/">Accueil</Link>
            </li>

            <li
              className="ssn-dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                to="/products"
                className={`ssn-dropdown-trigger ${isActive("/products") ? "active" : ""}`}
                onFocus={() => setDropdownOpen(true)}
              >
                Produits <span className={`ssn-chevron ${dropdownOpen ? "open" : ""}`}></span>
              </Link>
              {dropdownOpen && (
                <ul className="ssn-dropdown-menu">
                  {dropdownProducts.map((product, index) => (
                    <li key={product.to}>
                      <Link to={product.to} onClick={closeMenu}>
                        <span className="ssn-menu-icon">{index + 1}</span>
                        <span>
                          <span className="ssn-menu-title">{product.label}</span>
                          <span className="ssn-menu-desc">{product.desc}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link className={`ssn-link ssn-promo-link ${isActive("/promos") ? "active" : ""}`} to="/promos">Promos</Link>
            </li>
            <li>
              <Link className={`ssn-link ${isActive("/about") ? "active" : ""}`} to="/about">À propos</Link>
            </li>
            <li>
              <Link className={`ssn-link ${isActive("/help") ? "active" : ""}`} to="/help">Aide & Contact</Link>
            </li>
          </ul>

          <div className="ssn-actions">
            <form className="ssn-search" onSubmit={submitSearch}>
              <span className="ssn-search-icon" aria-hidden="true"></span>
              <input
                type="search"
                placeholder="Rechercher..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </form>

            {isLoggedIn ? (
              <Link to={accountPath} className="ssn-account" onClick={closeMenu}>Mon compte</Link>
            ) : (
              <Link to="/login" className="ssn-login" onClick={closeMenu}>Se connecter</Link>
            )}

            <Link to="/cart" className="ssn-cart" onClick={closeMenu} title="Panier" aria-label="Panier">
              <span className="ssn-cart-icon"></span>
              <span className="ssn-cart-badge">0</span>
            </Link>
          </div>

          <button
            type="button"
            className={`ssn-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        <div className={`ssn-mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="ssn-mobile-panel">
            <Link to="/" className="ssn-mobile-link" onClick={closeMenu}>Accueil <span>→</span></Link>
            <Link to="/products" className="ssn-mobile-link" onClick={closeMenu}>Tous les produits <span>→</span></Link>
            {dropdownProducts.map((product) => (
              <Link key={product.to} to={product.to} className="ssn-mobile-link sub" onClick={closeMenu}>
                {product.label}
              </Link>
            ))}
            <Link to="/promos" className="ssn-mobile-link" onClick={closeMenu}>Promos <span>→</span></Link>
            <Link to="/about" className="ssn-mobile-link" onClick={closeMenu}>À propos <span>→</span></Link>
            <Link to="/help" className="ssn-mobile-link" onClick={closeMenu}>Aide & Contact <span>→</span></Link>

            <div className="ssn-mobile-actions">
              {isLoggedIn ? (
                <Link to={accountPath} className="ssn-mobile-login" onClick={closeMenu}>Mon compte</Link>
              ) : (
                <Link to="/login" className="ssn-mobile-login" onClick={closeMenu}>Se connecter</Link>
              )}
              <Link to="/cart" className="ssn-mobile-cart" onClick={closeMenu}>Panier</Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default NavBar;
