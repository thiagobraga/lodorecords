const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  // Kept for linkage (admin UI, auditing). Snapshot fields below are the source of truth.
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  // Variant snapshot
  variantSku: { type: String, trim: true, uppercase: true },
  variantFormat: { type: String },
  variantColor: { type: String },
  variantCondition: { type: String },

  // Product snapshot
  name: { type: String, required: true },
  image: { type: String },

  // Price snapshot (unit price at time of purchase)
  price: { type: Number, required: true, min: 0 },

  qty: { type: Number, required: true, min: 1 }
});

const ShippingAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
});

const PaymentResultSchema = new mongoose.Schema({
  id: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String }
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    paymentMethod: { type: String, required: true },
    paymentResult: PaymentResultSchema,
    itemsPrice: { type: Number, required: true, min: 0, default: 0 },
    taxPrice: { type: Number, required: true, min: 0, default: 0 },
    shippingPrice: { type: Number, required: true, min: 0, default: 0 },
    totalPrice: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', OrderSchema);
