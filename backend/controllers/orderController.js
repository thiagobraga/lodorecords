const Order = require('../models/Order');
const Product = require('../models/Product');
const Variant = require('../models/Variant');

// GET /api/orders - Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/orders/:id - Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price');
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/orders - Create new order
// Accepts orderItems with either:
// - variantSku + qty
// or (legacy):
// - product (ObjectId) + qty
//
// Snapshotting:
// Always snapshots name/image/unit price into orderItems, so historic orders do not change
// if products/variants change later.
exports.createOrder = async (req, res) => {
  try {
    const {
      user,
      orderItems = [],
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems.length) {
      return res.status(400).json({ success: false, error: 'Order items are required' });
    }

    const snapshottedItems = [];

    for (const item of orderItems) {
      const qty = Number(item.qty || item.quantity || 1);
      if (!qty || qty < 1) {
        return res.status(400).json({ success: false, error: 'Invalid qty in orderItems' });
      }

      // Preferred: variantSku
      if (item.variantSku) {
        const sku = String(item.variantSku).toUpperCase().trim();
        const variant = await Variant.findOne({ sku, active: { $ne: false } }).populate('product');
        if (!variant || !variant.product) {
          return res.status(400).json({ success: false, error: `Variant not found for SKU ${sku}` });
        }

        const product = variant.product;

        snapshottedItems.push({
          product: product._id,
          variantSku: variant.sku,
          variantFormat: variant.format,
          variantColor: variant.color,
          variantCondition: variant.condition,
          name: product.name,
          image: (variant.images && variant.images[0]) || (product.images && product.images[0]),
          price: Number(variant.price),
          qty
        });

        continue;
      }

      // Legacy: product id
      if (item.product) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ success: false, error: 'Product not found for order item' });
        }

        snapshottedItems.push({
          product: product._id,
          name: product.name,
          image: (product.images && product.images[0]) || undefined,
          price: Number(product.price),
          qty
        });

        continue;
      }

      return res.status(400).json({ success: false, error: 'Each order item must include variantSku or product' });
    }

    const order = new Order({
      user,
      orderItems: snapshottedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/orders/:id - Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await Order.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/orders/:id - Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
