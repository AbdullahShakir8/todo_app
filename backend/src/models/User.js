// src/models/User.js
// The Model handles ALL database queries for a resource.
// Controllers call these methods — they never write SQL directly.

const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Find a user by email (used for login)
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null; // return first result or null
  },

  // Find a user by id (used to attach to JWT-protected routes)
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Create a new user — password is hashed before storing
  async create({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId; // return the new user's id
  },

  // Compare a plain-text password with the stored hash
  async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },
};

module.exports = User;
