import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getProductBySlug } from "../data/products";

const SITE_URL = (process.env.REACT_APP_SITE_URL || "https://site-star-mousse.vercel.app").replace(/\/$/, "");
const DEFAULT_IMAGE = `${SITE_URL}/relax_eluproduit.jpg`;

const ROUTE_META = {
  "/": {
    title: "Matelas Tunisie - Star Mousse Relax Plus | Borj Chakir",
    description: "Star Mousse propose des matelas orthopediques, oreillers et literie premium en Tunisie avec paiement a la livraison, showroom a Borj Chakir et garantie jusqu'a 10 ans.",
  },
  "/products": {
    title: "Tous les matelas et oreillers Star Mousse en Tunisie",
    description: "Comparez les matelas Relax Plus, Medico Plus, Tendresse, Venise Plus et les oreillers Star Mousse avec livraison en Tunisie.",
  },
  "/nos-matelas": {
    title: "Matelas ergonomique Relax Plus - Star Mousse Tunisie",
    description: "Decouvrez le matelas ergonomique Relax Plus, son soutien, ses tailles et ses offres avec paiement a la livraison en Tunisie.",
  },
  "/promos": {
    title: "Promotions matelas et oreillers - Star Mousse Tunisie",
    description: "Offres speciales Star Mousse sur les matelas, oreillers et packs literie avec livraison en Tunisie.",
  },
  "/about": {
    title: "A propos de Star Mousse - Fabrication locale en Tunisie",
    description: "En savoir plus sur Star Mousse, expert tunisien du sommeil, des matelas orthopediques et de la literie premium.",
  },
  "/help": {
    title: "Aide, livraison et garantie - Star Mousse",
    description: "Informations sur la livraison, la garantie, le paiement a la livraison et le service client Star Mousse.",
  },
  "/contact": {
    title: "Contact Star Mousse - Showroom Borj Chakir",
    description: "Contactez Star Mousse pour un conseil matelas, une commande ou une question sur la livraison en Tunisie.",
  },
  "/privacy-policy": {
    title: "Politique de confidentialite - Star Mousse",
    description: "Politique de confidentialite de Star Mousse pour les donnees clients et les demandes de contact.",
  },
  "/legal-terms": {
    title: "Mentions legales et CGV - Star Mousse",
    description: "Mentions legales, conditions generales de vente et informations professionnelles Star Mousse.",
  },
  "/quiz": {
    title: "Quiz sommeil - Trouver votre matelas Star Mousse",
    description: "Repondez au quiz Star Mousse pour trouver le matelas adapte a votre position de sommeil, votre morphologie et votre budget.",
  },
};

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function setJsonLd(id, data) {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.id = id;
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#local-business`,
    name: "Star Mousse",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo-star-mousse.png`,
    image: DEFAULT_IMAGE,
    telephone: "+216 22 900 131",
    priceRange: "TND",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Borj Chakir",
      addressLocality: "Tunis",
      addressCountry: "TN",
    },
    areaServed: "Tunisie",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: ["https://wa.me/21622900207"],
  };
}

function buildProductSchema(product, canonicalUrl) {
  const firstSize = product.sizes?.[product.defaultSizeIndex ?? 0] || product.sizes?.[0];
  const price = firstSize?.price || product.price;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: (product.images || []).map((image) => `${SITE_URL}${image}`),
    brand: {
      "@type": "Brand",
      name: "Star Mousse",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "TND",
      price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Star Mousse",
      },
    },
  };
}

export default function SEO() {
  const location = useLocation();
  const productMatch = location.pathname.match(/^\/product\/([^/]+)\/?$/);
  const slug = productMatch ? decodeURIComponent(productMatch[1]) : null;
  const product = slug ? getProductBySlug(slug) : null;

  const meta = useMemo(() => {
    if (product) {
      return {
        title: `${product.name} - Prix et commande | Star Mousse Tunisie`,
        description: product.description,
        image: product.images?.[0] ? `${SITE_URL}${product.images[0]}` : DEFAULT_IMAGE,
      };
    }

    return ROUTE_META[location.pathname] || ROUTE_META["/"];
  }, [location.pathname, product]);

  useEffect(() => {
    const cleanPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${SITE_URL}${cleanPath}`;
    const image = meta.image || DEFAULT_IMAGE;

    document.title = meta.title;
    upsertMeta('meta[name="description"]', { name: "description", content: meta.description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: "index, follow" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: meta.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: meta.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: meta.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    upsertLink("canonical", canonicalUrl);

    setJsonLd("star-mousse-local-business-schema", buildLocalBusinessSchema());

    if (product) {
      setJsonLd("star-mousse-page-schema", buildProductSchema(product, canonicalUrl));
    } else {
      setJsonLd("star-mousse-page-schema", {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: meta.title,
        description: meta.description,
        url: canonicalUrl,
        isPartOf: {
          "@type": "WebSite",
          name: "Star Mousse",
          url: `${SITE_URL}/`,
        },
      });
    }
  }, [location.pathname, meta, product]);

  return null;
}
