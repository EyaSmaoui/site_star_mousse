const CART_KEY = 'starMousseCart';
export const CART_UPDATED_EVENT = 'star-mousse:cart-updated';

const normalizeItem = (item) => {
  const quantity = Math.max(1, Number(item.quantity || 1));
  const price = Number(item.price || 0);
  const key = item.key || `${item.name || 'Produit'}-${item.size || ''}-${price}`;

  return {
    key,
    name: item.name || 'Produit Star Mousse',
    size: item.size || '',
    image: item.image || '',
    price,
    quantity,
    addedAt: item.addedAt || Date.now(),
  };
};

const notify = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
};

export const getCartItems = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.map(normalizeItem) : [];
  } catch {
    return [];
  }
};

export const saveCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items.map(normalizeItem)));
  notify();
};

export const addCartItem = (item) => {
  const nextItem = normalizeItem(item);
  const items = getCartItems();
  const existingIndex = items.findIndex((current) => current.key === nextItem.key);

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: items[existingIndex].quantity + nextItem.quantity,
    };
  } else {
    items.push(nextItem);
  }

  saveCartItems(items);
  return items;
};

export const updateCartItemQuantity = (key, quantity) => {
  const qty = Math.max(1, Number(quantity || 1));
  const items = getCartItems().map((item) => (
    item.key === key ? { ...item, quantity: qty } : item
  ));
  saveCartItems(items);
  return items;
};

export const removeCartItem = (key) => {
  const items = getCartItems().filter((item) => item.key !== key);
  saveCartItems(items);
  return items;
};

export const clearCart = () => saveCartItems([]);

export const getCartCount = () =>
  getCartItems().reduce((sum, item) => sum + Number(item.quantity || 0), 0);

export const getCartTotal = () =>
  getCartItems().reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
