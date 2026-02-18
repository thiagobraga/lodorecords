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

const BandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a band name'],
      trim: true,
      maxlength: [100, 'Band name cannot be more than 100 characters']
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Please add a band description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    genre: {
      type: String,
      required: [true, 'Please add a genre']
    },
    image: {
      type: String,
      required: [true, 'Please add a band image']
    },
    logo: {
      type: String
    },
    members: [
      {
        name: {
          type: String,
          required: true
        },
        role: {
          type: String,
          required: true
        },
        joinedYear: {
          type: Number
        }
      }
    ],
    formedYear: {
      type: Number
    },
    website: {
      type: String
    },
    socialMedia: {
      spotify: String,
      instagram: String,
      facebook: String,
      youtube: String
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    active: {
      type: Boolean,
      default: true
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

BandSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Band', BandSchema);
