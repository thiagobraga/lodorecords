const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true
    },
    format: {
      type: String,
      enum: ['vinyl', 'cd', 'cassette', 'digital', 'clothing', 'accessory', 'other'],
      default: 'other',
      index: true
    },
    color: {
      type: String,
      trim: true
    },
    condition: {
      type: String,
      enum: ['new', 'used', 'mint', 'nm', 'vg+', 'vg', 'g', 'poor'],
      default: 'new'
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      index: true
    },
    images: [{ type: String }],
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

VariantSchema.index({ product: 1, sku: 1 });

module.exports = mongoose.model('Variant', VariantSchema);
