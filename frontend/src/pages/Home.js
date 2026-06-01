import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getAll as getAllProducts, getRecommended as getRecommendedProducts } from "../services/apiProduct";

const FALLBACK_BEST_SELLERS = [
  {
    id: 1,
    img: "/relax1.png",
    name: "Relax Plus",
    desc: "Accueil moelleux et soutien ergonomique pour un sommeil profond.",
    price: "510 DT",
    oldPrice: "850 DT",
    discount: "Jusqu'à -40%",
    badges: ["Meilleure offre", "Best seller"],
    features: ["Confort équilibré", "Mousse haute densité", "Soutien quotidien"],
  },
  {
    id: 2,
    img: "/medico.jpg",
    name: "Medico Plus",
    desc: "Soutien orthopédique pensé pour garder le dos bien aligné.",
    price: "420 DT",
    oldPrice: "700 DT",
    discount: "Jusqu'à -40%",
    badges: ["Orthopédique", "Offre limitée"],
    features: ["Fermeté maîtrisée", "Soutien du dos", "Respirabilité renforcée"],
  },
  {
    id: 3,
    img: "/tendresse.jpg",
    name: "Tendresse",
    desc: "Un confort enveloppant avec une sensation premium dès la première nuit.",
    price: "700 DT",
    oldPrice: "1 100 DT",
    discount: "Jusqu'à -35%",
    badges: ["Confort premium", "Favori client"],
    features: ["Accueil enveloppant", "Soutien durable", "Finition haut confort"],
  },
];

const getFallbackImageByName = (name = "") => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("confort")) return "/confort.png";
  if (normalizedName.includes("venise")) return "/venise.jpg";
  if (normalizedName.includes("soft")) return "/bebe_soft.jpg";
  if (normalizedName.includes("medico")) return "/medico.jpg";
  if (normalizedName.includes("tendresse")) return "/tendresse.jpg";
  if (normalizedName.includes("relax")) return "/relax1.png";
  if (normalizedName.includes("pillow")) return "/relax_pillow.png";
  if (normalizedName.includes("baby") || normalizedName.includes("bébé")) return "/bebe_confort.jpg";

  return "/relax1.png";
};

