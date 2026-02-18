const Order = require('../models/Order');

// GET /api/payments - Get all payments (derived from orders with isPaid)
exports.getPayments = async (req, res) => {
  try {
    const paidOrders = await Order.find({ isPaid: true }).select('user totalPrice paidAt paymentResult');
    res.json({ success: true, payments: paidOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/payments/:id - Get payment by order ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).select('isPaid totalPrice paidAt paymentResult');
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, payment: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/payments - Process new payment (simulate)
exports.processPayment = async (req, res) => {
  try {
    const { orderId, amount, provider = 'mock' } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    if (amount !== undefined && amount !== order.totalPrice) {
      return res.status(400).json({ success: false, error: 'Amount mismatch' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'paid';
    order.paymentResult = {
      id: `${provider}_${order._id}`,
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.body.email || undefined
    };

    await order.save();
    res.status(201).json({ success: true, payment: order.paymentResult, orderId: order._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/payments/webhook - Payment webhook (mock)
exports.webhook = async (req, res) => {
  try {
    // In a real implementation, verify signature and update order accordingly
    res.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/payments/status/:id - Get payment status by order ID
exports.getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).select('isPaid status paymentResult');
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, status: order.isPaid ? 'paid' : 'pending', details: order.paymentResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};