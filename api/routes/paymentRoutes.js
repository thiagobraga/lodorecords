const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPaymentById,
  processPayment,
  webhook,
  getPaymentStatus
} = require('../controllers/paymentController');

// GET /api/payments - Get all payments
router.get('/', getPayments);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', getPaymentById);

// POST /api/payments - Process new payment
router.post('/', processPayment);

// POST /api/payments/webhook - Payment webhook
router.post('/webhook', webhook);

// GET /api/payments/status/:id - Get payment status
router.get('/status/:id', getPaymentStatus);

module.exports = router;