// src/services/cartService.js
const cartService = {
  // Obtenir le panier du localStorage
  getCart() {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (error) {
      console.error('Erreur lecture panier:', error);
      return [];
    }
  },

  // Ajouter un produit au panier
  addToCart(product, quantity = 1, variant = null) {
    const cart = this.getCart();
    const existingItem = cart.find(
      item => item.productId === product._id && item.variant === variant
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        variant,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Ajouter un item simplifié (utilisé par ProductDetail)
  addItem(item) {
    const cart = this.getCart();
    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || null
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Supprimer un produit du panier
  removeFromCart(productId, variant = null) {
    let cart = this.getCart();
    cart = cart.filter(
      item => !(item.productId === productId && item.variant === variant)
    );
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Mettre à jour la quantité
  updateQuantity(productId, quantity, variant = null) {
    const cart = this.getCart();
    const item = cart.find(
      i => i.productId === productId && i.variant === variant
    );

    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId, variant);
      }
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    return cart;
  },

  // Vider le panier
  clearCart() {
    localStorage.removeItem('cart');
    return [];
  },

  // Obtenir le total du panier
  getTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Obtenir le nombre d'articles
  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
};

// Export both named and default
export { cartService };
export default cartService;
