// src/controllers/authController.js
// Controllers contain the business logic for each route.
// They use Models for data access and send the HTTP response.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to sign a JWT for a user
function signToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Create user (password gets hashed inside User.create)
    const userId = await User.create({ name, email, password });
    const user   = await User.findById(userId);
    const token  = signToken(userId);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      // Vague message on purpose — don't reveal which field is wrong
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user.id);

    // Don't send the hashed password back to the client
    const { password: _, ...safeUser } = user;

    res.json({
      message: 'Logged in successfully',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
}

// GET /api/auth/me  (protected)
async function getMe(req, res) {
  // req.user is set by the protect middleware
  res.json({ user: req.user });
}

module.exports = { register, login, getMe };
