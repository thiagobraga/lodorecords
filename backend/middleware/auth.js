const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - support Passport session or JWT token
const protect = async (req, res, next) => {
  try {
    // Dev bypass (for local development only)
    if (process.env.NODE_ENV !== 'production' && String(process.env.DEV_BYPASS_AUTH).toLowerCase() === 'true') {
      req.user = { id: 'dev', name: 'Dev Admin', email: 'admin@dev.local', role: 'admin', isActive: true };
      return next();
    }

    // If Passport session is active, trust req.user
    if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }

      if (req.user.isActive === false) {
        return res.status(401).json({ success: false, error: 'User account is deactivated' });
      }

      return next();
    }

    // Fallback to JWT in cookie or Authorization header
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (user.isActive === false) {
      return res.status(401).json({ success: false, error: 'User account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

// Admin only access
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
};

// Super admin only access
const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Super admin access required'
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

module.exports = {
  protect,
  adminOnly,
  superAdminOnly,
  generateToken
};
