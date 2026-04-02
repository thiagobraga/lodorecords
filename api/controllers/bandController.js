const Band = require('../models/Band');

// GET /api/bands - Get all bands with filtering
const getBands = async (req, res) => {
  try {
    const { featured, active, search, sort } = req.query;
    const query = {};

    if (featured === 'true') query.featured = true;
    if (active !== undefined) query.active = active === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      const field = sort.replace('-', '');
      const direction = sort.startsWith('-') ? -1 : 1;
      sortOption = { [field]: direction };
    }

    const bands = await Band.find(query).sort(sortOption);
    res.json({ success: true, bands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/bands/:id - Get band by ID
const getBandById = async (req, res) => {
  try {
    const { id } = req.params;
    const band = await Band.findById(id);

    if (!band) {
      return res.status(404).json({ success: false, error: 'Band not found' });
    }

    res.json({ success: true, band });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/bands - Create new band
const createBand = async (req, res) => {
  try {
    const band = new Band(req.body);
    await band.save();
    res.status(201).json({ success: true, band });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/bands/:id - Update band
const updateBand = async (req, res) => {
  try {
    const { id } = req.params;
    // Gracefully handle no-op updates (empty body)
    const updates = req.body || {};
    if (Object.keys(updates).length === 0) {
      const existing = await Band.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Band not found' });
      }
      return res.json({ success: true, band: existing, message: 'No changes applied' });
    }

    const band = await Band.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!band) {
      return res.status(404).json({ success: false, error: 'Band not found' });
    }

    res.json({ success: true, band });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/bands/:id - Delete band
const deleteBand = async (req, res) => {
  try {
    const { id } = req.params;
    const band = await Band.findByIdAndDelete(id);

    if (!band) {
      return res.status(404).json({ success: false, error: 'Band not found' });
    }

    res.json({ success: true, message: 'Band deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getBands,
  getBandById,
  createBand,
  updateBand,
  deleteBand
};
