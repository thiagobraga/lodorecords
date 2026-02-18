const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getBands,
  getBandById,
  createBand,
  updateBand,
  deleteBand
} = require('../controllers/bandController');
const router = express.Router();

// GET /api/bands - Get all bands
router.get('/', getBands);

// GET /api/bands/:id - Get band by ID
router.get('/:id', getBandById);

// POST /api/bands - Create new band
router.post('/', protect, adminOnly, createBand);

// PUT /api/bands/:id - Update band
router.put('/:id', protect, adminOnly, updateBand);

// DELETE /api/bands/:id - Delete band
router.delete('/:id', protect, adminOnly, deleteBand);

module.exports = router;