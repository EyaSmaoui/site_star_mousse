export const CONTACT = {
  phoneTel: "+21622900131",
  phoneDisplay: "+216 22 900 131",
  phoneShort: "22 900 131",
  whatsappTel: "21622900207",
  whatsappDisplay: "22 900 207",
  email: "support@starmousse.tn",
};

export const SOCIAL = {
  facebook: "https://www.facebook.com/SuperSiestaBorjChakir/",
  instagram: "https://www.instagram.com/super_siesta_tunis/",
  youtube: "https://www.youtube.com/@StarMousseTunisie",
};

export const MAPS = {
  showroomSearch:
    "https://www.google.com/maps/search/?api=1&query=Borj%20Chakir%20Tunis%20Tunisie",
  showroomEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.123456789!2d10.123456!3d36.789456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd35bd04c39e35%3A0x123456789abc!2sBorj%20Chakir%2C%20Tunis",
};

export const ROUTES = {
  home: "/",
  products: "/products",
  matelas: "/nos-matelas",
  promos: "/promos",
  contact: "/contact",
  about: "/about",
  help: "/help",
  quiz: "/quiz",
  cart: "/cart",
  b2b: "/b2b-export",
  b2bQuote: "/b2b-export#devis-pro",
  legal: "/legal-terms",
  privacy: "/privacy-policy",
  product: (slug) => `/product/${slug}`,
};

export function buildWhatsappUrl(message) {
  const text =
    message ||
    "Bonjour Star Mousse, je voudrais des informations sur vos matelas.";
  return `https://wa.me/${CONTACT.whatsappTel}?text=${encodeURIComponent(text)}`;
}

export function buildShowroomWhatsappUrl() {
  return buildWhatsappUrl(
    "Bonjour Star Mousse, je voudrais visiter votre showroom."
  );
}

export const WHATSAPP_DEFAULT = buildWhatsappUrl();
