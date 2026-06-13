// src/middleware/validate.js
// Reusable validation rules using express-validator.
// Each exported array is a middleware chain: validate rules + check results.

const { body, validationResult } = require('express-validator');

// Checks results of validation rules above it in the chain
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return all validation errors as an array
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

// Rules for user registration
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name is too long'),
  body('email')
    .trim()
    .isEmail().withMessage('Provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

// Rules for login
const loginRules = [
  body('email').trim().isEmail().withMessage('Provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// Rules for creating/updating a todo
const todoRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title is too long'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('due_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD)'),
  handleValidation,
];

module.exports = { registerRules, loginRules, todoRules };
