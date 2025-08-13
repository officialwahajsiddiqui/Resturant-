import User from '../models/User.js';

/**
 * Middleware to check if the authenticated user is an admin
 * This middleware should be used after the auth middleware
 */
const admin = async (req, res, next) => {
  try {
    // Get user from database (auth middleware already set req.user.id)
    const user = await User.findById(req.user.id);
    
    // Check if user exists and is an admin
    if (!user || user.type !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    
    // User is admin, proceed to next middleware
    next();
  } catch (err) {
    console.error('Admin check error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export default admin;