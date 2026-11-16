import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUniversity } from "react-icons/fa";
import { FiAward, FiCheck, FiMoon, FiShoppingBag, FiTruck } from "react-icons/fi";
import { getAll as getAllProducts, getRecommended as getRecommendedProducts } from "../services/apiProduct";

const FALLBACK_BEST_SELLERS = [
  {
    id: 1,
    img: "/relax1.png",
    name: "Relax Plus",
    desc: "Accueil moelleux et soutien ergonomique pour un sommeil profond.",
    price: "510 DT",
    oldPrice: "850 DT",
    discount: "Jusqu'a -40%",
    badges: ["Meilleure offre", "Best seller"],
    features: ["Hauteur 28 cm", "Ressorts ensaches", "Reversible ete/hiver"],
  },
  {
    id: 2,
    img: "/medico.jpg",
    name: "Medico Plus",
    desc: "Soutien orthopedique pense pour garder le dos bien aligne.",
    price: "420 DT",
    oldPrice: "700 DT",
    discount: "Jusqu'a -40%",
    badges: ["Orthopedique", "Offre limitee"],
    features: ["Hauteur 25 cm", "Ressorts Bonnell", "Double face mi-ferme"],
  },
  {
    id: 3,
    img: "/venise.jpg",
    name: "Tendresse",
    desc: "Un confort enveloppant avec une sensation premium des la premiere nuit.",
    price: "700 DT",
    oldPrice: "1 100 DT",
    discount: "Jusqu'a -35%",
    badges: ["Confort premium", "Favori client"],
    features: ["Hauteur prestige de 30 cm", "Tissu haute couture anti-acarien", "Confort enveloppant"],
  },
];

const getFallbackImageByName = (name = "") => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("confort")) return "/confort.png";
  if (normalizedName.includes("venise")) return "/venise.jpg";
  if (normalizedName.includes("soft")) return "/bebe_soft.jpg";
  if (normalizedName.includes("medico")) return "/medico.jpg";
  if (normalizedName.includes("tendresse")) return "/tendresse.jpg";
  if (normalizedName.includes("relax")) return "/relax_eluproduit-card.jpg";
  if (normalizedName.includes("pillow")) return "/relax_pillow.png";
  if (normalizedName.includes("baby") || normalizedName.includes("bebe")) return "/bebe_confort.jpg";

  return "/relax_eluproduit-card.jpg";
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

const USP_ITEMS = [
  {
    icon: FiMoon,
    title: "Jusqu'à 5 nuits d'essai",
  },
  {
    icon: FiTruck,
    title: "Livraison gratuite",
  },
  {
    icon: FiAward,
    title: "Jusqu'à 11 ans de garantie",
  },
  {
    icon: FaUniversity,
    title: "Paiement à la livraison",
  },
];

const HIGHLIGHT_BANNER = {
  headline: "+5 millions de clients livrés dans le monde",
  headlineNote: "3",
  description: "+140.000 avis 5 étoiles dans le monde",
  descriptionNote: "2",
};

const CATALOG_DEALS = [
  {
    title: "Super pack - Soldes d'été",
    image: "pack1.png",
    
    tags: ["Soldes d'été"],
    bullets: ["Matelas Super Orthopediques", "Oreillers ", "Protege-Matelas"],
    price: "649 DT",
    oldPrice: "1 230 DT",
    route: "/products",
  },
  {
    title: "Offre de la semaine - Prêt à rêver",
    image: "litCAPITONNE-gris.jpg",

    promo: "Offre de la semaine",
    tags: ["50% de reduction"],
    bullets: ["Lit à tête capitonnée", "Matelas orthopédiques", "2 oreillers gratuits, protège-matelas"],
    price: "1 614 DT",
    oldPrice: "2 900 DT",
    note: "Prix base sur la taille 160x190",
    route: "/product/relax-plus",
  },
  {
    title: "Matelas Relax Plus",
    image: "relax.png",

    tags: ["elu de l'année"],
    bullets: [
      "Ressorts ensachés (independance de couchage)",
      "Hauteur 27 cm",
      " Jusqu’à 130kg par personne, 2 Face (mi-ferme,relaxante), Tissu 100% coton anti-acarien",
    ],
    price: "À partir de 590 DT",
    oldPrice: "619 DT",
    route: "/product/medico-plus",
  },
  {
    title: " Matelas orthopédique",

    image: "soft.png",
    tags: ["Jusqu'a -35%"],
    bullets: [
      "Jusqu’à 80kg par personne",
      "22 cm",
      "Matelas réversible (été/hiver)",
      "Tissus 80% coton anti-acarien",
      " Garantie 3 ans"
    ],
    price: "À partir de 260 DT",
    oldPrice: "438 DT",
    route: "/products",
  },
];

const GENERIC_CAROUSEL_CARDS = [
  {
    id: "5a081442-d038-42b7-a5be-7230d6590cb0",
    
    route: "/products",
    mediaType: "image",
    poster: "/showroom1.jpg",
    src: "/caroussel1.png",
    alt: "Collection Star Mousse Performance",
  },
  {
    id: "fedfc136-a828-4497-b098-21c822456ac5",
   
    route: "/products",
    mediaType: "image",
    poster: "/showroom3.jpg",
    src: "/caroussel0.png",
    alt: "Matelas Star Mousse confort durable",
  },
  {
    id: "5d5b8ca5-3829-4583-908f-034dcad19c0b",
    
    route: "/product/relax-plus",
    mediaType: "image",
    poster: "/relax_eluproduit-card.jpg",
    src: "/caroussel3.png",
    alt: "Matelas Relax Plus Star Mousse",
  },
  {
    id: "2d7f74e5-34ac-46ef-823c-b2d5ea972a76",
    
    route: "/contact",
    mediaType: "image",
    src: "/caroussel4.jpg",
    alt: "Boutique Star Mousse",
  },
  {
    id: "c14aecff-4809-4653-95a6-7e0f6137f4eb",
   
    route: "/promos",
    mediaType: "image",
    src: "/caroussel0.png",
    alt: "Produits reconditionnés Star Mousse",
  },
];

const STAR_MOUSSE_PRODUCTS = [
  {
    id: 7978,
    category: "matelas",
    title: "Relax Plus",
    image: "/relax.png",
    alt: "Matelas Relax Plus",
    price: "510 DT",
    route: "/product/relax-plus",
    badge: "Best seller",
  },
  {
    id: 8299,
    category: "matelas",
    title: "Medico Plus",
    image: "/medico.jpg",
    alt: "Matelas Medico Plus",
    price: "420 DT",
    route: "/product/medico-plus",
    badge: "PROMO",
  },
  {
    id: 7979,
    category: "matelas",
    title: "Tendresse",
    image: "/tendresse.jpg",
    alt: "Matelas Tendresse",
    price: "700 DT",
    route: "/product/tendresse",
    badge: "PROMO",
  },
  {
    id: 8798,
    category: "matelas",
    title: "Venise Plus",
    image: "/venise.jpg",
    alt: "Matelas Venise Plus",
    price: "310 DT",
    route: "/product/venise-plus",
    badge: "PROMO",
  },
  {
    id: 7976,
    category: "matelas",
    title: "Soft Plus",
    image: "/venise2.png",
    alt: "Matelas Soft Plus",
    price: "260 DT",
    route: "/product/soft-plus",
    badge: "PROMO",
  },
  {
    id: 7976,
    category: "matelas",
    title: "Relax pillow top",
    image: "/relax_pillow.png",
    alt: "Matelas Relax pillow top",
    price: "1800 DT",
    route: "/product/soft-plus",
    badge: "PROMO",
  },
   {
    id: 7976,
    category: "matelas",
    title: "Medico pillow top",
    image: "/medico_pillow.png",
    alt: "Matelas Medico pillow top",
    price: "1500 DT",
    route: "/product/soft-plus",
    badge: "PROMO",
  },
   {
    id: 7976,
    category: "matelas",
    title: "Confort Plus",
    image: "/confort.png",
    alt: "Matelas Confort Plus",
    price: "260 DT",
    route: "/product/confort-plus",
    badge: "PROMO",
  },
  {
    id: 8313,
    category: "oreillers",
    title: "Oreiller Gel pillow",
    image: "/oreiller_gel_pillow.jpg",
    alt: "Oreiller Gel pillow",
    price: "209 DT",
    route: "/product/relax-pillow",
    badge: "PROMO",
  },
  {
    id: 8421,
    category: "oreillers",
    title: "Lot de 2 Oreillers en Fibre",
    image: "/oreillers2.jpg",
    alt: "Lot de 2 Oreillers en Fibre",
    price: "50 DT",
    route: "/product/oreiller-fibre",
    badge: "PROMO",
  },
  {
    id: 8422,
    category: "oreillers",
    title: "Lot de 5 Oreillers en Fibre",
    image: "/oreillers5.jpg",
    alt: "Lot de 5 Oreillers en Fibre",
    price: "115 DT",
    route: "/product/lot-de-5-oreillers-en-fibre",
    badge: "PROMO",
  },
  {
    id: 8423,
    category: "oreillers",
    title: "Oreillers en Fibre",
    image: "/oreillers.jpg",
    alt: "Oreillers en Fibre",
    price: "25 DT",
    route: "/product/oreiller-fibre",
    badge: "PROMO",
  },
  {
    id: 8424,
    category: "oreillers",
    title: "Oreillers sac",
    image: "/oreillessac.png",
    alt: "Oreillers sac",
    price: "80 DT",
    route: "/product/oreiller-classic",
    badge: "PROMO",
  },
  {
    id: 8424,
    category: "oreillers",
    title: "Oreiller Médical Aroma Therapy Lavande",
    image: "/oreiller_lavande.png",
    alt: "oreiller_lavande",
    price: "175 DT",
    route: "/product/oreiller-classic",
    badge: "PROMO",
  },
   {
    id: 8424,
    category: "oreillers",
    title: "Oreiller Médical Aroma Therapy Menthe",
    image: "/oreiller_menthe.png",
    alt: "oreiller_menthe",
    price: "175 DT",
    route: "/product/oreiller-classic",
    badge: "PROMO",
  },
   {
    id: 8424,
    category: "oreillers",
    title: "Oreiller Médical Aroma Therapy Océan Puff",
    image: "/oreiller_puff.png",
    alt: "oreiller_puff",
    price: "175 DT",
    route: "/product/oreiller-classic",
    badge: "PROMO",
  },
   
  {
    id: 9001,
    category: "lits",
    title: "Lit Bandes",
    image: "/Lit-Bandes-2.jpg",
    alt: "Lit Bandes",
    price: "647,000 DT - 1.230,000 DT",
    route: "/product/lit-bandes",
    badge: "NOUVEAU",
  },
  {
    id: 9002,
    category: "lits",
    title: "Lit Capitonne",
    image: "/Lit-Capitonne-1.jpg",
    alt: "Lit Capitonne",
    price: "647,000 DT - 1.230,000 DT",
    route: "/product/lit-capitonne",
    badge: "NOUVEAU",
  },
  {
    id: 9003,
    category: "lits",
    title: "Lit Carreaux",
    image: "/Lit-Carreaux-1.jpg",
    alt: "Lit Carreaux",
    price: "647,000 DT - 1.230,000 DT",
    route: "/product/lit-carreaux",
    badge: "NOUVEAU",
  },
  {
    id: 9004,
    category: "lits",
    title: "Lit Mercurey",
    image: "/Lit-Mercury-1.jpg",
    alt: "Lit Mercurey",
    price: "1.220,000 DT - 1.960,000 DT",
    route: "/product/lit-mercurey",
    badge: "NOUVEAU",
  },
  {
    id: 9005,
    category: "lits",
    title: "Commode Harmony",
    image: "/Commode-Harmony-1.jpg",
    alt: "Commode Harmony",
    price: "845,000 DT",
    route: "/product/commode-harmony",
    badge: "NOUVEAU",
  },
  {
    id: 9006,
    category: "lits",
    title: "Commode Rivera",
    image: "/Commode-Rivera-Blanc-6.jpg",
    alt: "Commode Rivera",
    price: "810,000 DT",
    route: "/product/commode-rivera",
    badge: "NOUVEAU",
  },
  {
    id: 9007,
    category: "lits",
    title: "Table de Nuit Harmony",
    image: "/Table-de-Nuit-Harmony-1.jpg",
    alt: "Table de Nuit Harmony",
    price: "300,000 DT",
    route: "/product/table-de-nuit-harmony",
    badge: "NOUVEAU",
  },
  {
    id: 9008,
    category: "lits",
    title: "Table de Nuit Rivera",
    image: "/Table-de-Nuit-Rivera-Blanc-1.jpg",
    alt: "Table de Nuit Rivera",
    price: "320,000 DT",
    route: "/product/table-de-nuit-rivera",
    badge: "NOUVEAU",
  },
  
];

