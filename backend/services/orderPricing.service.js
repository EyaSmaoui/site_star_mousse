const mongoose = require('mongoose');
const Product = require('../models/product.model');

const DELIVERY_COSTS = new Map([
  ['Tunis', 8], ['Ariana', 10], ['Ben Arous', 10], ['Manouba', 12],
  ['Nabeul', 15], ['Sousse', 18], ['Monastir', 20], ['Mahdia', 20],
  ['Sfax', 22], ['Gabes', 25], ['Medenine', 25], ['Tataouine', 28],
  ['Gafsa', 24], ['Tozeur', 26], ['Kebili', 26], ['Sidi Bouzid', 22],
  ['Kairouan', 20], ['Kasserine', 24], ['Jendouba', 22], ['Le Kef', 22],
  ['Siliana', 22], ['Bizerte', 18],
]);

const normalize = (value) => String(value || '').trim();

const getDeliveryCost = (region) => {
  const entry = [...DELIVERY_COSTS.entries()].find(([name]) => name.toLowerCase() === normalize(region).toLowerCase());
  return entry ? entry[1] : 0;
};

const isSupportedDeliveryRegion = (region) => [...DELIVERY_COSTS.keys()]
  .some((name) => name.toLowerCase() === normalize(region).toLowerCase());

const resolveVariantPrice = (product, item) => {
  const requestedDimension = normalize(item.dimension || item.size);
  if (!requestedDimension || !Array.isArray(product.variants)) return product.price;

  const variant = product.variants.find((candidate) => (
    normalize(candidate.size).toLowerCase() === requestedDimension.toLowerCase()
    || normalize(candidate.color).toLowerCase() === requestedDimension.toLowerCase()
  ));
  if (product.variants.length > 0 && !variant) return undefined;
  return variant?.price ?? product.price;
};

const validateOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    const error = new Error('Le panier doit contenir entre 1 et 50 produits.');
    error.statusCode = 400;
    throw error;
  }

  return items.map((item) => {
    const quantity = Number(item?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      const error = new Error('Quantité de produit invalide.');
      error.statusCode = 400;
      throw error;
    }
    return {
      productId: normalize(item?.productId),
      name: normalize(item?.name),
      dimension: normalize(item?.dimension || item?.size),
      quantity,
    };
  });
};

const resolveOrderProducts = async (items) => {
  const normalizedItems = validateOrderItems(items);

  const ids = normalizedItems
    .map((item) => item.productId)
    .filter((id) => mongoose.isValidObjectId(id));
  const productKeys = normalizedItems.map((item) => item.productId).filter(Boolean);
  const names = normalizedItems.map((item) => item.name).filter(Boolean);
  if (!ids.length && !names.length) {
    const error = new Error('Chaque article doit identifier un produit.');
    error.statusCode = 400;
    throw error;
  }
  const products = await Product.find({
    isActive: true,
    $or: [
      ...(ids.length ? [{ _id: { $in: ids } }] : []),
      ...(productKeys.length ? [{ productId: { $in: productKeys } }] : []),
      ...(names.length ? [{ name: { $in: names } }] : []),
    ],
  }).select('name price variants stock isActive').lean();

  const resolved = normalizedItems.map((item) => {
    const product = products.find((candidate) => (
      (item.productId && String(candidate._id) === item.productId)
      || (item.productId && candidate.productId === item.productId)
      || (!item.productId && candidate.name.toLowerCase() === item.name.toLowerCase())
    ));
    if (!product) {
      const error = new Error(`Produit indisponible: ${item.name || item.productId || 'inconnu'}`);
      error.statusCode = 400;
      throw error;
    }

    const unitPrice = Number(resolveVariantPrice(product, item));
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      const error = new Error(`Prix invalide pour le produit ${product.name}.`);
      error.statusCode = 400;
      throw error;
    }
    if (Number.isFinite(product.stock) && product.stock < item.quantity) {
      const error = new Error(`Stock insuffisant pour ${product.name}.`);
      error.statusCode = 409;
      throw error;
    }

    return {
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      dimension: item.dimension,
      price: unitPrice,
    };
  });

  const subtotal = resolved.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { products: resolved, subtotal };
};

const reserveOrderStock = async (products) => {
  const reserved = [];
  try {
    for (const item of products) {
      const result = await Product.updateOne(
        { _id: item.product, isActive: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
      );
      if (result.modifiedCount !== 1) {
        const error = new Error(`Stock insuffisant pour ${item.name}.`);
        error.statusCode = 409;
        throw error;
      }
      reserved.push(item);
    }
    return reserved;
  } catch (error) {
    await releaseOrderStock(reserved);
    throw error;
  }
};

const releaseOrderStock = async (products) => {
  await Promise.all(products.map((item) => Product.updateOne(
    { _id: item.product },
    { $inc: { stock: item.quantity } },
  )));
};

module.exports = {
  getDeliveryCost,
  isSupportedDeliveryRegion,
  resolveOrderProducts,
  validateOrderItems,
  reserveOrderStock,
  releaseOrderStock,
};
