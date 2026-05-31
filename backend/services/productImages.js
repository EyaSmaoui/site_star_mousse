const PRODUCT_IMAGE_RULES = [
  { pattern: /confort/i, image: '/confort.png' },
  { pattern: /venise.*pillow|pillow.*venise/i, image: '/venise_pillow.png' },
  { pattern: /venise/i, image: '/venise.jpg' },
  { pattern: /soft/i, image: '/venise.jpg' },
  { pattern: /medico.*pillow|pillow.*medico/i, image: '/medico_pillow.png' },
  { pattern: /medico/i, image: '/medico.jpg' },
  { pattern: /relax.*pillow|pillow.*relax/i, image: '/relax_pillow.png' },
  { pattern: /relax/i, image: '/relax1.png' },
  { pattern: /tendresse.*pillow|pillow.*tendresse/i, image: '/tendresse_pillow.png' },
  { pattern: /tendresse/i, image: '/tendresse.jpg' },
  { pattern: /gel pillow/i, image: '/oreiller_gel_pillow.jpg' },
  { pattern: /lavande/i, image: '/oreiller_lavande.png' },
  { pattern: /menthe/i, image: '/oreiller_menthe.png' },
  { pattern: /ocean|océan|puff/i, image: '/oreiller_puff.png' },
  { pattern: /anatolia|forme gel/i, image: '/oreiller_forme_gel.jpg' },
  { pattern: /baby|bébé|bebe.*confort/i, image: '/bebe_confort.jpg' },
  { pattern: /bebe.*soft|bébé.*soft/i, image: '/bebe_soft.jpg' },
  { pattern: /bebe.*venise|bébé.*venise|baby venise/i, image: '/bebe_venise.jpg' },
];

const inferProductImage = (productName = '') => {
  const match = PRODUCT_IMAGE_RULES.find((rule) => rule.pattern.test(productName));
  return match ? match.image : '/logo-star-mousse.png';
};

const withProductImage = (product) => {
  if (!product) return product;
  const plain = typeof product.toObject === 'function' ? product.toObject() : product;
  return {
    ...plain,
    image: plain.image || inferProductImage(plain.name),
  };
};

module.exports = {
  PRODUCT_IMAGE_RULES,
  inferProductImage,
  withProductImage,
};
