const Product = require('../models/Product');

// GET /api/products - Get all products with filtering and sorting
// Query params:
// - q: full-text search (name/description/artist)
// - category
// - band: alias for artist
// - featured=true
// - minPrice / maxPrice (aliases: priceMin/priceMax)
// - sort: field or -field
const getProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      q,
      search,
      band,
      artist,
      minPrice,
      maxPrice,
      priceMin,
      priceMax,
      sort
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const bandFilter = band || artist;
    if (bandFilter) {
      query.artist = { $regex: bandFilter, $options: 'i' };
    }

    const text = q || search;
    if (text) {
      // Prefer text index if available
      query.$text = { $search: text };
    }

    const min = minPrice ?? priceMin;
    const max = maxPrice ?? priceMax;
    if (min || max) {
      query.price = {};
      if (min) query.price.$gte = Number(min);
      if (max) query.price.$lte = Number(max);
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      const field = sort.replace('-', '');
      const direction = sort.startsWith('-') ? -1 : 1;
      sortOption = { [field]: direction };
    } else if (text) {
      // If using $text, sort by relevance by default
      sortOption = { score: { $meta: 'textScore' } };
    }

    let qy = Product.find(query)
      .sort(sortOption)
      .populate({ path: 'variants', options: { sort: { price: 1 } } });

    if (text) {
      qy = qy.select({ score: { $meta: 'textScore' } });
    }

    const products = await qy;
    res.json({ success: true, products });
  } catch (error) {
    // Fallback if text index isn't built yet
    if (String(error.message || '').includes('text index required')) {
      try {
        const { search, q } = req.query;
        const term = q || search;
        const products = await Product.find({
          $or: [
            { name: { $regex: term, $options: 'i' } },
            { description: { $regex: term, $options: 'i' } },
            { artist: { $regex: term, $options: 'i' } }
          ]
        }).populate('variants');
        return res.json({ success: true, products, warning: 'Used regex search fallback (text index missing)' });
      } catch (e2) {
        return res.status(500).json({ success: false, error: e2.message });
      }
    }

    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/products/:id - Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate({ path: 'variants', options: { sort: { price: 1 } } });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/products - Create new product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/products/:id - Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Gracefully handle no-op updates (empty body)
    const updates = req.body || {};
    if (Object.keys(updates).length === 0) {
      const existing = await Product.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      return res.json({ success: true, product: existing, message: 'No changes applied' });
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/products/:id - Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
