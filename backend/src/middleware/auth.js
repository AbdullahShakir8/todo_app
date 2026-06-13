// src/middleware/auth.js
// This middleware runs BEFORE protected route handlers.
// It reads the JWT from the Authorization header, verifies it,
// and attaches the user to req.user so controllers can use it.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    // 1. Get token from header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check the user still exists in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    // 4. Attach user to request — controllers use req.user
    req.user = user;
    next();

  } catch (err) {
    // jwt.verify throws if token is expired or tampered
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

module.exports = { protect };
