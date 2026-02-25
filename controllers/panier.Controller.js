const Cart = require('../models/panier.model');
const Product = require('../models/product.model');

// Get all carts
module.exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('user').populate('products.product');
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get cart by ID
module.exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('user').populate('products.product');
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new cart
module.exports.addCart = async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update cart
module.exports.updateCart = async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete cart
module.exports.deleteCart = async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➕ Add product to cart
module.exports.addProductToCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    cart.products.push({ product: productId, quantity });
    cart.totalAmount += product.price * quantity;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Remove product from cart
module.exports.removeProductFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const { productId } = req.body;
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (productIndex === -1) return res.status(404).json({ error: "Product not in cart" });

    const removedProduct = cart.products[productIndex];
    cart.totalAmount -= removedProduct.quantity * (await Product.findById(productId)).price;
    cart.products.splice(productIndex, 1);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};