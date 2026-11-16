import { getAll, getBySlug } from './apiProduct';
import { PRODUCTS } from '../data/products';

const slugify = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const normalizeProduct = (product = {}) => {
  const slug = product.slug || product.productId || slugify(product.name);
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const sizes = variants.length
    ? variants.map((variant) => ({
      label: variant.size || variant.color || 'Standard',
      price: Number(variant.price ?? product.price ?? 0),
      stock: variant.stock,
    }))
    : (Array.isArray(product.sizes) ? product.sizes : []);

  return {
    ...product,
    slug,
    name: product.name || 'Produit Star Mousse',
    image: product.image || product.images?.[0] || '/logo-star-mousse.png',
    images: product.images?.length ? product.images : [product.image || '/logo-star-mousse.png'],
    price: Number(product.price || sizes[0]?.price || 0),
    sizes,
    guarantee: product.guarantee || (product.warranty ? `${product.warranty} ans` : ''),
  };
};

export const getCatalogProducts = async () => {
  try {
    const products = await getAll();
    if (products.length) return products.map(normalizeProduct);
  } catch (error) {
    console.warn('Catalogue API indisponible, utilisation du catalogue de secours:', error.message);
  }
  return PRODUCTS.map(normalizeProduct);
};

export const getCatalogProductBySlug = async (slug) => {
  try {
    return normalizeProduct(await getBySlug(slug));
  } catch {
    return normalizeProduct(PRODUCTS.find((product) => product.slug === slug) || {});
  }
};
