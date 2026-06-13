// src/routes/authRoutes.js
// Routes connect HTTP method + URL path → middleware chain → controller.
// Keeping routes thin (no logic here) makes them easy to read at a glance.

const express = require('express');
const router  = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect }                 = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validate');

// Public routes
router.post('/register', registerRules, register);
router.post('/login',    loginRules,    login);

// Protected route — protect middleware runs first
router.get('/me', protect, getMe);

module.exports = router;