const BRAND_FEATURES = [
  {
    title: "Un sommeil premium, pensé pour tous",
    text: "Des matelas conçus pour le confort, la posture et la qualité de nuit, avec des finitions premium et un service client proche.",
    action: "En savoir plus",
    route: "/nos-matelas",
    image: "/pillow1.png",
    tone: "light",
  },
  {
    title: "La maison du confort moderne",
    text: "La sélection Star Mousse associe design, durabilité et performance pour créer une chambre plus sereine et plus élégante.",
    action: "Voir plus de produits",
    route: "/products",
    image: "/pillow2.png",
    tone: "dark",
  },
];



const getBestSellerMeta = (name = "", price) => {
  const normalizedName = removeProductDimension(name).toLowerCase();
  const numericPrice = Number(price) || 0;
  const formatPrice = (value) => `${Math.round(value).toLocaleString("fr-FR")} DT`;
  const getOldPrice = (discountRatio) =>
    numericPrice ? formatPrice(numericPrice / (1 - discountRatio)) : null;

  if (normalizedName.includes("medico")) {
    return {
      desc: "Soutien orthomedical pense pour garder le dos bien aligne.",
      discount: "Jusqu'a -40%",
      badges: ["Orthopedique", "Offre limitee"],
      features: ["Garantie 9 ans ", "Soutien du dos", "Respirabilite renforcee"],
      oldPrice: getOldPrice(0.4),
    };
  }

  if (normalizedName.includes("tendresse")) {
    return {
      desc: "Un confort enveloppant avec une sensation premium des la premiere nuit.",
      discount: "Jusqu'a -35%",
      badges: ["Confort premium", "Favori client"],
      features: ["garantie 11 ans", "Soutien durable", "Finition haut confort"],
      oldPrice: getOldPrice(0.35),
    };
  }

  return {
    desc: "Accueil moelleux et soutien ergonomique pour un sommeil profond.",
    discount: "Jusqu'a -40%",
    badges: ["Meilleure offre", "Best seller"],
    features: ["garantie 5 ans", "Mousse haute densite", "Soutien quotidien"],
    oldPrice: getOldPrice(0.4),
  };
};

