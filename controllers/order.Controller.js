const Order = require('../models/order.model');
const Product = require('../models/product.model');



// Get all orders
module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new order
module.exports.addOrder = async (req, res) => {
  try {
    const { user, products } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }

    const newOrder = new Order({ user, products, totalAmount });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add admin order (example: special permission)
module.exports.addAdminOrder = async (req, res) => {
  try {
    const { user, products, permission } = req.body;

    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }

    const newAdminOrder = new Order({
      user,
      products,
      totalAmount,
      status: 'Admin',
      permission
    });

    await newAdminOrder.save();
    res.status(201).json(newAdminOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete order
module.exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order
module.exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