const normalizeProductImage = (image, productName) => {
  const fallbackImage = getFallbackImageByName(productName);
  if (!image || typeof image !== "string") return fallbackImage;

  const cleanImage = image.replace(/\\/g, "/").replace(/^public\//, "");

  if (/^https?:\/\//i.test(cleanImage)) return cleanImage;
  if (cleanImage.startsWith("/")) return cleanImage;
  if (cleanImage.startsWith("images/")) return `/${cleanImage}`;

  return cleanImage.includes(".") ? `/${cleanImage}` : fallbackImage;
};

const removeProductDimension = (name = "") =>
  name.replace(/\s+\d{2,3}x\d{2,3}$/i, "").trim();

const pickBestSellerProducts = (products) => {
  const bestSellerNames = ["Relax Plus", "Medico Plus", "Tendresse"];

  return bestSellerNames
    .map((sellerName) =>
      products.find((product) =>
        removeProductDimension(product.name || "").toLowerCase() === sellerName.toLowerCase()
      )
    )
    .filter(Boolean);
};

const getBestSellerMeta = (name = "", price) => {
  const normalizedName = removeProductDimension(name).toLowerCase();
  const numericPrice = Number(price) || 0;
  const formatPrice = (value) => `${Math.round(value).toLocaleString("fr-FR")} DT`;
  const getOldPrice = (discountRatio) =>
    numericPrice ? formatPrice(numericPrice / (1 - discountRatio)) : null;

  if (normalizedName.includes("medico")) {
    return {
      desc: "Soutien orthopédique pensé pour garder le dos bien aligné.",
      discount: "Jusqu'à -40%",
      badges: ["Orthopédique", "Offre limitée"],
      features: ["Fermeté maîtrisée", "Soutien du dos", "Respirabilité renforcée"],
      oldPrice: getOldPrice(0.4),
    };
  }

  if (normalizedName.includes("tendresse")) {
    return {
      desc: "Un confort enveloppant avec une sensation premium dès la première nuit.",
      discount: "Jusqu'à -35%",
      badges: ["Confort premium", "Favori client"],
      features: ["Accueil enveloppant", "Soutien durable", "Finition haut confort"],
      oldPrice: getOldPrice(0.35),
    };
  }

  return {
    desc: "Accueil moelleux et soutien ergonomique pour un sommeil profond.",
    discount: "Jusqu'à -40%",
    badges: ["Meilleure offre", "Best seller"],
    features: ["Confort équilibré", "Mousse haute densité", "Soutien quotidien"],
    oldPrice: getOldPrice(0.4),
  };
};

const Home = () => {
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    const fadeElements = document.querySelectorAll(".ssn-fade");
    fadeElements.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;
    const fadeElements = document.querySelectorAll(".ssn-fade");
    fadeElements.forEach((el) => observerRef.current.observe(el));
  }, [loading, bestSellers.length]);

  // Charger les produits populaires depuis l'API
  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const response = await getRecommendedProducts(3);
        const products = Array.isArray(response)
          ? response
          : Array.isArray(response?.products)
            ? response.products
            : [];

        if (!products.length) {
          const fallbackResponse = await getAllProducts();
          const fallbackProducts = Array.isArray(fallbackResponse)
            ? fallbackResponse
            : Array.isArray(fallbackResponse?.products)
              ? fallbackResponse.products
              : [];

          if (!fallbackProducts.length) {
            setBestSellers(FALLBACK_BEST_SELLERS);
            return;
          }

          products.push(...fallbackProducts);
        }

        const getProductDesc = (product) => {
          const value = product.category?.name || product.categoryName || product.category;
          if (!value || typeof value !== "string" || /^[a-f\d]{24}$/i.test(value)) {
            return "Matelas premium";
          }
          return value;
        };

        const productsToShow = products.slice(0, 3);

        const topProducts = productsToShow.map(product => {
          const meta = getBestSellerMeta(product.name, product.price);

          return {
            id: product._id,
            img: normalizeProductImage(product.image, product.name),
            name: removeProductDimension(product.name),
            desc: meta.desc || getProductDesc(product),
            price: `${Number(product.price).toLocaleString("fr-FR")} DT`,
            oldPrice: meta.oldPrice,
            discount: product.discount || meta.discount,
            badges: meta.badges,
            features: meta.features,
            rating: product.recommendation?.averageRating || product.averageRating || 4.9,
            reviewCount: product.recommendation?.reviewCount || product.reviewCount || 0,
          };
        });
        setBestSellers(topProducts);
      } catch (error) {
        console.error("Erreur lors du chargement des best-sellers:", error);
        // Fallback vers les données hardcodées en cas d'erreur
        setBestSellers(FALLBACK_BEST_SELLERS);
      } finally {
        setLoading(false);
      }
    };

    loadBestSellers();
  }, []);


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Playfair+Display:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ssn-page {
          background: #fbfaf8;
          font-family: 'DM Sans', sans-serif;
          color: #2a2a3d;
        }

        /* ── FADE ANIMATION ── */
        .ssn-fade {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .ssn-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .ssn-fade:nth-child(2) { transition-delay: 0.1s; }
        .ssn-fade:nth-child(3) { transition-delay: 0.2s; }

        /* ── HERO ── */
        .ssn-hero-shell {
          background:
            linear-gradient(115deg, rgba(251,250,248,0.94) 0%, rgba(251,250,248,0.86) 46%, rgba(255,255,255,0.68) 100%),
            url('/showroom4.jpg') center/cover no-repeat;
          border-bottom: 1px solid #ece7e1;
          position: relative;
          overflow: hidden;
        }
        .ssn-hero-shell::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 160px;
          background: linear-gradient(180deg, rgba(251,250,248,0), #fbfaf8);
          pointer-events: none;
        }
        .ssn-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
          padding: 92px 40px 76px;
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .ssn-hero-content {
          flex: 1;
          max-width: 580px;
        }

        .ssn-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.78);
          color: #9b2c2c;
          border: 1px solid rgba(181,47,47,0.16);
          font-size: 13px;
          font-weight: 800;
          padding: 8px 15px;
          border-radius: 50px;
          margin-bottom: 28px;
          letter-spacing: 0.1px;
          box-shadow: 0 14px 35px rgba(26,26,46,0.08);
        }

        .ssn-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.7rem, 5.4vw, 4.9rem);
          font-weight: 700;
          color: #151522;
          line-height: 1.04;
          margin-bottom: 22px;
          letter-spacing: 0;
        }

        .ssn-hero-title .accent {
          color: #b52f2f;
          font-style: italic;
        }

        .ssn-hero-desc {
          font-size: 16px;
          line-height: 1.8;
          color: #555568;
          margin-bottom: 36px;
          max-width: 520px;
        }

        .ssn-hero-btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 44px;
        }

        .ssn-btn-primary {
          background: #151522;
          color: #fff;
          border: none;
          padding: 15px 24px;
          border-radius: 999px;
          font-size: 14.5px;
          font-weight: 800;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.1px;
        }
        .ssn-btn-primary:hover {
          background: #b52f2f;
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(181,47,47,0.23);
        }

        .ssn-btn-secondary {
          background: rgba(255,255,255,0.72);
          color: #2a2a3d;
          border: 1.5px solid rgba(26,26,46,0.12);
          padding: 15px 24px;
          border-radius: 999px;
          font-size: 14.5px;
          font-weight: 800;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ssn-btn-secondary:hover {
          border-color: rgba(181,47,47,0.3);
          color: #b52f2f;
          box-shadow: 0 0 0 4px rgba(181,47,47,0.08);
        }

        /* Stats bar */
        .ssn-stats {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(26,26,46,0.08);
          border-radius: 18px;
          padding: 18px 28px;
          width: fit-content;
          box-shadow: 0 18px 45px rgba(26,26,46,0.08);
          backdrop-filter: blur(14px);
        }
        .ssn-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 24px;
          text-align: center;
        }
        .ssn-stat:first-child { padding-left: 0; }
        .ssn-stat:last-child { padding-right: 0; }
        .ssn-stat strong {
          font-size: 17px;
          font-weight: 700;
          color: #1a1a2e;
          display: block;
          margin-bottom: 2px;
        }
        .ssn-stat span {
          font-size: 12.5px;
          color: #9090b0;
          font-weight: 400;
        }
        .ssn-stat-divider {
          width: 1px;
          height: 36px;
          background: #ddddf0;
          flex-shrink: 0;
        }

        /* Hero visual */
        .ssn-hero-visual {
          flex: 1;
          max-width: 520px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ssn-hero-blob {
          position: absolute;
          inset: 30px 0 0 auto;
          width: 82%;
          height: 78%;
          border-radius: 28px;
          background: #efe8df;
          z-index: 0;
        }
        .ssn-hero-img {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 475px;
          aspect-ratio: 4 / 4.6;
          border-radius: 28px;
          object-fit: cover;
          box-shadow: 0 28px 80px rgba(26,26,46,0.18);
          animation: ssn-float 4s ease-in-out infinite;
        }
        .ssn-hero-card {
          position: absolute;
          left: 0;
          bottom: 26px;
          z-index: 2;
          width: min(260px, 72%);
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(26,26,46,0.08);
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 22px 50px rgba(26,26,46,0.14);
          backdrop-filter: blur(16px);
        }
        .ssn-hero-card strong {
          display: block;
          color: #151522;
          font-size: 15px;
          margin-bottom: 5px;
        }
        .ssn-hero-card span {
          color: #66677a;
          font-size: 12.5px;
          line-height: 1.5;
        }
        .ssn-hero-mini-video {
          position: absolute;
          right: 8px;
          top: 34px;
          z-index: 2;
          width: 150px;
          aspect-ratio: 1 / 1;
          border-radius: 22px;
          overflow: hidden;
          border: 4px solid rgba(255,255,255,0.82);
          box-shadow: 0 20px 48px rgba(26,26,46,0.18);
          background: #efe8df;
        }
        .ssn-hero-mini-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ssn-hero-mini-video::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(21,21,34,0), rgba(21,21,34,0.16));
          pointer-events: none;
        }
        @keyframes ssn-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        /* ── TRUST STRIP ── */
        .ssn-trust-strip {
          padding: 24px 40px 64px;
          background: #fbfaf8;
        }
        .ssn-trust-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .ssn-trust-item {
          background: #ffffff;
          border: 1px solid #ebe6df;
          border-radius: 8px;
          padding: 18px;
          box-shadow: 0 14px 35px rgba(26,26,46,0.06);
        }
        .ssn-trust-item strong {
          display: block;
          color: #151522;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .ssn-trust-item span {
          color: #6a6b78;
          font-size: 12.5px;
          line-height: 1.5;
        }

        /* ── MOTION SHOWCASE ── */
        .ssn-motion-section {
          padding: 12px 40px 100px;
          background:
            radial-gradient(circle at 12% 20%, rgba(181,47,47,0.08), transparent 28%),
            linear-gradient(180deg, #fbfaf8 0%, #ffffff 100%);
        }
        .ssn-motion-reel {
          max-width: 1280px;
          min-height: 620px;
          margin: 0 auto;
          position: relative;
        }
        .ssn-motion-copy {
          width: min(520px, 100%);
          color: #151522;
          padding: 0 0 26px;
          position: relative;
          z-index: 3;
        }
        .ssn-motion-copy::before {
          content: none;
        }
        .ssn-motion-copy > * {
          position: relative;
          z-index: 1;
        }
        .ssn-motion-copy h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.3rem, 4vw, 4rem);
          line-height: 1.08;
          margin-bottom: 18px;
          letter-spacing: 0;
        }
        .ssn-motion-copy p {
          color: #5f6377;
          font-size: 15.5px;
          line-height: 1.8;
          max-width: 500px;
        }
        .ssn-motion-indicators {
          display: flex;
          gap: 9px;
          margin-top: 22px;
        }
        .ssn-motion-indicators span {
          width: 46px;
          height: 4px;
          border-radius: 999px;
          background: rgba(21,21,34,0.12);
          overflow: hidden;
          position: relative;
        }
        .ssn-motion-indicators span::after {
          content: "";
          position: absolute;
          inset: 0;
          background: #f4c38a;
          transform: translateX(-100%);
          animation: ssn-progress 3.6s ease-in-out infinite;
        }
        .ssn-motion-indicators span:nth-child(2)::after { animation-delay: 0.45s; }
        .ssn-motion-indicators span:nth-child(3)::after { animation-delay: 0.9s; }
        .ssn-video-wall {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 280px;
          grid-template-rows: repeat(3, 1fr);
          gap: 16px;
          min-height: 520px;
        }
        .ssn-video-tile {
          min-height: 150px;
          border-radius: 22px;
          overflow: hidden;
          position: relative;
          background: #151522;
          box-shadow: 0 18px 45px rgba(26,26,46,0.12);
          border: 1px solid rgba(255,255,255,0.16);
        }
        .ssn-video-tile.large {
          grid-row: 1 / 4;
          border-radius: 34px;
          box-shadow: 0 34px 95px rgba(26,26,46,0.24);
        }
        .ssn-video-tile img,
        .ssn-video-tile video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.03);
          animation: ssn-video-pan 9s ease-in-out infinite alternate;
        }
        .ssn-video-tile video {
          display: block;
          filter: saturate(1.04) contrast(1.02);
        }
        .ssn-video-tile:nth-child(2) img,
        .ssn-video-tile:nth-child(2) video { animation-duration: 7s; animation-delay: -1.5s; }
        .ssn-video-tile:nth-child(3) img,
        .ssn-video-tile:nth-child(3) video { animation-duration: 8.5s; animation-delay: -2.4s; }
        .ssn-video-tile::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(21,21,34,0.04), rgba(21,21,34,0.48)),
            linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-120%);
          animation: ssn-shine 4.6s ease-in-out infinite;
        }
        .ssn-play-button {
          position: absolute;
          left: 22px;
          bottom: 22px;
          z-index: 2;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.92);
          color: #151522;
          font-size: 18px;
          box-shadow: 0 14px 34px rgba(0,0,0,0.2);
          animation: ssn-play-pulse 2.2s ease-in-out infinite;
        }
        .ssn-play-button::before {
          content: "";
          position: absolute;
          inset: -11px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: inherit;
        }
        .ssn-video-label {
          position: absolute;
          left: 20px;
          right: 20px;
          top: 18px;
          z-index: 2;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          text-shadow: 0 2px 14px rgba(0,0,0,0.35);
        }
        .ssn-video-meta {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 22px;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          color: #ffffff;
        }
        .ssn-video-meta strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 2.6vw, 2.6rem);
          line-height: 1.08;
          max-width: 460px;
          margin-bottom: 8px;
        }
        .ssn-video-meta span {
          display: block;
          color: rgba(255,255,255,0.78);
          font-size: 13px;
          line-height: 1.55;
          max-width: 420px;
        }
        .ssn-video-progress {
          width: 150px;
          height: 5px;
          border-radius: 999px;
          background: rgba(255,255,255,0.26);
          overflow: hidden;
          flex-shrink: 0;
        }
        .ssn-video-progress::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: #f4c38a;
          transform-origin: left;
          animation: ssn-video-progress 6s linear infinite;
        }
        .ssn-video-chip-row {
          position: absolute;
          left: 22px;
          top: 56px;
          z-index: 2;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ssn-video-chip {
          color: #151522;
          background: rgba(255,255,255,0.9);
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 11.5px;
          font-weight: 900;
        }
        @keyframes ssn-video-pan {
          from { transform: scale(1.03) translate3d(-1%, -0.8%, 0); }
          to { transform: scale(1.1) translate3d(1.4%, 1%, 0); }
        }
        @keyframes ssn-shine {
          0%, 52% { transform: translateX(-120%); }
          78%, 100% { transform: translateX(120%); }
        }
        @keyframes ssn-play-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.34), 0 14px 34px rgba(0,0,0,0.2); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 14px rgba(255,255,255,0), 0 18px 42px rgba(0,0,0,0.24); }
        }
        @keyframes ssn-progress {
          0% { transform: translateX(-100%); }
          55%, 100% { transform: translateX(0); }
        }
        @keyframes ssn-pulse {
          0%, 100% { transform: scale(1); opacity: 0.78; }
          50% { transform: scale(1.14); opacity: 1; }
        }
        @keyframes ssn-video-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        /* ── EDITORIAL VIDEO CARDS ── */
        .ssn-video-gallery {
          max-width: 1720px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
        }
        .ssn-editorial-video-card {
          min-height: clamp(520px, 72vh, 720px);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          background: #151522;
          box-shadow: 0 22px 58px rgba(21,21,34,0.16);
          isolation: isolate;
          cursor: pointer;
          transform: translateZ(0);
        }
        .ssn-editorial-video-card video,
        .ssn-editorial-video-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.04);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s;
          filter: saturate(1.04) contrast(1.03);
        }
        .ssn-editorial-video-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 28%, rgba(0,0,0,0.1) 54%, rgba(0,0,0,0.56) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.24), transparent 48%);
        }
        .ssn-editorial-video-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-130%);
          transition: transform 0.7s ease;
          pointer-events: none;
        }
        .ssn-editorial-video-card:hover video,
        .ssn-editorial-video-card:hover img {
          transform: scale(1.11);
          filter: saturate(1.12) contrast(1.06);
        }
        .ssn-editorial-video-card:hover::after {
          transform: translateX(130%);
        }
        .ssn-editorial-content {
          position: relative;
          z-index: 3;
          height: 100%;
          min-height: inherit;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 22px 20px;
          color: #ffffff;
        }
        .ssn-editorial-content h2,
        .ssn-editorial-content h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(1.65rem, 2.4vw, 2.25rem);
          line-height: 1.12;
          letter-spacing: 0;
          font-weight: 900;
          margin-bottom: 8px;
          max-width: 330px;
        }
        .ssn-editorial-content p {
          color: rgba(255,255,255,0.92);
          font-size: 15.5px;
          line-height: 1.35;
          font-weight: 800;
          max-width: 330px;
          margin-bottom: 14px;
        }
        .ssn-editorial-pill {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          min-height: 32px;
          padding: 7px 12px;
          border-radius: 999px;
          background: #4d4db7;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 10px 22px rgba(0,0,0,0.2);
        }
        .ssn-editorial-pill.gold {
          background: #f4c84f;
          color: #151522;
        }
        .ssn-editorial-pill.dark {
          background: rgba(21,21,34,0.74);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.14);
        }
        .ssn-editorial-arrow {
          align-self: flex-end;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.95);
          color: #342f2b;
          font-size: 34px;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 18px 36px rgba(0,0,0,0.26);
          transition: transform 0.22s, background 0.22s, color 0.22s;
        }
        .ssn-editorial-video-card:hover .ssn-editorial-arrow {
          transform: translateX(4px);
          background: #f4c84f;
          color: #151522;
        }

        /* ── SECTION PRODUCTS ── */
        .ssn-section-products {
          background:
            linear-gradient(180deg, #ffffff 0%, #f7f3ee 48%, #ffffff 100%);
          padding: 100px 40px;
          border-top: 1px solid #ebe6df;
          border-bottom: 1px solid #ebe6df;
          position: relative;
          overflow: hidden;
        }
        .ssn-section-products::before {
          content: '';
          position: absolute;
          inset: 34px 40px auto;
          height: 170px;
          border-radius: 28px;
          background: linear-gradient(120deg, rgba(181,47,47,0.08), rgba(243,168,87,0.14), rgba(255,255,255,0));
          pointer-events: none;
        }
        .ssn-container {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .ssn-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          text-align: left;
          margin-bottom: 38px;
        }
        .ssn-section-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.15rem);
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
          letter-spacing: 0;
        }
        .ssn-section-header p {
          font-size: 15.5px;
          color: #60607a;
          font-weight: 500;
        }
        .ssn-section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          margin-bottom: 12px;
          padding: 7px 12px;
          border: 1px solid rgba(181,47,47,0.14);
          border-radius: 999px;
          background: rgba(255,255,255,0.78);
          color: #b52f2f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }
        .ssn-section-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          min-height: 40px;
          padding: 10px 15px;
          border: 1px solid #e8e9f6;
          border-radius: 999px;
          background: rgba(255,255,255,0.84);
          color: #565675;
          box-shadow: 0 12px 30px rgba(26,26,46,0.06);
          font-size: 13px;
          font-weight: 700;
        }

        /* Product grid */
        .ssn-product-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        /* Product card */
        .ssn-card {
          background: #ffffff;
          border: 1px solid #e7e7ef;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
          cursor: pointer;
          position: relative;
          box-shadow: 0 16px 44px rgba(26,26,46,0.08);
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
        .ssn-card:hover {
          border-color: rgba(181,47,47,0.25);
          box-shadow: 0 26px 70px rgba(26,26,46,0.14);
          transform: translateY(-6px);
        }
        .ssn-card-img {
          width: 100%;
          height: 255px;
          overflow: hidden;
          background: linear-gradient(145deg, #f7f3ee 0%, #ffffff 58%, #eef2f7 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ssn-card-img::before {
          content: "";
          position: absolute;
          right: -64px;
          top: -72px;
          width: 190px;
          height: 190px;
          border-radius: 42% 58% 46% 54%;
          background: #f3a857;
          opacity: 0.24;
        }
        .ssn-card-img img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 24px;
          transition: transform 0.4s ease;
          position: relative;
          z-index: 1;
        }
        .ssn-card:hover .ssn-card-img img {
          transform: scale(1.04) translateY(-3px);
        }
        .ssn-card-offer {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          max-width: calc(100% - 28px);
        }
        .ssn-offer-pill {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #b52f2f;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2px;
          box-shadow: 0 10px 22px rgba(181,47,47,0.22);
        }
        .ssn-offer-pill.light {
          background: rgba(255,255,255,0.92);
          color: #1a1a2e;
          border: 1px solid rgba(26,26,46,0.08);
          box-shadow: 0 10px 22px rgba(26,26,46,0.08);
        }
        .ssn-card-body {
          padding: 22px 22px 24px;
          display: flex;
          flex: 1;
          flex-direction: column;
        }
        .ssn-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .ssn-rating {
          font-size: 12px;
          color: #565675;
          display: flex;
          align-items: center;
          gap: 5px;
          background: #fff8df;
          border: 1px solid #ffe9a8;
          border-radius: 999px;
          padding: 5px 10px;
          font-weight: 800;
        }
        .ssn-card-body h3 {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a2e;
          margin-bottom: 8px;
          letter-spacing: 0;
          line-height: 1.25;
        }
        .ssn-card-body p {
          font-size: 14px;
          color: #5f6377;
          line-height: 1.55;
          margin-bottom: 16px;
          min-height: 44px;
        }
        .ssn-card-features {
          list-style: none;
          display: grid;
          gap: 9px;
          margin: 0 0 20px;
          padding: 0;
        }
        .ssn-card-features li {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #2f3142;
          font-size: 13.5px;
          font-weight: 700;
        }
        .ssn-card-features li::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #b52f2f;
          box-shadow: 0 0 0 4px rgba(181,47,47,0.1);
          flex-shrink: 0;
        }
        .ssn-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 18px;
          border-top: 1px solid #eeeef7;
          margin-top: auto;
        }
        .ssn-price-block {
          min-width: 0;
        }
        .ssn-price-label {
          display: block;
          color: #777b91;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 2px;
        }
        .ssn-price {
          display: inline-block;
          font-size: 24px;
          font-weight: 900;
          color: #1a1a2e;
          letter-spacing: 0;
          white-space: nowrap;
        }
        .ssn-old-price {
          display: inline-block;
          margin-left: 8px;
          color: #9a9cac;
          font-size: 13px;
          font-weight: 800;
          text-decoration: line-through;
          white-space: nowrap;
        }
        .ssn-btn-card {
          background: #1a1a2e;
          color: #fff;
          border: none;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, transform 0.18s;
          white-space: nowrap;
        }
        .ssn-btn-card:hover {
          background: #b52f2f;
          color: #fff;
          transform: translateX(2px);
        }
        .ssn-loading {
          grid-column: 1 / -1;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #60607a;
          background: rgba(255,255,255,0.72);
          border: 1px dashed #dfe1f2;
          border-radius: 22px;
          font-weight: 700;
        }

        /* ── QUIZ BANNER ── */
        .ssn-section-quiz {
          padding: 92px 40px;
          background: #fbfaf8;
        }
        .ssn-quiz-card {
          max-width: 1280px;
          margin: 0 auto;
          background: #151522;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          display: grid;
          grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.15fr);
          align-items: center;
          gap: 54px;
          padding: 34px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 28px 80px rgba(21,21,34,0.18);
        }
        .ssn-quiz-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(181,47,47,0.22), rgba(255,255,255,0) 42%);
          z-index: 0;
          pointer-events: none;
        }
        .ssn-quiz-img {
          position: relative;
          z-index: 1;
        }
        .ssn-quiz-img img {
          width: 100%;
          height: 420px;
          border-radius: 22px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.24);
          object-fit: cover;
        }
        .ssn-quiz-content {
          position: relative;
          z-index: 1;
          padding-right: 18px;
        }
        .ssn-quiz-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.4vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 16px;
          letter-spacing: 0;
        }
        .ssn-quiz-content h2 em {
          color: #f4c38a;
          font-style: italic;
        }
        .ssn-quiz-content p {
          font-size: 15.5px;
          color: #d9d7d2;
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 520px;
        }
        .ssn-quiz-steps {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .ssn-quiz-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #f2eee9;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 8px 12px 8px 8px;
        }
        .ssn-quiz-step-num {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: #f4c38a;
          color: #151522;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .ssn-hero {
            flex-direction: column;
            padding: 54px 24px 58px;
            gap: 40px;
            text-align: center;
          }
          .ssn-hero-content { max-width: 100%; }
          .ssn-hero-desc { max-width: 100%; }
          .ssn-hero-btns { justify-content: center; }
          .ssn-stats { width: 100%; justify-content: center; flex-wrap: wrap; }
          .ssn-hero-visual { max-width: 420px; width: 100%; }
          .ssn-hero-card { left: 18px; bottom: 18px; text-align: left; }
          .ssn-hero-mini-video { width: 118px; right: 2px; top: 24px; }
          .ssn-trust-strip { padding: 22px 24px 52px; }
          .ssn-trust-inner { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .ssn-motion-section { padding: 0 24px 64px; overflow: hidden; }
          .ssn-motion-reel { min-height: auto; }
          .ssn-motion-copy { padding: 0 0 24px; }
          .ssn-video-gallery {
            display: flex;
            gap: 18px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 10px;
          }
          .ssn-editorial-video-card {
            min-width: min(78vw, 380px);
            min-height: 580px;
            scroll-snap-align: start;
          }
          .ssn-video-wall {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            min-height: auto;
          }
          .ssn-video-tile,
          .ssn-video-tile.large {
            min-height: 260px;
            grid-row: auto;
            border-radius: 24px;
          }
          .ssn-video-tile.large { min-height: 420px; }
          .ssn-video-meta {
            align-items: flex-start;
            flex-direction: column;
          }
          .ssn-video-progress { width: 100%; }

          .ssn-section-products { padding: 60px 24px; }
          .ssn-section-products::before { inset: 22px 16px auto; height: 140px; }
          .ssn-section-header {
            display: block;
            text-align: center;
            margin-bottom: 32px;
          }
          .ssn-section-kicker { margin-left: auto; margin-right: auto; }
          .ssn-section-chip { margin-top: 18px; }
          .ssn-section-quiz { padding: 60px 24px; }
          .ssn-product-grid { grid-template-columns: 1fr; }
          .ssn-quiz-card {
            grid-template-columns: 1fr;
            padding: 22px;
            gap: 28px;
          }
          .ssn-quiz-img img { height: 290px; }
          .ssn-quiz-content { padding: 0 4px 8px; }
        }
        @media (max-width: 520px) {
          .ssn-product-grid { grid-template-columns: 1fr; }
          .ssn-card-footer { align-items: stretch; flex-direction: column; }
          .ssn-btn-card { width: 100%; }
          .ssn-trust-inner { grid-template-columns: 1fr; }
          .ssn-motion-copy { padding: 0 0 22px; }
          .ssn-editorial-video-card {
            min-width: 84vw;
            min-height: 520px;
          }
          .ssn-editorial-content {
            padding: 22px 20px 18px;
          }
          .ssn-editorial-content h3 {
            font-size: 1.75rem;
          }
          .ssn-editorial-arrow {
            width: 54px;
            height: 54px;
            font-size: 30px;
          }
          .ssn-video-tile,
          .ssn-video-tile.large { min-height: 220px; border-radius: 20px; }
          .ssn-video-tile.large { min-height: 360px; }
          .ssn-video-chip-row { top: 50px; left: 16px; right: 16px; }
          .ssn-video-meta { left: 16px; right: 16px; bottom: 16px; }
          .ssn-video-meta strong { font-size: 1.45rem; }
          .ssn-play-button { width: 46px; height: 46px; left: 16px; bottom: 150px; }
          .ssn-stats { align-items: stretch; flex-direction: column; }
          .ssn-stat { padding: 0; }
          .ssn-stat-divider { width: 100%; height: 1px; }
          .ssn-hero-title { font-size: clamp(2.35rem, 12vw, 3.3rem); }
          .ssn-hero-mini-video { width: 94px; border-radius: 18px; }
        }
      `}</style>

      <div className="ssn-page">
        <NavBar />

        {/* ── HERO ── */}
        <section className="ssn-hero-shell">
          <div className="ssn-hero">
            <div className="ssn-hero-content ssn-fade">
              <div className="ssn-badge">
                Livraison offerte partout en Tunisie
              </div>

              <h1 className="ssn-hero-title">
                Matelas Ergonomique <br />
                <span className="accent">Relax Plus</span>
              </h1>

              <p className="ssn-hero-desc">
                Le Matelas ergonomique Relax Plus n'est pas simplement un matelas ; 
                c'est une expérience de sommeil conçue pour offrir confort, soutien et tranquillité d'esprit. 
                Offrez-vous le sommeil que vous méritez.
              </p>

              <div className="ssn-hero-btns">
                <button className="ssn-btn-primary" onClick={() => navigate('/nos-matelas')}>Découvrir Relax Plus</button>
                <button className="ssn-btn-secondary" onClick={() => window.open('https://wa.me/21622900207', '_blank')}>💬 WhatsApp</button>
              </div>

              <div className="ssn-stats">
                <div className="ssn-stat">
                  <strong>10 ans</strong>
                  <span>Garantie</span>
                </div>
                <div className="ssn-stat-divider"></div>
                <div className="ssn-stat">
                   <strong>24h</strong>
                  <span>Service Client</span>
                </div>
                <div className="ssn-stat-divider"></div>
                <div className="ssn-stat">
                 
                  <strong>Paiement </strong>
                  <span>à la livraison</span>
                </div>
              </div>
            </div>

            <div className="ssn-hero-visual ssn-fade">
              <div className="ssn-hero-blob"></div>
              <img
                src="/IMAGEHOME.jpg"
                alt="Matelas Star Mousse Premium"
                className="ssn-hero-img"
              />
              <div className="ssn-hero-mini-video" aria-label="Vidéo courte Star Mousse">
                <video
                  src="/video3.mp4"
                  poster="/showroom2.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="ssn-hero-card">
                <strong>Confort essayé, livraison rapide</strong>
                <span>Des matelas conçus pour le climat tunisien, avec paiement à la livraison.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="ssn-trust-strip" aria-label="Avantages Star Mousse">
          <div className="ssn-trust-inner">
            {[
              ["Fabrication locale", "Un savoir-faire tunisien et des finitions contrôlées."],
              ["Paiement à la livraison", "Commandez simplement, payez après réception."],
              ["Conseil sommeil", "Un quiz rapide pour trouver le soutien adapté."],
              ["Garantie 10 ans", "Des matériaux durables pour accompagner vos nuits."],
            ].map(([title, text]) => (
              <div className="ssn-trust-item ssn-fade" key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUITS ── */}
        <section className="ssn-section-products">
          <div className="ssn-container">
            <header className="ssn-section-header ssn-fade">
              <div>
                <span className="ssn-section-kicker">Sélection intelligente</span>
                <h2>Nos produits recommandés</h2>
                <p>Des produits mis en avant selon les avis clients et les besoins les plus fréquents.</p>
              </div>
              <span className="ssn-section-chip">⭐ Recommandations par avis</span>
            </header>

            <div className="ssn-product-grid">
              {loading ? (
                <div className="ssn-loading">Chargement des produits...</div>
              ) : (
                bestSellers.map((product) => (
                  <div className="ssn-card ssn-fade" key={product.id}>
                    <div className="ssn-card-img">
                      <div className="ssn-card-offer">
                        <span className="ssn-offer-pill">{product.discount}</span>
                        {product.badges?.slice(0, 1).map((badge) => (
                          <span className="ssn-offer-pill light" key={badge}>{badge}</span>
                        ))}
                      </div>
                      <img
                        src={product.img}
                        alt={product.name}
                        onError={(event) => {
                          event.currentTarget.src = "/relax1.png";
                        }}
                      />
                    </div>
                    <div className="ssn-card-body">
                      <div className="ssn-card-top">
                        <span className="ssn-offer-pill light">
                          {product.badges?.[1] || "Best seller"}
                        </span>
                        <div className="ssn-rating">⭐ {Number(product.rating || 4.9).toFixed(1)}</div>
                      </div>
                      <h3>{product.name}</h3>
                      <p>{product.desc}</p>
                      <ul className="ssn-card-features">
                        {product.features?.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                      <div className="ssn-card-footer">
                        <div className="ssn-price-block">
                          <span className="ssn-price-label">Dès</span>
                          <span className="ssn-price">{product.price}</span>
                          {product.oldPrice && <span className="ssn-old-price">{product.oldPrice}</span>}
                        </div>
                        <button className="ssn-btn-card" onClick={() => navigate('/products')}>Voir le produit →</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="ssn-motion-section">
          <div className="ssn-video-gallery ssn-fade" aria-label="Univers vidéo Star Mousse">
            {[
              {
                title: "Dormez mieux, vivez mieux",
                text: "Découvrez notre univers confort",
                pill: "Gamme Premium",
                pillClass: "",
                src: "/video3.mp4",
                poster: "/showroom2.jpg",
              },
              {
                title: "Des produits de qualité, accessibles à tous",
                text: "Découvrez la gamme complète",
                pill: "Gamme Original",
                pillClass: "gold",
                src: "/video1.mp4",
                poster: "/showroom4.jpg",
              },
              {
                title: "Matelas Performance",
                text: "La nouvelle référence du confort",
                pill: "Récupération physique",
                pillClass: "",
                src: "/video2.mp4",
                poster: "/sleeping_home.jpg",
              },
              {
                title: "Nos magasins",
                text: "Trouvez le magasin le plus proche de chez vous",
                pill: "Showroom Star Mousse",
                pillClass: "dark",
                src: "/videoshowroom.mp4",
                poster: "/showroom1.jpg",
              },
            ].map((item) => (
              <article className="ssn-editorial-video-card" key={item.title}>
                <video
                  src={item.src}
                  poster={item.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={item.title}
                />
                <div className="ssn-editorial-content">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <span className={`ssn-editorial-pill ${item.pillClass}`}>{item.pill}</span>
                  </div>
                  <button className="ssn-editorial-arrow" onClick={() => navigate('/products')} aria-label={`Voir ${item.title}`}>
                    →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── QUIZ BANNER ── */}
        <section className="ssn-section-quiz">
          <div className="ssn-quiz-card ssn-fade">
            <div className="ssn-quiz-img">
              <img src="/sleeping_home.jpg" alt="Quiz Sommeil" />
            </div>
            <div className="ssn-quiz-content">
              <h2>Quel matelas <em>vous correspond</em> ?</h2>
              <p>
                Répondez à 3 questions rapides et trouvez le soutien idéal
                pour votre corps et votre position de sommeil.
              </p>
              <div className="ssn-quiz-steps">
                {["Votre morphologie", "Votre position", "Votre budget"].map(
                  (step, i) => (
                    <div className="ssn-quiz-step" key={i}>
                      <span className="ssn-quiz-step-num">{i + 1}</span>
                      {step}
                    </div>
                  )
                )}
              </div>
              <button className="ssn-btn-primary" onClick={() => navigate('/quiz')}>Lancer le quiz →</button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
