import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaHeart, FaInstagram, FaRegUser, FaRetweet, FaWhatsapp } from "react-icons/fa";
import { FiHome, FiMoreHorizontal, FiSearch, FiShoppingBag, FiX } from "react-icons/fi";
import { CART_UPDATED_EVENT, getCartCount } from "../utils/cartUtils";
import { PROFILE_CHANGED_EVENT } from "../services/profileSyncService";
import { SOCIAL, buildWhatsappUrl } from "../data/siteLinks";
import UserAvatar from "./UserAvatar";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileTab, setMobileTab] = useState("menu");
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollYRef = useRef(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = useMemo(
    () => [
      { to: "/", label: "Accueil" },
      {
        to: "/nos-matelas",
        label: "Matelas",
        children: [
          { to: "/products?search=orthopedique", label: "Matelas orthopédique" },
          { to: "/products?search=orthomedical", label: "Matelas orthomédical" },
          { to: "/products?search=ergonomique", label: "Matelas ergonomique" },
        ],
      },
      {
        to: "/products?search=accessoires",
        label: "Accessoires",
        children: [
          { to: "/products?search=protege-matelas", label: "Protege matelas" },
          { to: "/products?search=protege-oreillers", label: "Protege oreillers" },
          { to: "/products?search=couettes", label: "Couettes" },
        ],
      },
      {
        to: "/product/oreillers",
        label: "Oreillers",
        children: [
          { to: "/products?search=oreiller-70x50", label: "Oreillers 70 × 50" },
          { to: "/products?search=oreiller-60x40", label: "Oreillers 60 × 40" },
          { to: "/products?search=oreiller-50x40", label: "Oreillers 50 × 40" },
          { to: "/products?search=oreiller-40x40", label: "Oreillers 40 × 40" },
        ],
      },
      {
        to: "/products?search=meubles",
        label: "Meubles",
        children: [
          { to: "/products?search=lits", label: "Lits" },
          { to: "/products?search=commodes", label: "Commodes" },
          { to: "/products?search=tables-de-nuit", label: "Tables de nuit" },
        ],
      },
    ],
    []
  );

  const categoryLinks = useMemo(
    () => [
      {
        to: "/nos-matelas",
        label: "Matelas",
        children: [
          { to: "/products?search=orthopedique", label: "Matelas orthopédique" },
          { to: "/products?search=orthomedical", label: "Matelas orthomédical" },
          { to: "/products?search=ergonomique", label: "Matelas ergonomique" },
        ],
      },
      {
        to: "/product/oreillers",
        label: "Oreillers",
        children: [
          { to: "/products?search=oreiller-70x50", label: "Oreillers 70 × 50" },
          { to: "/products?search=oreiller-60x40", label: "Oreillers 60 × 40" },
          { to: "/products?search=oreiller-50x40", label: "Oreillers 50 × 40" },
          { to: "/products?search=oreiller-40x40", label: "Oreillers 40 × 40" },
        ],
      },
      {
        to: "/products?search=accessoires",
        label: "Accessoires",
        children: [
          { to: "/products?search=protege-matelas", label: "Protege matelas" },
          { to: "/products?search=protege-oreillers", label: "Protege oreillers" },
          { to: "/products?search=couettes", label: "Couettes" },
        ],
      },
      {
        to: "/products?search=meubles",
        label: "Meubles",
        children: [
          { to: "/products?search=lits", label: "Lits" },
          { to: "/products?search=tables-de-nuit", label: "Tables de nuit" },
          { to: "/products?search=commodes", label: "Commodes" },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          setScrolled(currentScroll > 16);
          setShowHeader(currentScroll <= 80 || currentScroll < lastScrollYRef.current);
          lastScrollYRef.current = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncUser = (event) => {
      const token = localStorage.getItem("token");
      const userData = event?.detail ? JSON.stringify(event.detail) : localStorage.getItem("user");
      setIsLoggedIn(Boolean(token));

      if (!userData) {
        setUserRole(null);
        setProfile(null);
        return;
      }

      try {
        const nextProfile = JSON.parse(userData);
        setUserRole(nextProfile.role);
        setProfile(nextProfile);
      } catch {
        setUserRole(null);
        setProfile(null);
      }
    };

    syncUser();
    window.addEventListener(PROFILE_CHANGED_EVENT, syncUser);
    window.addEventListener("user-logged-in", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(PROFILE_CHANGED_EVENT, syncUser);
      window.removeEventListener("user-logged-in", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    const syncCartCount = () => setCartCount(getCartCount());
    syncCartCount();
    window.addEventListener(CART_UPDATED_EVENT, syncCartCount);
    window.addEventListener("storage", syncCartCount);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveMenu(null);
    setMobileTab("menu");
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
    setActiveMenu(null);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    closeMenu();
  };

  const searchSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return navLinks
      .flatMap((item) => [item, ...(item.children || [])])
      .filter((item, index, items) =>
        items.findIndex((candidate) => candidate.to === item.to) === index &&
        item.label.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [navLinks, search]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .ssn-header {
          position: sticky;
          top: 0;
          z-index: 5000;
          font-family: var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: linear-gradient(180deg, #1f3741 0%, #2d494e 100%);
          border-bottom: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(14px);
          transition: transform 0.28s ease, background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          transform: translateY(0);
          will-change: transform, background;
        }
        .ssn-header.hidden {
          transform: translateY(-110%);
        }
        .ssn-header.scrolled {
          background: linear-gradient(180deg, #1f3741 0%, #2d494e 100%);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 18px 44px rgba(7,26,65,0.28);
        }

        .ssn-nav {
          width: 100%;
          max-width: 1440px;
          min-height: 78px;
          margin: 0 auto;
          padding: 12px 28px 10px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
          transition: min-height 0.25s ease, padding 0.25s ease;
        }
        .ssn-header.scrolled .ssn-nav {
          min-height: 68px;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .ssn-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .ssn-logo img {
          height: 48px;
          width: auto;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 12px 22px rgba(7,26,65,0.25));
          transition: transform 0.22s ease, height 0.22s ease;
        }
        .ssn-header.scrolled .ssn-logo img { height: 42px; }
        .ssn-logo:hover img { transform: translateY(-1px); }

        .ssn-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 18px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ssn-link,
        .ssn-dropdown-trigger {
          position: relative;
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 10px;
          border: 1px solid transparent;
          border-radius: 10px;
          color: #edf5ff;
          background: transparent;
          text-decoration: none;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-transform: none;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ssn-link:hover,
        .ssn-dropdown-trigger:hover,
        .ssn-link.active,
        .ssn-dropdown-trigger.active {
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          border-color: rgba(255,255,255,0.12);
          transform: none;
          box-shadow: none;
        }
        .ssn-link::after,
        .ssn-dropdown-trigger::after {
          content: "";
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 4px;
          height: 2px;
          background: #c89b5b;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.18s ease;
        }
        .ssn-link:hover::after,
        .ssn-dropdown-trigger:hover::after,
        .ssn-link.active::after,
        .ssn-dropdown-trigger.active::after {
          transform: scaleX(1);
        }

        .ssn-dropdown { position: relative; }
        .ssn-chevron {
          width: 8px;
          height: 8px;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: rotate(45deg) translateY(-2px);
          transition: transform 0.2s ease;
          opacity: 0.82;
        }
        .ssn-chevron.open { transform: rotate(225deg) translateY(-1px); }

        .ssn-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          margin: 0;
          padding: 10px;
          list-style: none;
          background: #fffdf8;
          border: 1px solid rgba(31,45,53,0.12);
          border-radius: 14px;
          box-shadow: 0 18px 46px rgba(31,45,53,0.16);
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
          display: block;
          align-items: center;
          padding: 11px;
          border-radius: 0;
          color: #26343d;
          text-decoration: none;
          transition: background 0.16s ease, transform 0.16s ease;
        }
        .ssn-dropdown-menu a:hover {
          background: #f3e9dc;
          transform: none;
        }
        .ssn-menu-icon {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #b85c38;
          background: rgba(184,92,56,0.10);
          font-size: 15px;
          font-weight: 900;
        }
        .ssn-menu-title {
          display: block;
          color: #26343d;
          font-size: 13.8px;
          font-weight: 900;
        }
        .ssn-menu-desc {
          display: block;
          margin-top: 2px;
          color: #64706c;
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
        .ssn-cta-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #b85c38 0%, #8f4028 100%);
          color: #ffffff;
          text-decoration: none;
          font-size: 11.5px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 14px 28px rgba(184, 92, 56, 0.26);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ssn-cta-pill:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 32px rgba(184, 92, 56, 0.32);
        }
        .ssn-search {
          position: relative;
          width: min(240px, 22vw);
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 13px;
          border-radius: 12px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(18,35,31,0.12);
          box-shadow: 0 10px 24px rgba(18,35,31,0.06);
          animation: ssn-search-enter 0.65s cubic-bezier(.2,.8,.2,1) both;
          transition: width 0.32s cubic-bezier(.2,.8,.2,1), border-color 0.2s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .ssn-search:focus-within {
          width: 270px;
          background: #ffffff;
          border-color: rgba(15,79,67,0.26);
          box-shadow: 0 0 0 4px rgba(15,79,67,0.08), 0 16px 34px rgba(18,35,31,0.08);
          transform: translateY(-1px);
        }
        @keyframes ssn-search-enter {
          from { opacity: 0; transform: translateY(7px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ssn-search-icon {
          width: 18px;
          height: 18px;
          border: 2px solid #6d6d7c;
          border-radius: 50%;
          position: relative;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(.2,.8,.2,1), border-color 0.2s ease;
        }
        .ssn-search:focus-within .ssn-search-icon { transform: scale(1.12) rotate(-12deg); border-color: #0f4f43; }
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
          color: #12231f;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 700;
        }
        .ssn-search input::placeholder { color: transparent; }
        .ssn-search-suggestions {
          position: absolute;
          z-index: 20;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          padding: 8px;
          background: #fffdf9;
          border: 1px solid rgba(31,45,53,0.12);
          border-radius: 14px;
          box-shadow: 0 18px 35px rgba(31,45,53,0.18);
        }
        .ssn-search-suggestions a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 11px;
          color: #26343d;
          border-radius: 9px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
        }
        .ssn-search-suggestions a:hover { background: #f3e9dc; }
        .ssn-search-suggestions small { color: #a14d30; font-size: 10px; text-transform: uppercase; }

        .ssn-login,
        .ssn-account,
        .ssn-cart {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          text-decoration: none;
          font-family: inherit;
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
          background: #0d3d87;
          border: 1px solid #0d3d87;
        }
        .ssn-login:hover,
        .ssn-account:hover,
        .ssn-cart:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(18,35,31,0.14);
        }
        .ssn-account:hover { background: #0a2d6b; border-color: #0a2d6b; }
        .ssn-cart {
          position: relative;
          width: 44px;
          color: #ffffff;
          background: #1d5dd8;
          border: 1px solid rgba(18,35,31,0.08);
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
        .ssn-cart-count,
        .ssn-mobile-panel-count {
          position: absolute;
          min-width: 17px;
          height: 17px;
          padding: 0 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #d9362b;
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          line-height: 1;
        }
        .ssn-cart-count {
          top: -6px;
          right: -6px;
        }

        .ssn-mobile-header-actions {
          display: none;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          margin-left: auto;
        }
        .ssn-mobile-header-icon {
          position: relative;
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 0;
          background: transparent;
          color: #12231f;
          text-decoration: none;
          cursor: pointer;
        }
        .ssn-mobile-header-icon svg {
          width: 20px;
          height: 20px;
        }
        .ssn-mobile-header-icon .ssn-cart-count {
          top: 4px;
          right: 3px;
        }


        .ssn-hamburger {
          display: none;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(26,26,46,0.1);
          border-radius: 12px;
          background: #ffffff;
          color: #12231f;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 12px 24px rgba(18,35,31,0.08);
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
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: min(420px, 92vw);
          padding: 0;
          box-sizing: border-box;
          background: #ffffff;
          z-index: 7000;
          overflow-y: auto;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
          box-shadow: 24px 0 70px rgba(18,35,31,0.18);
        }
        .ssn-mobile-menu.open {
          display: block;
          transform: translateX(0);
        }
        .ssn-mobile-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 6999;
          background: rgba(10,10,10,0.42);
        }
        .ssn-mobile-backdrop.open { display: block; }
        .ssn-mobile-panel {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          min-height: 100%;
          padding: 30px 24px 26px;
          border: 0;
          border-radius: 0;
          background: rgba(255,255,255,0.96);
          box-shadow: none;
        }
        .ssn-mobile-close {
          position: absolute;
          top: 14px;
          left: 14px;
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 999px;
          background: #f4efe6;
          color: #12231f;
          cursor: pointer;
        }
        .ssn-mobile-logo {
          display: flex;
          justify-content: center;
          padding: 18px 0 24px;
        }
        .ssn-mobile-logo img {
          width: 164px;
          height: auto;
          object-fit: contain;
        }
        .ssn-mobile-search {
          min-height: 48px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 46px;
          border: 1px solid rgba(18,35,31,0.14);
          background: #f8f3ed;
          margin-bottom: 18px;
        }
        .ssn-mobile-search input {
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          padding: 0 14px;
          color: #12231f;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          transition: transform 0.2s ease;
        }
        .ssn-mobile-search:focus-within input { transform: translateX(2px); }
        .ssn-mobile-search input::placeholder { color: transparent; }
        .ssn-mobile-search button {
          border: 0;
          border-left: 1px solid rgba(18,35,31,0.12);
          background: #0a0a0a;
          color: #ffffff;
          cursor: pointer;
        }
        .ssn-mobile-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid rgba(18,35,31,0.12);
          margin-bottom: 8px;
        }
        .ssn-mobile-tab {
          min-height: 44px;
          border: 0;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: #747587;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }
        .ssn-mobile-tab.active {
          color: #12231f;
          border-bottom-color: #12231f;
        }
        .ssn-mobile-list {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }
         .ssn-mobile-link {
           display: flex;
           align-items: center;
           justify-content: space-between;
           min-height: 46px;
           padding: 12px 0;
           border-bottom: 1px solid rgba(18,35,31,0.08);
           border-radius: 0;
           color: #12231f;
           text-decoration: none;
           font-size: 14px;
           font-weight: 800;
         }
         .ssn-mobile-link:hover { background: transparent; color: #b85c38; }
         .ssn-mobile-link.sub {
           min-height: 38px;
           margin-left: 14px;
           padding: 9px 0;
           color: #747587;
           font-size: 12.5px;
           font-weight: 700;
         }
         .ssn-mobile-link span {
           color: #9b9cab;
           font-size: 18px;
           line-height: 1;
         }
         .ssn-mobile-actions {
           display: flex;
           flex-direction: column;
           gap: 0;
           margin-top: 14px;
           border-top: 1px solid rgba(18,35,31,0.1);
         }
         .ssn-mobile-actions a {
           min-height: 46px;
           border-bottom: 1px solid rgba(18,35,31,0.08);
           border-radius: 0;
           display: flex;
           align-items: center;
           justify-content: flex-start;
           gap: 10px;
           text-decoration: none;
           font-size: 13px;
           font-weight: 800;
         }
        .ssn-mobile-login {
          background: transparent;
          color: #12231f;
        }
        .ssn-mobile-cart {
          background: transparent;
          color: #12231f;
        }
        .ssn-mobile-socials {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding-top: 20px;
        }
        .ssn-mobile-socials a {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #0a0a0a;
          color: #ffffff;
          text-decoration: none;
        }
        .ssn-mobile-bottom-panel {
          display: none;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 6500;
          min-height: 66px;
          padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
          background: rgba(255,255,255,0.98);
          border-top: 1px solid rgba(18,35,31,0.12);
          box-shadow: 0 -12px 34px rgba(18,35,31,0.12);
        }
        .ssn-mobile-bottom-inner {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          align-items: stretch;
          max-width: 560px;
          margin: 0 auto;
        }
        .ssn-mobile-panel-item {
          position: relative;
          min-width: 0;
          min-height: 54px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: 0;
          background: transparent;
          color: #12231f;
          text-decoration: none;
          font: inherit;
          font-size: 10.5px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }
        .ssn-mobile-panel-item svg {
          width: 20px;
          height: 20px;
        }
        .ssn-mobile-panel-item.active,
        .ssn-mobile-panel-item:hover {
          color: #b85c38;
        }
        .ssn-mobile-panel-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .ssn-mobile-panel-count {
          top: -8px;
          right: -11px;
        }

        @media (max-width: 1120px) {
          .ssn-search { display: none; }
          .ssn-nav { gap: 16px; }
          .ssn-logo img { height: 48px; }
        }
        @media (max-width: 960px) {
          .ssn-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 68px;
            padding: 10px 18px !important;
          }
          .ssn-links,
          .ssn-actions { display: none; }
          .ssn-hamburger { display: none; }
          .ssn-mobile-header-actions { display: inline-flex; }
          .ssn-logo img { height: 44px; }
          .ssn-mobile-bottom-panel { display: block; }
          .ssn-mobile-menu {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: min(420px, 92vw);
            padding: 0;
            background: #ffffff;
          }
          .ssn-mobile-panel {
            width: 100%;
            max-width: 100%;
          }
        }
        @media (max-width: 420px) {
          .ssn-mobile-header-actions { gap: 0; }
          .ssn-mobile-header-icon {
            width: 36px;
            height: 40px;
          }
          .ssn-mobile-panel-item { font-size: 10px; }
        }

        /* Star Mousse premium navigation: light storefront header, dark announcement bar. */
        .ssn-header {
          background: rgba(255,253,249,0.98);
          border-bottom: 1px solid rgba(21,60,55,0.12);
          box-shadow: 0 8px 26px rgba(21,60,55,0.06);
        }
        .ssn-header.scrolled {
          background: rgba(255,253,249,0.99);
          border-color: rgba(21,60,55,0.16);
          box-shadow: 0 12px 30px rgba(21,60,55,0.12);
        }
        .ssn-nav {
          min-height: 82px;
          padding: 14px 28px 12px;
          max-width: 1280px;
        }
        .ssn-logo img {
          height: 54px;
          filter: none;
        }
        .ssn-header.scrolled .ssn-logo img { height: 48px; }
        .ssn-links { gap: 9px; }
        .ssn-link,
        .ssn-dropdown-trigger {
          min-height: 38px;
          padding: 8px 9px;
          color: #465b57;
          font-size: 12px;
          font-weight: 700;
        }
        .ssn-link:hover,
        .ssn-dropdown-trigger:hover,
        .ssn-link.active,
        .ssn-dropdown-trigger.active {
          color: #c85c35;
          background: #fff7f2;
          border-color: rgba(200,92,53,0.12);
        }
        .ssn-link::after,
        .ssn-dropdown-trigger::after {
          background: #c85c35;
          bottom: 2px;
        }
        .ssn-actions { gap: 8px; }
        .ssn-search {
          width: 180px;
          min-height: 40px;
          border-radius: 999px;
          background: #f1efe9;
          box-shadow: none;
        }
        .ssn-search:focus-within {
          width: 215px;
          border-color: #cda66a;
          box-shadow: 0 0 0 3px rgba(205,166,106,0.14);
        }
        .ssn-cta-pill {
          min-height: 40px;
          padding: 0 15px;
          background: #c85c35;
          box-shadow: 0 8px 18px rgba(200,92,53,0.2);
          font-size: 10px;
        }
        .ssn-cta-pill:hover { background: #a94427; }
        .ssn-account,
        .ssn-login {
          color: #153c37;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }
        .ssn-account:hover,
        .ssn-login:hover { color: #c85c35; }
        .ssn-account { display: inline-flex; align-items: center; gap: 9px; }
        .ssn-account-label { display: grid; line-height: 1.15; }
        .ssn-account-label small { margin-top: 3px; color: #73817c; font-size: 9px; font-weight: 600; }
        .ssn-account .sm-user-avatar { --avatar-size: 36px; }
        .ssn-account:focus-visible,
        .ssn-mobile-header-icon:focus-visible,
        .ssn-cart:focus-visible { outline: 3px solid #c89b5b; outline-offset: 3px; }
        .ssn-cart {
          color: #153c37;
          background: transparent;
          border-color: rgba(21,60,55,0.16);
        }
        .ssn-cart:hover { color: #c85c35; background: #fff7f2; }
        .ssn-mobile-header-icon { color: #153c37; }
        .ssn-mobile-header-icon:hover { color: #c85c35; }
        @media (max-width: 960px) {
          .ssn-nav { min-height: 74px; padding: 10px 16px !important; }
          .ssn-logo img { height: 52px; }
        }
      `}</style>

      <header className={`ssn-header ${scrolled ? "scrolled" : ""} ${showHeader ? "" : "hidden"}`}>
        <nav className="ssn-nav container-fluid" aria-label="Navigation principale">
          <Link to="/" className="ssn-logo" onClick={closeMenu} aria-label="Star Mousse accueil">
            <img src="/logo-star-mousse.png" alt="Star Mousse" width="160" height="44" decoding="async" />
          </Link>

          <ul className="ssn-links">
            {navLinks.map((item) => (
              <li
                key={item.to}
                className={item.children ? "ssn-dropdown" : undefined}
                onMouseEnter={() => item.children && setActiveMenu(item.label)}
                onMouseLeave={() => item.children && setActiveMenu(null)}
              >
                <Link
                  className={`${item.children ? "ssn-dropdown-trigger" : "ssn-link"} ${isActive(item.to.split("?")[0]) ? "active" : ""}`}
                  to={item.to}
                  onFocus={() => item.children && setActiveMenu(item.label)}
                >
                  {item.label}
                  {item.children && <span className={`ssn-chevron ${activeMenu === item.label ? "open" : ""}`}></span>}
                </Link>
                {item.children && activeMenu === item.label && (
                  <ul className="ssn-dropdown-menu" onMouseEnter={() => setActiveMenu(item.label)} onMouseLeave={() => setActiveMenu(null)}>
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to} onClick={closeMenu}>
                          <span className="ssn-menu-title">{child.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          
          <div className="ssn-actions">
            <form className="ssn-search" onSubmit={submitSearch}>
              <span className="ssn-search-icon" aria-hidden="true"></span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Rechercher un produit ou une catégorie"
              />
              {searchSuggestions.length > 0 && (
                <div className="ssn-search-suggestions" role="listbox">
                  {searchSuggestions.map((suggestion) => (
                    <Link
                      key={suggestion.to}
                      to={suggestion.to}
                      role="option"
                      onClick={closeMenu}
                    >
                      <span>{suggestion.label}</span>
                      <small>Voir</small>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            <Link to="/products" className="ssn-cta-pill" onClick={closeMenu}>Nos matelas</Link>

            {isLoggedIn ? (
              <Link to={accountPath} className="ssn-account" onClick={closeMenu} aria-label={`Ouvrir le compte de ${profile?.name || profile?.username || "l’utilisateur"}`}>
                <UserAvatar name={profile?.name || profile?.username || profile?.email} src={profile?.avatar || profile?.avatarUrl || profile?.photo} size={36} />
                <span className="ssn-account-label"><span>{profile?.name || profile?.username || "Mon compte"}</span><small>Espace personnel</small></span>
              </Link>
            ) : (
              <Link to="/login" className="ssn-login" onClick={closeMenu}>Se connecter</Link>
            )}

            <Link to="/cart" className="ssn-cart" onClick={closeMenu} title="Panier" aria-label="Panier">
              <span className="ssn-cart-icon"></span>
              {cartCount > 0 && <span className="ssn-cart-count">{cartCount}</span>}
            </Link>
          </div>

          <div className="ssn-mobile-header-actions">
            <Link to={isLoggedIn ? accountPath : "/login"} className="ssn-mobile-header-icon" onClick={closeMenu} aria-label="Mon compte">
              {isLoggedIn ? <UserAvatar name={profile?.name || profile?.username || profile?.email} src={profile?.avatar || profile?.avatarUrl || profile?.photo} size={28} decorative /> : <FaRegUser />}
            </Link>
            <Link to="/client-dashboard" className="ssn-mobile-header-icon" onClick={closeMenu} aria-label="Liste de souhait">
              <FaHeart />
            </Link>
            <Link to="/cart" className="ssn-mobile-header-icon" onClick={closeMenu} aria-label="Panier">
              <FiShoppingBag />
              {cartCount > 0 && <span className="ssn-cart-count">{cartCount}</span>}
            </Link>
            <button
              type="button"
              className="ssn-mobile-header-icon"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              <FiMoreHorizontal />
            </button>
          </div>
        </nav>

        <button
          type="button"
          className={`ssn-mobile-backdrop ${menuOpen ? "open" : ""}`}
          onClick={closeMenu}
          aria-label="Fermer le menu"
        ></button>

        <div className={`ssn-mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="ssn-mobile-panel">
            <button type="button" className="ssn-mobile-close" onClick={closeMenu} aria-label="Fermer le menu">
              <FiX />
            </button>

            <Link to="/" className="ssn-mobile-logo" onClick={closeMenu} aria-label="Star Mousse accueil">
              <img src="/logo-star-mousse.png" alt="Star Mousse" width="164" height="45" decoding="async" />
            </Link>

            <form className="ssn-mobile-search" onSubmit={submitSearch}>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Saisie de recherche"
              />
              <button type="submit" aria-label="Recherche">
                <FiSearch />
              </button>
            </form>

            <div className="ssn-mobile-tabs" role="tablist" aria-label="Navigation mobile">
              <button
                type="button"
                className={`ssn-mobile-tab ${mobileTab === "menu" ? "active" : ""}`}
                onClick={() => setMobileTab("menu")}
                role="tab"
                aria-selected={mobileTab === "menu"}
              >
                Menu
              </button>
              <button
                type="button"
                className={`ssn-mobile-tab ${mobileTab === "categories" ? "active" : ""}`}
                onClick={() => setMobileTab("categories")}
                role="tab"
                aria-selected={mobileTab === "categories"}
              >
                Categories
              </button>
            </div>

            <div className="ssn-mobile-list">
              {(mobileTab === "menu" ? navLinks : categoryLinks).map((item) => (
                <React.Fragment key={item.to}>
                  <Link to={item.to} className="ssn-mobile-link" onClick={closeMenu}>
                    {item.label} {item.children ? <span>+</span> : <span>&rarr;</span>}
                  </Link>
                  {item.children?.map((child) => (
                    <Link key={child.to} to={child.to} className="ssn-mobile-link sub" onClick={closeMenu}>
                      {child.label}
                    </Link>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="ssn-mobile-actions">
              {isLoggedIn ? (
                <Link to={accountPath} className="ssn-mobile-login" onClick={closeMenu}>
                  <FaRegUser /> Mon compte
                </Link>
              ) : (
                <Link to="/login" className="ssn-mobile-login" onClick={closeMenu}>
                  <FaRegUser /> Log in / sign up
                </Link>
              )}
              <Link to="/client-dashboard" className="ssn-mobile-login" onClick={closeMenu}>
                <FaHeart /> Liste de souhait
              </Link>
              <Link to="/products" className="ssn-mobile-login" onClick={closeMenu}>
                <FaRetweet /> Compare
              </Link>
              <Link to="/cart" className="ssn-mobile-cart" onClick={closeMenu}>Panier</Link>
            </div>

            <div className="ssn-mobile-socials" aria-label="Reseaux sociaux">
              {SOCIAL.facebook && <a href={SOCIAL.facebook} target="_blank" rel="nofollow noreferrer" title="Facebook" aria-label="Facebook">
                <FaFacebookF />
              </a>}
              {SOCIAL.instagram && <a href={SOCIAL.instagram} target="_blank" rel="nofollow noreferrer" title="Instagram" aria-label="Instagram">
                <FaInstagram />
              </a>}
              <a href={buildWhatsappUrl()} target="_blank" rel="nofollow noreferrer" title="Whatsapp" aria-label="Whatsapp">
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="ssn-mobile-bottom-panel" role="navigation" aria-label="Navigation mobile rapide">
        <div className="ssn-mobile-bottom-inner">
          <Link
            to="/"
            className={`ssn-mobile-panel-item ${location.pathname === "/" ? "active" : ""}`}
            onClick={closeMenu}
          >
            <FiHome />
            <span>Accueil</span>
          </Link>
          <Link
            to="/products"
            className={`ssn-mobile-panel-item ${location.pathname.startsWith("/products") || location.pathname.startsWith("/nos-matelas") ? "active" : ""}`}
            onClick={closeMenu}
          >
            <FiShoppingBag />
            <span>Produits</span>
          </Link>
          <Link
            to="/contact"
            className="ssn-mobile-panel-item"
            onClick={closeMenu}
          >
            <span className="ssn-mobile-panel-icon">
              <FaHeart />
              <span className="ssn-mobile-panel-count">0</span>
            </span>
            <span>Nos showroom</span>
          </Link>
          <Link
            to={isLoggedIn ? accountPath : "/login"}
            className={`ssn-mobile-panel-item ${location.pathname.includes("dashboard") || location.pathname === "/login" ? "active" : ""}`}
            onClick={closeMenu}
          >
            <span className="ssn-mobile-panel-icon">
              <FiShoppingBag />
            </span>
            <span>Compte</span>
          </Link>
          <button
            type="button"
            className={`ssn-mobile-panel-item ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fermer le menu plus" : "Ouvrir le menu plus"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX /> : <FiMoreHorizontal />}
            <span>Plus</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default NavBar;
