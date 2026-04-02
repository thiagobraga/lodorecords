const mongoose = require('mongoose');

function slugify(value = '') {
  return value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },

    // NOTE: kept for backwards compatibility. With variants, this should represent
    // the "starting" price (e.g., cheapest active variant).
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price must be a positive number']
    },

    category: {
      type: String,
      required: [true, 'Please add a product category'],
      enum: ['vinyl', 'cd', 'cassette', 'clothing', 'accessory', 'other']
    },

    images: [
      {
        type: String,
        required: [true, 'Please add at least one product image']
      }
    ],

    // NOTE: kept for backwards compatibility. With variants, this should represent
    // the total stock across active variants.
    countInStock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock quantity must be a positive number'],
      default: 0
    },

    featured: {
      type: Boolean,
      default: false,
      index: true
    },

    // TODO: migrate to band ref. For now keep string and index it.
    artist: {
      type: String,
      required: [true, 'Please add an artist name'],
      index: true
    },

    releaseDate: {
      type: Date,
      default: Date.now
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for filtering & search
ProductSchema.index({ category: 1 });
ProductSchema.index({ artist: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 'text', description: 'text', artist: 'text' });

// Virtual populate: product.variants
ProductSchema.virtual('variants', {
  ref: 'Variant',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

ProductSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