const Home = () => {
  const observerRef = useRef(null);
  const genericCarouselViewportRef = useRef(null);
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genericSlideIndex, setGenericSlideIndex] = useState(0);

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setGenericSlideIndex((currentIndex) => (currentIndex + 1) % GENERIC_CAROUSEL_CARDS.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const viewport = genericCarouselViewportRef.current;
    const target = viewport?.querySelectorAll(".generic-card")?.[genericSlideIndex];

    if (!viewport || !target) return;

    viewport.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  }, [genericSlideIndex]);

  // Charger les produits populaires depuis l'API
  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await getRecommendedProducts(3);
        clearTimeout(timeoutId);
        
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
          const recommendation = product.recommendation || {};
          const reviewCount = Number(recommendation.reviewCount || product.reviewCount || 0);
          const rating = reviewCount > 0
            ? Number(recommendation.averageRating || product.averageRating || 0)
            : null;

          return {
            id: product._id || product.id || product.name,
            img: normalizeProductImage(product.image, product.name),
            name: removeProductDimension(product.name),
            desc: meta.desc || getProductDesc(product),
            price: `${Number(product.price).toLocaleString("fr-FR")} DT`,
            oldPrice: meta.oldPrice,
            discount: product.discount || meta.discount,
            badges: reviewCount > 0 ? ["Avis clients", "Recommandé"] : meta.badges,
            features: meta.features,
            rating,
            reviewCount,
            recommendationScore: recommendation.rank || product.recommendationRank || 0,
            reason: recommendation.reason,
          };
        });
        setBestSellers(topProducts);
      } catch (error) {
        console.error("Erreur lors du chargement des best-sellers:", error.message);
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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --io-navy-900: #0b1f3a;
          --io-navy-700: #123c79;
          --io-navy-500: #1d5dd8;
          --io-accent: #1d5dd8;
          --io-accent-dark: #0d3d87;
          --io-gold: #9ec5ff;
          --io-ink: #151b25;
          --io-muted: #5d6672;
          --io-bg: #f8f4ee;
          --io-bg-alt: #efe9df;
          --io-card: #ffffff;
          --io-border: rgba(15, 23, 42, 0.1);
          --io-white: #ffffff;
          --io-shadow: 0 14px 38px rgba(14, 23, 39, 0.12);
        }

        .ssn-page {
          background: linear-gradient(180deg, #f8f4ee 0%, #fffdfb 100%);
          font-family: var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--io-ink);
        }

        .ssn-page h1,
        .ssn-page h2,
        .ssn-page h3,
        .ssn-page h4 {
          font-family: "Poppins", "Segoe UI", sans-serif;
          letter-spacing: -0.02em;
        }

        .ssn-hero-shell {
          background: linear-gradient(135deg, #0d1d31 0%, #162f4d 40%, #1a385e 100%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .ssn-hero-slide::before {
          background:
            linear-gradient(90deg, rgba(11, 18, 28, 0.82), rgba(17, 24, 39, 0.46) 42%, rgba(17, 24, 39, 0.26)),
            linear-gradient(180deg, rgba(12, 20, 32, 0.1), rgba(12, 20, 32, 0.4));
        }

        .ssn-hero-main-title,
        .ssn-hero-script,
        .ssn-hero-copy p,
        .ssn-hero-slider-btn,
        .ssn-hero-count-pill,
        .ssn-hero-award,
        .ssn-hero-badge-card {
          color: #ffffff;
        }

        .ssn-hero-script {
          color: rgba(255,255,255,0.88);
          font-family: "Poppins", "Segoe UI", sans-serif;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-shadow: none;
          font-size: clamp(0.9rem, 1.1vw, 1.15rem);
        }

        .ssn-hero-main-title {
          color: #ffffff;
          font-weight: 700;
          text-shadow: 0 12px 33px rgba(13, 36, 64, 0.25);
        }

        .ssn-hero-copy p {
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .ssn-hero-slider-btn {
          background: linear-gradient(135deg, var(--io-accent) 0%, var(--io-accent-dark) 100%);
          color: var(--io-white);
          border-radius: 999px;
          box-shadow: 0 18px 36px rgba(31, 95, 227, 0.28);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .ssn-hero-slider-btn:hover {
          background: linear-gradient(135deg, var(--io-accent-dark) 0%, #0d3b99 100%);
          transform: translateY(-2px) scale(1.01);
        }

        .ssn-usp-section {
          background: linear-gradient(180deg, #fffdfb 0%, #f4efe9 100%);
          border-bottom: 1px solid var(--io-border);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .ssn-usp-item {
          color: var(--io-navy-900);
          font-family: "Poppins", "Segoe UI", sans-serif;
          font-weight: 700;
        }

        .ssn-usp-item svg {
          color: var(--io-accent);
          filter: drop-shadow(0 8px 18px rgba(240,100,45,0.18));
        }

        .ssn-highlight-banner {
          background: linear-gradient(135deg, var(--io-bg-alt) 0%, #f7f2ea 100%);
          border-top: 1px solid rgba(15, 23, 42, 0.05);
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
        }

        .ssn-highlight-text h2,
        .ssn-highlight-text p {
          color: var(--io-navy-900);
        }

        .ssn-catalog-section,
        .ssn-brand-strip,
        .ssn-motion-section.star-generic-section,
        .ssn-reviews-section,
        .ssn-section-quiz,
        .ssn-section-products,
        .ssn-seo-section,
        .ssn-instagram-section,
        .ssn-star-mousse-section {
          background: var(--io-bg);
        }

        .ssn-catalog-card,
        .ssn-card,
        .ssn-review-card,
        .ssn-quiz-card {
          box-shadow: var(--io-shadow);
        }

        .ssn-catalog-card {
          background: linear-gradient(180deg, #ffffff 0%, #f9f5f1 100%);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .ssn-catalog-tag,
        .ssn-offer-pill,
        .ssn-section-kicker,
        .ssn-quiz-step-num,
        .ssn-instagram-link,
        .ssn-btn-primary {
          background: var(--io-accent);
        }

        .ssn-section-kicker {
          color: var(--io-white);
          border: none;
          border-radius: 999px;
        }

        .ssn-btn-primary {
          background: var(--io-accent);
          border-radius: 999px;
          box-shadow: 0 14px 30px rgba(232, 98, 44, 0.22);
        }

        .ssn-btn-primary:hover {
          background: var(--io-accent-dark);
        }

        .ssn-card-offer .ssn-offer-pill {
          border-radius: 999px;
        }

        .ssn-card-body h3,
        .ssn-card-body p,
        .ssn-seo-section h2,
        .ssn-seo-section h3,
        .ssn-section-header h2,
        .ssn-reviews-header h2,
        .ssn-quiz-content h2 {
          color: var(--io-navy-900);
        }

        .ssn-section-header h2,
        .ssn-reviews-header h2 {
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .ssn-card-footer,
        .ssn-card-features li,
        .ssn-review-author,
        .ssn-star-mousse-title,
        .ssn-star-mousse-price,
        .ssn-star-mousse-card {
          color: var(--io-ink);
        }

        .ssn-price {
          color: var(--io-navy-900);
        }

        .ssn-btn-card {
          background: linear-gradient(135deg, var(--io-navy-900) 0%, #1b2c4a 100%);
          border-radius: 999px;
          box-shadow: 0 12px 24px rgba(14, 23, 39, 0.18);
        }

        .ssn-btn-card:hover {
          background: linear-gradient(135deg, var(--io-accent) 0%, #ff895a 100%);
        }

        .ssn-section-products::before {
          background: linear-gradient(120deg, rgba(13, 36, 64, 0.08), rgba(232, 98, 44, 0.12), rgba(255,255,255,0));
        }

        .ssn-quiz-card {
          background: linear-gradient(135deg, var(--io-navy-900), var(--io-navy-700));
          border: 1px solid rgba(255,255,255,0.08);
        }

        .ssn-quiz-content p,
        .ssn-quiz-step,
        .ssn-quiz-content h2,
        .ssn-quiz-content h2 em {
          color: #ffffff;
        }

        .ssn-quiz-step {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }

        .ssn-star-mousse-head h2,
        .ssn-star-mousse-title,
        .ssn-star-mousse-price {
          font-family: "Poppins", "Segoe UI", sans-serif;
        }

        .ssn-star-mousse-badge {
          background: var(--io-accent);
          border-radius: 999px;
          font-weight: 700;
        }

        .ssn-star-mousse-card {
          border: 1px solid rgba(13, 36, 64, 0.08);
          background: #fff;
          border-radius: 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ssn-star-mousse-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 38px rgba(13, 36, 64, 0.08);
        }

        .ssn-review-card {
          border-radius: 16px;
        }

        .ssn-review-stars {
          color: var(--io-accent);
        }

        .ssn-brand-panel {
          border-radius: 0;
        }

        .ssn-brand-content h2 {
          color: #fff;
        }

        .ssn-brand-content p {
          color: rgba(255,255,255,0.88);
        }

        .ssn-brand-action {
          background: var(--io-accent);
          border-radius: 999px;
          font-family: "Poppins", "Segoe UI", sans-serif;
          padding-inline: 28px;
        }

        .ssn-brand-action:hover {
          background: var(--io-accent-dark);
        }

        .ssn-brand-panel.dark .ssn-brand-content h2,
        .ssn-brand-panel.dark .ssn-brand-content p {
          color: #ffffff;
        }

        /* -- FADE ANIMATION -- */
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

        /*! elementor-pro - v3.33.0 - 03-12-2025 */
        .e-lottie__container {
          display:inline-block;
          max-width:var(--lottie-container-max-width);
          opacity:var(--lottie-container-opacity);
          width:var(--lottie-container-width)
        }
        .e-lottie__container:hover {
          opacity:var(--lottie-container-opacity-hover);
          transition-duration:var(--lottie-container-transition-duration-hover)
        }
        .e-lottie__container svg,
        .e-lottie__container svg * {
          transition:none!important
        }
        .e-lottie__caption {
          color:var(--caption-color);
          margin-top:var(--caption-margin-top);
          text-align:var(--caption-text-align)
        }

        /* -- HERO EXACT MATCH -- */
        .ssn-hero-shell {
          position: relative;
          min-height: 560px;
          overflow: hidden;
          background:
            linear-gradient(110deg, rgba(31,55,65,0.98) 0%, rgba(31,55,65,0.9) 46%, rgba(184,92,56,0.58) 100%),
            url('/showroom4.jpg') center/cover no-repeat;
          border-bottom: 1px solid rgba(31,45,53,0.12);
          padding: 0;
        }
        .ssn-hero-apply-wrap {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
          align-items: center;
          width: min(1400px, calc(100% - 48px));
          min-height: 560px;
          margin: 0 auto;
          padding: 70px 0 48px;
          z-index: 2;
        }
        .ssn-hero-apply-content {
          max-width: 620px;
          position: relative;
          z-index: 2;
          padding-left: 12px;
        }
        .ssn-hero-apply-title {
          margin: 0;
          font-family: var(--e-global-typography-text-font-family, "Noto Sans"), sans-serif;
          font-weight: 700;
          line-height: 0.92;
          letter-spacing: -0.05em;
          color: #ffffff;
          font-size: clamp(2.8rem, 4vw, 5.6rem);
        }
        .ssn-hero-apply-title > span {
          display: block;
        }
        .ssn-hero-rotator-wrap {
          position: relative;
          display: inline-block;
          min-width: 320px;
          min-height: 1.2em;
          color: #e7c58f;
        }
        .ssn-hero-rotator-text {
          display: inline-block;
          color: #e7c58f;
          font-weight: 700;
          transition: opacity 0.26s ease, transform 0.26s ease;
          animation: ssn-hero-rotate 0.28s ease both;
        }
        @keyframes ssn-hero-rotate {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ssn-hero-plain-text {
          display: inline-block;
          margin-top: 10px;
          font-size: clamp(2.6rem, 3vw, 5.1rem);
          font-weight: 700;
          letter-spacing: -0.04em;
        }
        .ssn-hero-apply-copy {
          margin: 22px 0 0;
          max-width: 520px;
          color: rgba(255,255,255,0.88);
          font-size: 1.12rem;
          line-height: 1.6;
          font-weight: 500;
        }
        .ssn-hero-apply-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
          padding: 0 30px;
          margin-top: 28px;
          border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.95);
          color: #71311f;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          box-shadow: 0 16px 42px rgba(9, 17, 52, 0.18);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ssn-hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ssn-hero-secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
          padding: 0 24px;
          margin-top: 28px;
          border: 1px solid rgba(255,255,255,0.65);
          border-radius: 999px;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          transition: background 0.18s ease, border-color 0.18s ease;
        }
        .ssn-hero-secondary-btn:hover {
          background: rgba(255,255,255,0.14);
          border-color: #ffffff;
        }
        .ssn-hero-apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 52px rgba(9, 17, 52, 0.22);
        }

        .ssn-hero-apply-visual {
          position: relative;
          min-height: 440px;
          width: 100%;
          pointer-events: none;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-left: 2%;
        }
        .ssn-hero-product-image {
          width: min(100%, 560px);
          aspect-ratio: 1.05;
          object-fit: cover;
          border: 12px solid rgba(255,253,248,0.72);
          border-radius: 2rem;
          box-shadow: 0 28px 70px rgba(15, 30, 35, 0.28);
          transform: rotate(2deg);
        }
        .ssn-campus-art {
          position: relative;
          width: min(100%, 620px);
          height: 360px;
          display: block;
          filter: drop-shadow(0 20px 38px rgba(10, 32, 77, 0.12));
        }
        .ssn-cloud-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .ssn-hero-lottie {
          display: none;
        }
        .ssn-hero-lottie g {
          transform-box: fill-box;
          transform-origin: center;
        }
        .ssn-hero-orbit {
          position: absolute;
          display: block;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 26px 60px rgba(6, 29, 95, 0.14);
        }
        .ssn-hero-wave {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          width: 100%;
          height: 90px;
          display: block;
          z-index: 1;
          pointer-events: none;
        }
        .ssn-hero-wave svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .ssn-hero-wave .elementor-shape-fill {
          fill: rgba(255,255,255,0.22);
        }
        .ssn-hero-wave .elementor-shape-fill:nth-child(2) {
          fill: rgba(255,255,255,0.18);
        }
        .ssn-hero-wave .elementor-shape-fill:nth-child(3) {
          fill: rgba(255,255,255,0.28);
        }

        @media (max-width: 920px) {
          .ssn-hero-apply-wrap {
            grid-template-columns: 1fr;
            padding: 56px 0 40px;
            min-height: 460px;
          }
          .ssn-hero-apply-content {
            max-width: 100%;
            text-align: center;
            padding-left: 0;
          }
          .ssn-hero-apply-copy {
            margin-left: auto;
            margin-right: auto;
          }
          .ssn-hero-actions {
            justify-content: center;
          }
          .ssn-hero-apply-btn {
            margin-left: auto;
            margin-right: auto;
          }
          .ssn-hero-apply-visual {
            display: none;
          }
        }

        /* -- USP BAR -- */
        .ssn-usp-section {
          background: #ffffff;
          border-bottom: none;
        }
        .ssn-usp-list {
          width: min(1780px, 100%);
          margin: 0 auto;
          padding: 46px 76px 44px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(28px, 5vw, 90px);
          list-style: none;
        }
        .ssn-usp-item {
          min-height: 62px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 24px;
          padding: 0;
          border: none;
          border-radius: 0;
          background: transparent;
          color: #25211f;
          box-shadow: none;
        }
        .ssn-usp-item svg {
          width: 36px;
          height: 36px;
          flex: 0 0 auto;
          color: #4d4641;
        }
        .ssn-usp-item span {
          max-width: 350px;
          font-size: clamp(18px, 1.2vw, 22px);
          line-height: 1.35;
          font-weight: 900;
        }

        /* -- HIGHLIGHT BANNER -- */
        .ssn-highlight-banner {
          background: #f7f5f3;
          border-bottom: none;
          height: 128px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ssn-highlight-content {
          width: auto;
          min-height: 0;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 30px;
          padding: 0;
          border-radius: 0;
          background: transparent;
          border: none;
          box-shadow: none;
          color: #25211f;
          text-align: left;
        }
        .ssn-highlight-icon {
          width: 54px;
          height: 58px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          background: transparent;
          color: #4d4641;
          border: none;
        }
        .ssn-highlight-icon svg {
          width: 54px;
          height: 54px;
          stroke-width: 1.8;
        }
        .ssn-highlight-text h2 {
          margin: 0 0 9px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 32px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0;
          color: #25211f;
        }
        .ssn-highlight-text p {
          margin: 0;
          color: #25211f;
          font-size: 15px;
          line-height: 1.25;
          font-weight: 900;
        }
        .ssn-highlight-text p::before {
          content: "★";
          display: inline-block;
          margin-right: 9px;
          color: #f2bd22;
          font-size: 14px;
          transform: translateY(-1px);
        }
        .ssn-highlight-text sup {
          margin-left: 2px;
          font-size: 0.42em;
          line-height: 0;
          color: #25211f;
          vertical-align: super;
        }

        /* -- CATALOG CAROUSEL -- */
        .ssn-catalog-section {
          background: #ffffff;
          padding: 34px 0 72px;
          border-bottom: 1px solid #ece8e3;
        }
        .ssn-catalog-heading {
          width: min(1720px, calc(100% - 136px));
          margin: 0 auto 26px;
        }
        .ssn-catalog-heading h2 {
          margin: 0;
          color: #25211f;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.05rem, 2.6vw, 3rem);
          line-height: 1.08;
          font-weight: 900;
          letter-spacing: 0;
        }
        .ssn-catalog-viewport {
          width: min(1720px, calc(100% - 136px));
          margin: 0 auto;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          scrollbar-color: #cfc8c1 transparent;
          padding-bottom: 10px;
        }
        .ssn-catalog-track {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(294px, 1fr);
          grid-template-columns: repeat(4, minmax(294px, 1fr));
          gap: 18px;
          align-items: stretch;
        }
        .ssn-catalog-card {
          min-width: 0;
          border: 0;
          border-radius: 8px;
          background: #f7f4f1;
          color: #25211f;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          scroll-snap-align: start;
          text-align: left;
          font: inherit;
          cursor: pointer;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
        }
        .ssn-catalog-card:hover {
          box-shadow: 0 14px 34px rgba(37,33,31,0.1);
          transform: translateY(-2px);
        }
        .ssn-catalog-image {
          aspect-ratio: 4 / 3;
          position: relative;
          background: #f8f7f5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ssn-catalog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }
        .ssn-catalog-card:hover .ssn-catalog-image img {
          transform: scale(1.035);
        }
        .ssn-catalog-tags {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ssn-catalog-tag {
          display: inline-flex;
          align-items: center;
          min-height: 22px;
          max-width: 100%;
          padding: 4px 9px;
          border-radius: 999px;
          background: #e11900;
          color: #ffffff;
          font-size: 12px;
          line-height: 1;
          font-weight: 900;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ssn-catalog-tag.strong {
          background: #ffc832;
          color: #2b261f;
        }
        .ssn-catalog-badge {
          position: absolute;
          right: 14px;
          bottom: 24px;
          z-index: 2;
          width: 94px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.12));
        }
        .ssn-catalog-promo {
          min-height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px 12px;
          background: #e11900;
          color: #ffffff;
          font-size: 12px;
          line-height: 1.2;
          font-weight: 900;
          text-align: center;
        }
        .ssn-catalog-promo:empty {
          display: none;
        }
        .ssn-catalog-body {
          padding: 13px 13px 14px;
          display: flex;
          flex: 1;
          flex-direction: column;
        }
        .ssn-catalog-title {
          margin: 0 0 12px;
          color: #25211f;
          font-size: 16px;
          line-height: 1.25;
          font-weight: 900;
          letter-spacing: 0;
        }
        .ssn-catalog-bullets {
          list-style: none;
          padding: 0;
          margin: 0 0 18px;
          display: grid;
          gap: 8px;
        }
        .ssn-catalog-bullets li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #3b3531;
          font-size: 13px;
          line-height: 1.35;
          font-weight: 600;
        }
        .ssn-catalog-bullets svg {
          width: 16px;
          height: 16px;
          flex: 0 0 auto;
          margin-top: 1px;
          color: #25211f;
          stroke-width: 2.4;
        }
        .ssn-catalog-price {
          margin-top: auto;
          display: flex;
          align-items: baseline;
          gap: 5px;
          flex-wrap: wrap;
        }
        .ssn-catalog-price-label {
          width: auto;
          color: #625b56;
          font-size: 13px;
          line-height: 1.1;
          font-weight: 600;
        }
        .ssn-catalog-current {
          color: #e11900;
          font-size: 16px;
          line-height: 1;
          font-weight: 900;
          white-space: nowrap;
        }
        .ssn-catalog-old {
          color: #25211f;
          font-size: 14px;
          font-weight: 700;
          text-decoration: line-through;
          white-space: nowrap;
        }
        .ssn-catalog-note {
          width: 100%;
          margin-top: 4px;
          color: #3b3531;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        /* -- BRAND FEATURE STRIP -- */
        .ssn-brand-strip {
          background: #ffffff;
          border-bottom: 1px solid #e4ddd0;
        }
        .ssn-brand-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          min-height: 550px;
        }
        .ssn-brand-panel {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 64px clamp(28px, 6vw, 86px);
          color: #0a0a0a;
          isolation: isolate;
        }
        .ssn-brand-panel.dark {
          color: #ffffff;
        }
        .ssn-brand-panel img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
          transform: scale(1.02);
        }
        .ssn-brand-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          
        }
        
        .ssn-brand-content {
          max-width: 520px;
        }
        .ssn-brand-content h2 {
          font-size: clamp(2rem, 3.2vw, 3.3rem);
          line-height: 1.15;
          font-weight: 900;
          letter-spacing: 0;
          margin-bottom: 16px;
        }
        .ssn-brand-content h2 span {
          color: #b70202;
        }
        .ssn-brand-content p {
          font-size: clamp(1.05rem, 1.8vw, 1.55rem);
          line-height: 1.45;
          font-weight: 800;
          color: inherit;
          max-width: 500px;
          margin-bottom: 26px;
        }
        .ssn-brand-panel.dark .ssn-brand-content p {
          color: black;
        }
        .ssn-brand-action {
          min-height: 46px;
          padding: 0 26px;
          border: 0;
          border-radius: 0;
          background: #0a0a0a;
          color: #ffffff;
          text-transform: uppercase;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .ssn-brand-action:hover {
          background: #b70202;
          transform: translateY(-2px);
        }

        /* -- MOTION SHOWCASE -- */
        .ssn-motion-section {
          padding: 12px 40px 100px;
          background:
            radial-gradient(circle at 12% 20%, rgba(15,79,67,0.07), transparent 28%),
            linear-gradient(180deg, #fffdf8 0%, #ffffff 100%);
        }
        .ssn-motion-reel {
          max-width: 1280px;
          min-height: 620px;
          margin: 0 auto;
          position: relative;
        }
        .ssn-motion-copy {
          width: min(520px, 100%);
          color: #12231f;
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
          font-family: Georgia, "Times New Roman", serif;
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
          background: #12231f;
          box-shadow: 0 18px 45px rgba(18,35,31,0.12);
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
          color: #12231f;
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
          color: #12231f;
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

        /* -- EDITORIAL VIDEO CARDS -- */
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
          background: #12231f;
          box-shadow: 0 22px 58px rgba(18,35,31,0.16);
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
          font-family: inherit;
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
          background: #9ec5ff;
          color: #081b42;
        }
        .ssn-editorial-pill.dark {
          background: rgba(11, 23, 56, 0.74);
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
          background: #9ec5ff;
          color: #081b42;
        }

        /* -- STAR MOUSSE GENERIC CAROUSEL -- */
        .ssn-motion-section.star-generic-section {
          padding: 52px 0 96px;
          background: #ffffff;
          overflow: hidden;
        }
        .carousel-catalog__wrapper {
          width: min(1720px, calc(100% - 96px));
          margin: 0 auto;
        }
        .section-heading__desktop.carousel-catalog__heading {
          min-height: 0;
          margin: 0;
        }
        .star-carousel {
          position: relative;
        }
        .star-carousel__viewport {
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          scrollbar-color: #cfc8c1 transparent;
          padding-bottom: 12px;
        }
        .star-carousel__container {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(286px, 1fr);
          grid-template-columns: repeat(5, minmax(286px, 1fr));
          gap: 24px;
          align-items: stretch;
        }
        .generic-card {
          min-height: clamp(520px, 70vh, 720px);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          background: #181513;
          color: #ffffff;
          isolation: isolate;
          scroll-snap-align: start;
          box-shadow: 0 16px 42px rgba(18, 35, 31, 0.12);
        }
        .generic-card__gradient {
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.28) 34%, rgba(0,0,0,0.08) 56%, rgba(0,0,0,0.54) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.22), transparent 52%);
          pointer-events: none;
        }
        .generic-card__content {
          position: absolute;
          top: 24px;
          left: 22px;
          right: 22px;
          z-index: 4;
        }
        .generic-card__title {
          margin: 0 0 8px;
          max-width: 330px;
          color: #ffffff;
          font-size: clamp(1.55rem, 2vw, 2.15rem);
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: 0;
        }
        .generic-card__description {
          margin: 0 0 14px;
          max-width: 300px;
          color: rgba(255,255,255,0.94);
          font-size: 15px;
          line-height: 1.35;
          font-weight: 800;
        }
        .generic-card__tag {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          width: fit-content;
          padding: 7px 12px;
          border-radius: 999px;
          background: #4d4db7;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 10px 24px rgba(0,0,0,0.18);
        }
        .generic-card__tag.critical {
          background: #e11900;
        }
        .generic-card__button {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 5;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #25211f;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 16px 34px rgba(0,0,0,0.24);
          text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .generic-card__button svg {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }
        .generic-card:hover .generic-card__button {
          transform: translateX(3px);
          background: #9ec5ff;
        }
        .generic-card.active .generic-card__button {
          background: #9ec5ff;
        }
        .generic-card__asset-wrapper,
        .generic-card__asset,
        .video-player,
        .aspect-ratio,
        .video-player__contained,
        .picture_ratio {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
        }
        .generic-card__asset video,
        .generic-card__asset img,
        .generic-card__asset-wrapper video,
        .generic-card__asset-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.02);
          transition: transform 0.6s ease, filter 0.4s ease;
          filter: saturate(1.04) contrast(1.02);
        }
        .generic-card:hover video,
        .generic-card:hover img {
          transform: scale(1.08);
          filter: saturate(1.1) contrast(1.05);
        }
        .video-player__button {
          position: absolute;
          left: 18px;
          bottom: 18px;
          z-index: 5;
        }
        .media-control__button {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.92);
          color: #25211f;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(0,0,0,0.2);
        }
        .media-control__button svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }
        .star-carousel__nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 18px;
        }
        .star-carousel__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 0;
          background: #d6d0ca;
          cursor: pointer;
          padding: 0;
          transition: width 0.2s ease, background 0.2s ease;
        }
        .star-carousel__dot.active {
          width: 28px;
          border-radius: 999px;
          background: #25211f;
        }
        @media (max-width: 900px) {
          .ssn-motion-section.star-generic-section {
            padding: 36px 0 64px;
          }
          .carousel-catalog__wrapper {
            width: calc(100% - 32px);
          }
          .star-carousel__container {
            display: flex;
            gap: 16px;
          }
          .generic-card {
            min-width: min(82vw, 380px);
            min-height: 560px;
          }
        }
        @media (max-width: 520px) {
          .carousel-catalog__wrapper {
            width: calc(100% - 20px);
          }
          .generic-card {
            min-width: 88vw;
            min-height: 500px;
          }
          .generic-card__content {
            top: 20px;
            left: 18px;
            right: 18px;
          }
          .generic-card__title {
            font-size: 1.55rem;
          }
          .generic-card__button {
            width: 50px;
            height: 50px;
          }
        }

        /* -- INSTAGRAM PREVIEW -- */
        .ssn-instagram-section {
          padding: 76px 40px;
          background: #ffffff;
          border-top: 1px solid #e4ddd0;
          border-bottom: 1px solid #e4ddd0;
        }
        .ssn-instagram-head {
          max-width: 1180px;
          margin: 0 auto 28px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 22px;
        }
        .ssn-instagram-head h2 {
          font-size: clamp(1.9rem, 3vw, 2.7rem);
          line-height: 1.15;
          margin: 10px 0 0;
          color: #12231f;
          letter-spacing: 0;
        }
        .ssn-instagram-head p {
          color: #64706c;
          font-size: 15px;
          line-height: 1.65;
          max-width: 560px;
          margin-top: 8px;
        }
        .ssn-instagram-link {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border-radius: 8px;
          background: #408bd1;
          color: #ffffff;
          text-decoration: none;
          font-weight: 900;
          white-space: nowrap;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .ssn-instagram-link:hover {
          background: #0a0a0a;
          transform: translateY(-2px);
        }
        .ssn-instagram-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .ssn-instagram-card {
          aspect-ratio: 1 / 1;
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          background: #12231f;
          color: #ffffff;
        }
        .ssn-instagram-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
        }
        .ssn-instagram-card:hover img {
          transform: scale(1.08);
        }
        .ssn-instagram-card span {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          z-index: 2;
          font-size: 13px;
          font-weight: 900;
          text-shadow: 0 4px 16px rgba(0,0,0,0.45);
        }
        .ssn-instagram-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.68));
        }

        .ssn-star-mousse-section {
          background: #ffffff;
          padding: 74px 32px 78px;
          border-top: 1px solid #f2f2f2;
        }
        .ssn-star-mousse-inner {
          max-width: 1040px;
          margin: 0 auto;
        }
        .ssn-star-mousse-head {
          text-align: center;
          margin-bottom: 26px;
        }
        .ssn-star-mousse-head h2 {
          color: #2a2a2a;
          font-family: 'Lato', 'DM Sans', sans-serif;
          font-size: 24px;
          line-height: 1.35;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .ssn-star-mousse-head p {
          color: #4c4c4c;
          font-size: 13px;
          line-height: 1.65;
          margin: 0;
        }
        .ssn-star-mousse-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px 28px;
        }
        .ssn-star-mousse-card {
          min-width: 0;
          text-align: center;
        }
        .ssn-star-mousse-image {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #eeeeee;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .ssn-star-mousse-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.26s ease;
        }
        .ssn-star-mousse-card:hover .ssn-star-mousse-image img {
          transform: scale(1.035);
        }
        .ssn-star-mousse-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          min-height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 7px;
          background: #c0006f;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          line-height: 1;
          text-transform: uppercase;
          z-index: 1;
        }
        .ssn-star-mousse-title {
          margin: 13px 0 6px;
          border: none;
          background: transparent;
          color: #222222;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.35;
          min-height: 18px;
          padding: 0;
        }
        .ssn-star-mousse-title:hover {
          color: #c0006f;
        }
        .ssn-star-mousse-price {
          color: #777777;
          font-size: 12px;
          line-height: 1.4;
          margin-bottom: 10px;
          white-space: nowrap;
        }
        .ssn-star-mousse-actions {
          display: inline-flex;
          align-items: stretch;
          justify-content: center;
          height: 30px;
        }
        .ssn-star-mousse-step,
        .ssn-star-mousse-qty,
        .ssn-star-mousse-cart {
          width: 30px;
          height: 30px;
          border: 1px solid #dfdfdf;
          background: #ffffff;
          color: #333333;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          line-height: 1;
        }
        .ssn-star-mousse-step {
          cursor: pointer;
        }
        .ssn-star-mousse-qty {
          border-left: 0;
          border-right: 0;
          width: 34px;
          font-weight: 500;
        }
        .ssn-star-mousse-cart {
          margin-left: 8px;
          cursor: pointer;
        }
        .ssn-star-mousse-step:hover,
        .ssn-star-mousse-cart:hover {
          border-color: #c0006f;
          color: #c0006f;
        }

        /* -- SECTION PRODUCTS -- */
        .ssn-section-products {
          background:
            linear-gradient(180deg, #ffffff 0%, #f4efe6 48%, #ffffff 100%);
          padding: 88px 40px;
          border-top: 1px solid #e4ddd0;
          border-bottom: 1px solid #e4ddd0;
          position: relative;
          overflow: hidden;
        }
        .ssn-section-products::before {
          content: '';
          position: absolute;
          inset: 34px 40px auto;
          height: 170px;
          border-radius: 14px;
          background: linear-gradient(120deg, rgba(15,79,67,0.09), rgba(232,111,69,0.13), rgba(255,255,255,0));
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
          color: #12231f;
          margin-bottom: 8px;
          letter-spacing: 0;
        }
        .ssn-section-header p {
          font-size: 15.5px;
          color: #64706c;
          font-weight: 500;
        }
        .ssn-section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          margin-bottom: 12px;
          padding: 7px 12px;
          border: 1px solid rgba(31,95,227,0.16);
          border-radius: 8px;
          background: rgba(255,255,255,0.78);
          color: #1146c2;
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
          min-height: 44px;
          padding: 10px 15px;
          border: 1px solid #e4ddd0;
          border-radius: 8px;
          background: rgba(255,255,255,0.84);
          color: #51615c;
          box-shadow: 0 12px 30px rgba(18,35,31,0.06);
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
          border: 1px solid #e4ddd0;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
          cursor: pointer;
          position: relative;
          box-shadow: 0 16px 44px rgba(18,35,31,0.08);
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
        .ssn-card:hover {
          border-color: rgba(15,79,67,0.25);
          box-shadow: 0 26px 70px rgba(18,35,31,0.14);
          transform: translateY(-6px);
        }
        .ssn-card-img {
          width: 100%;
          height: 255px;
          overflow: hidden;
          background: linear-gradient(145deg, #f4efe6 0%, #ffffff 58%, #e9f4ee 100%);
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
          background: rgba(31,95,227,0.24);
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
          border-radius: 8px;
          background: #1146c2;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2px;
          box-shadow: 0 10px 22px rgba(31,95,227,0.2);
        }
        .ssn-offer-pill.light {
          background: rgba(255,255,255,0.92);
          color: #12231f;
          border: 1px solid rgba(18,35,31,0.08);
          box-shadow: 0 10px 22px rgba(18,35,31,0.08);
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
          color: #4f625d;
          display: flex;
          align-items: center;
          gap: 5px;
          background: #fff5dc;
          border: 1px solid #ffe4a3;
          border-radius: 8px;
          padding: 5px 10px;
          font-weight: 800;
        }
        .ssn-rating.muted {
          background: #f6f6f7;
          border-color: #e7e7ec;
          color: #555866;
        }
        .ssn-card-body h3 {
          font-size: 22px;
          font-weight: 800;
          color: #12231f;
          margin-bottom: 8px;
          letter-spacing: 0;
          line-height: 1.25;
        }
        .ssn-card-body p {
          font-size: 14px;
          color: #64706c;
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
          color: #263a35;
          font-size: 13.5px;
          font-weight: 700;
        }
        .ssn-card-features li::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1146c2;
          box-shadow: 0 0 0 4px rgba(31,95,227,0.1);
          flex-shrink: 0;
        }
        .ssn-recommendation-reason {
          color: #64706c;
          font-size: 12.5px;
          line-height: 1.5;
          margin: -6px 0 16px;
          min-height: 0;
        }
        .ssn-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 18px;
          border-top: 1px solid #e4ddd0;
          margin-top: auto;
        }
        .ssn-price-block {
          min-width: 0;
        }
        .ssn-price-label {
          display: block;
          color: #64706c;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 2px;
        }
        .ssn-price {
          display: inline-block;
          font-size: 24px;
          font-weight: 900;
          color: #1146c2;
          letter-spacing: 0;
          white-space: nowrap;
        }
        .ssn-old-price {
          display: inline-block;
          margin-left: 8px;
          color: #7d8581;
          font-size: 13px;
          font-weight: 800;
          text-decoration: line-through;
          white-space: nowrap;
        }
        .ssn-btn-card {
          background: linear-gradient(135deg, #1f5fe3 0%, #1146c2 100%);
          color: #fff;
          border: none;
          min-height: 44px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, transform 0.18s;
          white-space: nowrap;
        }
        .ssn-btn-card:hover {
          background: linear-gradient(135deg, #1146c2 0%, #0d3b99 100%);
          color: #fff;
          transform: translateX(2px);
        }
        .ssn-loading {
          grid-column: 1 / -1;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64706c;
          background: rgba(255,255,255,0.72);
          border: 1px dashed #e4ddd0;
          border-radius: 12px;
          font-weight: 700;
        }

        /* -- SEO CONTENT -- */
        .ssn-seo-section {
          padding: 72px 40px;
          background: #ffffff;
          border-top: 1px solid #e4ddd0;
          border-bottom: 1px solid #e4ddd0;
        }
        .ssn-seo-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 42px;
          align-items: start;
        }
        .ssn-seo-kicker {
          display: inline-flex;
          width: fit-content;
          margin-bottom: 14px;
          padding: 7px 12px;
          border-radius: 8px;
          background: #edf5ff;
          color: #1146c2;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .ssn-seo-section h2 {
          margin: 0 0 16px;
          color: #12231f;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          line-height: 1.16;
          letter-spacing: 0;
        }
        .ssn-seo-section h3 {
          margin: 22px 0 8px;
          color: #12231f;
          font-size: 18px;
          line-height: 1.3;
        }
        .ssn-seo-section p {
          color: #51615c;
          font-size: 15.5px;
          line-height: 1.85;
          margin: 0 0 14px;
        }
        .ssn-seo-list {
          display: grid;
          gap: 10px;
          margin: 18px 0 0;
          padding: 0;
          list-style: none;
        }
        .ssn-seo-list li {
          position: relative;
          padding-left: 22px;
          color: #263a35;
          font-size: 14.5px;
          line-height: 1.65;
          font-weight: 700;
        }
        .ssn-seo-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1146c2;
        }

        /* -- AVIS CLIENTS AVANT LE QUIZ -- */
        .ssn-reviews-section {
          padding: 72px 40px;
          background: #f4efe6;
        }
        .ssn-reviews-inner {
          max-width: 1180px;
          margin: 0 auto;
        }
        .ssn-reviews-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 40px;
        }
        .ssn-reviews-header h2 {
          font-size: clamp(2rem, 2.7vw, 2.8rem);
          margin: 18px auto 12px;
          color: #12231f;
        }
        .ssn-reviews-header p {
          color: #64706c;
          font-size: 15px;
          line-height: 1.8;
        }
        .ssn-reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }
        .ssn-review-card {
          background: #ffffff;
          border: 1px solid rgba(18,35,31,0.08);
          border-radius: 12px;
          padding: 26px;
          box-shadow: 0 16px 46px rgba(18,35,31,0.08);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .ssn-review-stars {
          color: #1f5fe3;
          font-size: 1rem;
          letter-spacing: 0.1em;
        }
        .ssn-review-card p {
          color: #51615c;
          line-height: 1.8;
          font-size: 15px;
          margin: 0;
          flex: 1;
        }
        .ssn-review-author {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          color: #12231f;
          font-weight: 700;
          font-size: 14px;
        }
        .ssn-review-author span {
          color: #64706c;
          font-weight: 500;
        }

        /* -- QUIZ BANNER -- */
        .ssn-section-quiz {
          padding: 92px 40px;
          background: #e9f4ee;
        }
        .ssn-quiz-card {
          max-width: 1280px;
          margin: 0 auto;
          background: linear-gradient(135deg, #071a41 0%, #123e90 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          display: grid;
          grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.15fr);
          align-items: center;
          gap: 54px;
          padding: 34px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 28px 80px rgba(8, 27, 66, 0.2);
        }
        .ssn-quiz-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.08);
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
          border-radius: 12px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.24);
          object-fit: cover;
        }
        .ssn-quiz-content {
          position: relative;
          z-index: 1;
          padding-right: 18px;
        }
        .ssn-quiz-content h2 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2rem, 3.4vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 16px;
          letter-spacing: 0;
        }
        .ssn-quiz-content h2 em {
          color: #9ec5ff;
          font-style: italic;
        }
        .ssn-quiz-content p {
          font-size: 15.5px;
          color: #e9f4ee;
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
          border-radius: 8px;
          padding: 8px 12px 8px 8px;
        }
        .ssn-quiz-step-num {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: #9ec5ff;
          color: #081b42;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* -- RESPONSIVE -- */
        @media (max-width: 900px) {
          .ssn-hero-shell { padding: 16px; }
          .ssn-hero-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .ssn-hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .ssn-hero.split-b {
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
            grid-template-rows: none;
          }
          .ssn-hero-content {
            max-width: 100%;
            padding: 42px 28px 30px;
            text-align: left;
          }
          .ssn-hero.split-b .ssn-hero-content {
            padding: 32px 24px;
          }
          .ssn-hero-countdown { justify-content: flex-start; }
          .ssn-hero-desc { max-width: 100%; }
          .ssn-hero-btns { justify-content: flex-start; }
          .ssn-hero-visual { min-height: 420px; }
          .ssn-hero.split-b .ssn-hero-visual { min-height: 320px; }
          .ssn-hero-gradient {
            background:
              linear-gradient(180deg, rgba(244,239,230,0.98) 0%, rgba(244,239,230,0.82) 48%, rgba(244,239,230,0) 100%),
              radial-gradient(circle at 50% 16%, rgba(232,111,69,0.16), transparent 32%);
          }
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

          .ssn-star-mousse-section { padding: 56px 24px 60px; }
          .ssn-star-mousse-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
          .ssn-section-products { padding: 60px 24px; }
          .ssn-seo-section { padding: 56px 24px; }
          .ssn-seo-inner { grid-template-columns: 1fr; gap: 22px; }
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
          .ssn-hero-shell { padding: 10px; }
          .ssn-hero {
            border-radius: 8px;
          }
          .ssn-hero.split-b {
            grid-template-columns: 1fr;
          }
          .ssn-hero-content,
          .ssn-hero.split-b .ssn-hero-content {
            padding: 28px 18px 22px;
          }
          .ssn-hero-title { font-size: clamp(2rem, 10vw, 2.75rem); }
          .ssn-hero.split-b .ssn-hero-title { font-size: clamp(1.55rem, 8vw, 2.1rem); }
          .ssn-hero-countdown-time { width: 100%; justify-content: flex-start; }
          .ssn-hero-countdown-time span { min-width: 40px; }
          .ssn-hero-visual { min-height: 320px; }
          .ssn-hero.split-b .ssn-hero-visual { min-height: 260px; }
          .ssn-hero-badge-card { left: 16px; bottom: 16px; width: min(250px, 76%); text-align: left; }
          .ssn-hero-award { left: 16px; bottom: 16px; width: min(230px, 76%); text-align: left; }
          .ssn-reviews-grid { grid-template-columns: 1fr; }
          .ssn-star-mousse-section { padding: 42px 16px 46px; }
          .ssn-star-mousse-head h2 { font-size: 21px; }
          .ssn-star-mousse-grid { gap: 18px 14px; }
          .ssn-star-mousse-price { font-size: 11px; white-space: normal; }
          .ssn-section-products { padding: 28px 16px 44px; }
          .ssn-seo-section { padding: 42px 16px; }
          .ssn-section-products::before { inset: 14px 12px auto; height: 110px; }
          .ssn-section-header { margin-bottom: 18px; text-align: center; }
          .ssn-section-header h2 { text-align: center; }
          .ssn-section-chip { margin-top: 10px; }
        }
        @media (max-width: 420px) {
          .ssn-hero-title { font-size: clamp(1.82rem, 10vw, 2.45rem); }
          .ssn-hero-btns { gap: 10px; }
          .ssn-hero-btns button { width: 100%; justify-content: center; }
          .ssn-product-grid { gap: 14px; }
          .ssn-card-body { padding: 16px 14px; }
          .ssn-card-body h3 { font-size: 17px; }
          .ssn-price { font-size: 20px; }
          .ssn-editorial-arrow { width: 46px; height: 46px; }
          .ssn-editorial-video-card { min-width: 88vw; min-height: 440px; }
          .ssn-video-tile, .ssn-video-tile.large { min-height: 180px; border-radius: 18px; }
          .ssn-video-tile.large { min-height: 300px; }
        }
        @media (max-width: 380px) {
          .ssn-hero-content,
          .ssn-hero.split-b .ssn-hero-content { padding: 24px 14px 20px; }
          .ssn-star-mousse-grid { grid-template-columns: 1fr; }
          .ssn-product-grid { grid-template-columns: 1fr; }
          .ssn-section-products { padding: 22px 10px 36px; }
          .ssn-card-body { padding: 14px 10px; }
          .ssn-card-body h3 { font-size: 15px; }
          .ssn-price { font-size: 18px; }
          .ssn-editorial-content h3 { font-size: 1.4rem; }
        }
        @media (max-width: 900px) {
          .ssn-hero-shell { padding: 0; }
          .ssn-hero-slider { min-height: 560px; }
          .ssn-hero-slide { padding: 76px 22px 66px; }
          .ssn-hero-shape.one {
            width: 118px;
            height: 118px;
            right: -26px;
            top: 44px;
            border-width: 14px;
          }
          .ssn-hero-shape.two {
            width: 96px;
            height: 96px;
            left: -24px;
            bottom: 80px;
          }
          .ssn-hero-count-pill {
            width: 94px;
            height: 94px;
            right: 18px;
            bottom: 82px;
          }
          .ssn-hero-count-pill strong { font-size: 25px; }
          .ssn-hero-count-pill span { font-size: 11px; }
          .ssn-usp-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 18px 16px;
          }
          .ssn-highlight-banner {
            height: auto;
            min-height: 128px;
            padding: 24px 16px;
          }
          .ssn-highlight-content {
            align-items: center;
            justify-content: flex-start;
            gap: 22px;
            padding: 0;
          }
          .ssn-highlight-icon {
            width: 54px;
            height: 58px;
          }
          .ssn-highlight-icon svg {
            width: 54px;
            height: 54px;
          }
          .ssn-brand-grid {
            grid-template-columns: 1fr;
          }
          .ssn-brand-panel {
            min-height: 330px;
            padding: 46px 24px;
          }
          .ssn-instagram-head {
            display: block;
            text-align: center;
          }
          .ssn-instagram-link {
            margin-top: 18px;
          }
          .ssn-instagram-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 560px) {
          .ssn-hero-slider { min-height: 520px; }
          .ssn-hero-slide { padding: 70px 18px 64px; }
          .ssn-hero-script { font-size: clamp(2.35rem, 13vw, 3.6rem); }
          .ssn-hero-main-title { font-size: clamp(2.3rem, 15vw, 4rem); }
          .ssn-hero-copy p {
            font-size: 1.05rem;
            line-height: 1.45;
            margin-bottom: 26px;
          }
          .ssn-hero-slider-btn {
            width: min(260px, 100%);
            padding: 0 24px;
          }
          .ssn-hero-dots { bottom: 14px; gap: 8px; }
          .ssn-hero-dot,
          .tp-title-wrap,
          .sr7-nav-img {
            width: 38px;
            height: 76px;
          }
          .ssn-brand-panel {
            min-height: 300px;
            padding: 38px 18px;
          }
          .ssn-brand-content p {
            font-size: 1.04rem;
          }
          .ssn-instagram-section {
            padding: 52px 16px;
          }
          .ssn-instagram-grid {
            gap: 8px;
          }
          .ssn-usp-list {
            grid-template-columns: 1fr;
            padding: 14px 12px;
            gap: 10px;
          }
          .ssn-usp-item {
            min-height: 70px;
            justify-content: flex-start;
          }
          .ssn-highlight-content {
            display: grid;
            justify-items: center;
            text-align: center;
            padding: 0;
          }
          .ssn-highlight-text h2 {
            font-size: 25px;
            line-height: 1.08;
          }
          .ssn-highlight-text p {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="ssn-page">

        {/* -- HERO EXACT MATCH -- */}
        <section className="ssn-hero-shell" aria-label="L'univers Star Mousse">
          <div className="ssn-hero-apply-wrap">
            <div className="ssn-hero-apply-content">
              <h1 className="ssn-hero-apply-title">
                <span>Un sommeil de qualité</span>
                <span className="ssn-hero-rotator-wrap">
                  <span className="ssn-hero-rotator-text">commence ici</span>
                </span>
              </h1>
              <p className="ssn-hero-apply-copy">Matelas, oreillers et literie pensés pour vous offrir un confort durable.</p>
              <div className="ssn-hero-actions">
                <a className="ssn-hero-apply-btn" href="/nos-matelas">Découvrir nos matelas</a>
                <a className="ssn-hero-secondary-btn" href="/quiz">Trouver mon confort</a>
              </div>
            </div>

            <div className="ssn-hero-apply-visual" aria-hidden="true">
              <img className="ssn-hero-product-image" src="/relax_eluproduit-card.jpg" alt="" width="560" height="532" />
            </div>
          </div>

          <div className="ssn-hero-wave" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path className="elementor-shape-fill" opacity="0.33" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"></path>
              <path className="elementor-shape-fill" opacity="0.66" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"></path>
              <path className="elementor-shape-fill" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"></path>
            </svg>
          </div>
        </section>

        <section className="ssn-usp-section" aria-label="Avantages Star Mousse">
          <ul className="ssn-usp-list">
            {USP_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li className="ssn-usp-item ssn-fade" key={item.title}>
                  <Icon aria-hidden="true" />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="ssn-highlight-banner" aria-label="Preuve sociale Star Mousse">
          <div className="ssn-highlight-content ssn-fade">
            <span className="ssn-highlight-icon" aria-hidden="true">
              <FiAward />
            </span>
            <div className="ssn-highlight-text">
              <h2>
                {HIGHLIGHT_BANNER.headline}
                <sup>{HIGHLIGHT_BANNER.headlineNote}</sup>
              </h2>
              <p>
                {HIGHLIGHT_BANNER.description}
                <sup>{HIGHLIGHT_BANNER.descriptionNote}</sup>
              </p>
            </div>
          </div>
        </section>

        <section className="ssn-catalog-section" aria-label="Best sellers soldes">
          <div className="ssn-catalog-heading ssn-fade">
            <h2>Découvrez nos Best Sellers Soldés</h2>
          </div>

          <div className="ssn-catalog-viewport">
            <div className="ssn-catalog-track">
              {CATALOG_DEALS.map((deal) => (
                <button
                  className="ssn-catalog-card ssn-fade"
                  key={deal.title}
                  type="button"
                  onClick={() => navigate(deal.route)}
                  aria-label={`Voir ${deal.title}`}
                >
                  <div className="ssn-catalog-image">
                    <div className="ssn-catalog-tags">
                      {deal.tags.map((tag, index) => (
                        <span className={`ssn-catalog-tag ${index > 0 ? "strong" : ""}`} key={`${deal.title}-${tag}-${index}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <img src={deal.image} alt={deal.title} width="420" height="315" loading="lazy" decoding="async" />
                    {deal.badgeImage && (
                      <img className="ssn-catalog-badge" src={deal.badgeImage} alt="" width="94" height="42" loading="lazy" decoding="async" />
                    )}
                  </div>
                  {deal.promo && <div className="ssn-catalog-promo">{deal.promo}</div>}
                  <div className="ssn-catalog-body">
                    <h3 className="ssn-catalog-title">{deal.title}</h3>
                    <ul className="ssn-catalog-bullets">
                      {deal.bullets.map((bullet, index) => (
                        <li key={`${deal.title}-${bullet}-${index}`}>
                          <FiCheck aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="ssn-catalog-price">
                      <span className="ssn-catalog-price-label">Dès</span>
                      <span className="ssn-catalog-current">{deal.price}</span>
                      <span className="ssn-catalog-old">{deal.oldPrice}</span>
                      {deal.note && <span className="ssn-catalog-note">{deal.note}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="ssn-brand-strip" aria-label="Star Mousse Tunisie">
          <div className="ssn-brand-grid">
            {BRAND_FEATURES.map((feature, index) => (
              <article className={`ssn-brand-panel ${feature.tone} ssn-fade`} key={`${feature.title || feature.action}-${index}`}>
                <img src={feature.image} alt={feature.title} width="720" height="420" loading="lazy" decoding="async" />
                <div className="ssn-brand-content">
                  <h2>
                    {feature.title.includes("Tunisie") ? (
                      <>
                        Star Mousse <span>Tunisie</span>
                      </>
                    ) : (
                      feature.title
                    )}
                  </h2>
                  <p>{feature.text}</p>
                  <button className="ssn-brand-action" type="button" onClick={() => navigate(feature.route)}>
                    {feature.action}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ssn-star-mousse-section" aria-label="Matelas Star Mousse">
          <div className="ssn-star-mousse-inner">
            <header className="ssn-star-mousse-head ssn-fade">
              <h2>Matelas Star Mousse</h2>
              <p>Produits de 1ere gamme, conception tunisie, confort durable et savoir-faire local.</p>
            </header>

            <div className="ssn-star-mousse-grid">
              {STAR_MOUSSE_PRODUCTS.filter((product) => product.category === "matelas").map((product) => (
                <article className="ssn-star-mousse-card ssn-fade" key={`${product.category}-${product.id}-${product.title}`}>
                  <button
                    type="button"
                    className="ssn-star-mousse-image"
                    onClick={() => navigate(product.route)}
                    aria-label={`Voir ${product.title}`}
                  >
                    <span className="ssn-star-mousse-badge">{product.badge}</span>
                    <img
                      src={product.image}
                      alt={product.alt}
                      width="300"
                      height="300"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <button
                    type="button"
                    className="ssn-star-mousse-title"
                    onClick={() => navigate(product.route)}
                  >
                    {product.title}
                  </button>
                  <div className="ssn-star-mousse-price">{product.price}</div>
                  <div className="ssn-star-mousse-actions" aria-label={`Quantite ${product.title}`}>
                    <button type="button" className="ssn-star-mousse-step" aria-label="Diminuer la quantite">-</button>
                    <span className="ssn-star-mousse-qty">1</span>
                    <button type="button" className="ssn-star-mousse-step" aria-label="Augmenter la quantite">+</button>
                    <button
                      type="button"
                      className="ssn-star-mousse-cart"
                      onClick={() => navigate(product.route)}
                      aria-label={`Commander ${product.title}`}
                    >
                      <FiShoppingBag aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ssn-star-mousse-section" aria-label="Oreillers et accessoires Star Mousse">
          <div className="ssn-star-mousse-inner">
            <header className="ssn-star-mousse-head ssn-fade">
              <h2>Nos oreillers et accessoires</h2>
              <p>Oreillers et accessoires pensés pour compléter votre confort de sommeil.</p>
            </header>

            <div className="ssn-star-mousse-grid">
              {STAR_MOUSSE_PRODUCTS.filter((product) => product.category === "oreillers").map((product) => (
                <article className="ssn-star-mousse-card ssn-fade" key={`${product.category}-${product.id}-${product.title}`}>
                  <button
                    type="button"
                    className="ssn-star-mousse-image"
                    onClick={() => navigate(product.route)}
                    aria-label={`Voir ${product.title}`}
                  >
                    <span className="ssn-star-mousse-badge">{product.badge}</span>
                    <img
                      src={product.image}
                      alt={product.alt}
                      width="300"
                      height="300"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <button
                    type="button"
                    className="ssn-star-mousse-title"
                    onClick={() => navigate(product.route)}
                  >
                    {product.title}
                  </button>
                  <div className="ssn-star-mousse-price">{product.price}</div>
                  <div className="ssn-star-mousse-actions" aria-label={`Quantite ${product.title}`}>
                    <button type="button" className="ssn-star-mousse-step" aria-label="Diminuer la quantite">-</button>
                    <span className="ssn-star-mousse-qty">1</span>
                    <button type="button" className="ssn-star-mousse-step" aria-label="Augmenter la quantite">+</button>
                    <button
                      type="button"
                      className="ssn-star-mousse-cart"
                      onClick={() => navigate(product.route)}
                      aria-label={`Commander ${product.title}`}
                    >
                      <FiShoppingBag aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ssn-star-mousse-section" aria-label="Lits & Meubles Star Mousse">
          <div className="ssn-star-mousse-inner">
            <header className="ssn-star-mousse-head ssn-fade">
              <h2>Lits & Meubles</h2>
              <p>Éléments de literie et mobilier conçus pour une chambre complète et harmonieuse.</p>
            </header>

            <div className="ssn-star-mousse-grid">
              {STAR_MOUSSE_PRODUCTS.filter((product) => product.category === "lits").map((product) => (
                <article className="ssn-star-mousse-card ssn-fade" key={`${product.category}-${product.id}-${product.title}`}>
                  <button
                    type="button"
                    className="ssn-star-mousse-image"
                    onClick={() => navigate(product.route)}
                    aria-label={`Voir ${product.title}`}
                  >
                    <span className="ssn-star-mousse-badge">{product.badge}</span>
                    <img
                      src={product.image}
                      alt={product.alt}
                      width="300"
                      height="300"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <button
                    type="button"
                    className="ssn-star-mousse-title"
                    onClick={() => navigate(product.route)}
                  >
                    {product.title}
                  </button>
                  <div className="ssn-star-mousse-price">{product.price}</div>
                  <div className="ssn-star-mousse-actions" aria-label={`Quantite ${product.title}`}>
                    <button type="button" className="ssn-star-mousse-step" aria-label="Diminuer la quantite">-</button>
                    <span className="ssn-star-mousse-qty">1</span>
                    <button type="button" className="ssn-star-mousse-step" aria-label="Augmenter la quantite">+</button>
                    <button
                      type="button"
                      className="ssn-star-mousse-cart"
                      onClick={() => navigate(product.route)}
                      aria-label={`Commander ${product.title}`}
                    >
                      <FiShoppingBag aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Product recommendations removed per request */}

        <section className="ssn-motion-section star-generic-section">
          <div className="carousel-catalog__wrapper ssn-fade" data-v-9d43e96d="">
            <div className="section-heading__desktop align--left themed themed--default-minor section-heading-wrapper carousel-catalog__heading frame--container" />
            <div className="advanced-carousel-catalog__carousel-slot">
              <div className="carousel-catalog" data-test="carousel-catalog">
                <div className="star-carousel star-carousel--catalog themed themed--default-minor star-carousel--with-pagination star-carousel--with-navigation" data-testid="star-carousel">
                  <span className="visually-hidden">Diapositive {genericSlideIndex + 1} sur {GENERIC_CAROUSEL_CARDS.length}</span>
                  <div
                    className="star-carousel__viewport"
                    ref={genericCarouselViewportRef}
                    role="region"
                    aria-label="Carrousel"
                    aria-roledescription="carousel"
                  >
                    <div className="star-carousel__container" role="list">
                      {GENERIC_CAROUSEL_CARDS.map((card, index) => (
                        <article
                          className={`generic-card generic-card__desktop generic-card-carousel generic-card-large ${index === 0 ? "first-card" : ""} ${index === GENERIC_CAROUSEL_CARDS.length - 1 ? "last-card" : ""} ${index === genericSlideIndex ? "active" : ""}`}
                          id={card.id}
                          key={card.id}
                          role="group"
                          aria-roledescription="slide"
                          aria-label={`Diapositive ${index + 1} sur ${GENERIC_CAROUSEL_CARDS.length}`}
                          aria-labelledby={`generic-card-title-${index}`}
                          tabIndex={0}
                        >
                          <div className="generic-card__gradient">
                            <div className="generic-card__content">
                              <h3 className="typography body-l-600 md-heading-xs-600 generic-card__title body-l-600" id={`generic-card-title-${index}`}>
                                {card.title}
                              </h3>
                              <p className="typography body-xs-600 md-body-s-600 generic-card__description" id={`generic-card-desc-${index}`}>
                                {card.description}
                              </p>
                              {card.tag && (
                                <span className={`tag themed tag--no-icon generic-card__tag ${card.tagTone}`}>
                                  <span className="typography body-xs-600 tag__label">{card.tag}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <a
                            href={card.route}
                            className="themed themed--default-minor button button--medium button--icon-filled generic-card__button"
                            aria-describedby={`generic-card-desc-${index}`}
                            aria-label={card.title}
                            onClick={(event) => {
                              event.preventDefault();
                              navigate(card.route);
                            }}
                          >
                            <svg aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24">
                              <path d="M21.5303 11.4697L13.5303 3.46973C13.2373 3.17676 12.7627 3.17676 12.4697 3.46973C12.1768 3.7627 12.1768 4.23731 12.4697 4.53028L19.1894 11.25H3C2.58594 11.25 2.25 11.5859 2.25 12C2.25 12.4141 2.58594 12.75 3 12.75H19.1894L12.4697 19.4697C12.1768 19.7627 12.1768 20.2373 12.4697 20.5303C12.6162 20.6768 12.8076 20.75 13 20.75C13.1924 20.75 13.3838 20.6768 13.5303 20.5303L21.5303 12.5303C21.666 12.3945 21.75 12.207 21.75 12C21.75 11.793 21.666 11.6055 21.5303 11.4697Z" />
                            </svg>
                          </a>

                          <div className="generic-card__asset-wrapper">
                            {card.mediaType === "video" ? (
                              <div className="video-player generic-card__asset">
                                <div className="aspect-ratio aspect-ratio_xs_9x16 video-player__contained">
                                  {card.alt && (
                                    <div id={`generic-card-alt-${index}`} tabIndex="-1" className="visually-hidden">
                                      {card.alt}
                                    </div>
                                  )}
                                  <video aria-labelledby={card.alt ? `generic-card-alt-${index}` : undefined} playsInline muted loop autoPlay poster={card.poster} preload="none">
                                    <source type="video/mp4" src={card.src} media="(min-width: 0px)" />
                                  </video>
                                  <div className="video-player__button video-player__button--shifted-left">
                                    <button className="button button--medium button--icon-filled themed themed--default-major media-control__button" type="button" aria-label="Lecture vidéo">
                                      <svg aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24">
                                        <path d="M19.4717 9.64206L10.3584 4.17429C9.49805 3.6572 8.46094 3.6445 7.58838 4.13913C6.71484 4.63376 6.19336 5.52829 6.19336 6.5322V17.4677C6.19336 18.4717 6.71484 19.3662 7.58838 19.8603C8.01465 20.1025 8.47998 20.2226 8.94434 20.2226C9.43164 20.2226 9.91797 20.0898 10.3584 19.8261L19.4727 14.3584C20.3076 13.8564 20.8066 12.9746 20.8066 11.9995C20.8057 11.0244 20.3076 10.143 19.4717 9.64206ZM18.7002 13.0722L9.58692 18.539C9.19581 18.7763 8.7251 18.7793 8.32764 18.5556C7.93018 18.33 7.69336 17.9238 7.69336 17.4677V6.5322C7.69336 6.07615 7.93018 5.66941 8.32764 5.4448C8.52149 5.33494 8.73291 5.28025 8.94385 5.28025C9.16553 5.28025 9.38623 5.34031 9.58692 5.46043L18.7002 10.9282C19.0801 11.1557 19.3067 11.5566 19.3067 12C19.3067 12.4433 19.0801 12.8447 18.7002 13.0722Z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <picture className="picture_ratio picture_ratio_xs_9x16 image-visible generic-card__asset">
                                <img src={card.src} alt={card.alt} loading="lazy" />
                              </picture>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                  <div className="star-carousel__nav" aria-label="Pagination du carrousel">
                    {GENERIC_CAROUSEL_CARDS.map((card, index) => (
                      <button
                        className={`star-carousel__dot ${index === genericSlideIndex ? "active" : ""}`}
                        key={`${card.id}-dot`}
                        type="button"
                        aria-label={`Afficher la diapositive ${index + 1}`}
                        onClick={() => setGenericSlideIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram section removed per request */}

        {/* -- AVIS CLIENTS AVANT LE QUIZ -- */}
        <section className="ssn-reviews-section">
          <div className="ssn-reviews-inner">
            <header className="ssn-reviews-header">
              <span className="ssn-section-kicker">Avis Client</span>
              <h2>Ils dorment mieux avec Star Mousse</h2>
              
              <p>Des retours authentiques de clients tunisiens qui ont deja essaye nos matelas.</p>
            </header>
            <div className="ssn-reviews-grid">
              <article className="ssn-review-card ssn-fade">
                <div className="ssn-review-stars">4/5</div>
                <p>"J'ai retrouve un sommeil profond des la premiere semaine. Le matelas est equilibre, confortable et adapte aux nuits chaudes."</p>
                <div className="ssn-review-author"><strong>Amel B.</strong><span>Tunis</span></div>
              </article>
              <article className="ssn-review-card ssn-fade">
                <div className="ssn-review-stars">5/5</div>
                <p>"Tres bon soutien pour le dos. Livraison rapide et service client disponible. Je recommande sans hesiter."</p>
                <div className="ssn-review-author"><strong>Sami H.</strong><span>Sfax</span></div>
              </article>
              <article className="ssn-review-card ssn-fade">
                <div className="ssn-review-stars">4/5</div>
                <p>"Le matelas est tres confortable, il respire bien et j'ai moins mal au cou le matin. Achat facile et livraison soignee."</p>
                <div className="ssn-review-author"><strong>Leila R.</strong><span>La Marsa</span></div>
              </article>
            </div>
          </div>
        </section>

        {/* -- QUIZ BANNER -- */}
        <section className="ssn-section-quiz">
          <div className="ssn-quiz-card ssn-fade">
            <div className="ssn-quiz-img">
              <img src="/sleeping_home.jpg" alt="Quiz Sommeil" width="600" height="420" loading="lazy" decoding="async" />
            </div>
            <div className="ssn-quiz-content">
              <h2>Quel matelas <em>vous correspond</em> ?</h2>
              <p>
                Repondez a 3 questions rapides et trouvez le soutien ideal
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
              <button className="ssn-btn-primary" onClick={() => navigate('/quiz')}>Lancer le quiz</button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
