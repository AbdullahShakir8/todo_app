// src/models/Todo.js
// Every SQL query related to todos lives here.
// Note: every query filters by user_id — users can only see their own todos.

const { pool } = require('../config/db');

const Todo = {
  // Get all todos for a user, with optional filtering
  async findAllByUser(userId, { status, priority, search } = {}) {
    let sql = 'SELECT * FROM todos WHERE user_id = ?';
    const params = [userId];

    // Dynamically build the WHERE clause based on filters
    if (status === 'completed')   { sql += ' AND completed = TRUE'; }
    if (status === 'active')      { sql += ' AND completed = FALSE'; }
    if (priority)                 { sql += ' AND priority = ?'; params.push(priority); }
    if (search)                   { sql += ' AND title LIKE ?'; params.push(`%${search}%`); }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  // Get a single todo (also checks user_id so users can't access others' todos)
  async findByIdAndUser(id, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  },

  // Create a new todo
  async create({ userId, title, description, priority, due_date }) {
    const [result] = await pool.execute(
      `INSERT INTO todos (user_id, title, description, priority, due_date)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, description || null, priority || 'medium', due_date || null]
    );
    // Return the newly created todo
    return this.findByIdAndUser(result.insertId, userId);
  },

  // Update a todo — only fields that are provided get updated
  async update(id, userId, fields) {
    const allowed = ['title', 'description', 'priority', 'completed', 'due_date'];
    const updates = [];
    const params = [];

    // Build dynamic SET clause from provided fields only
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }

    if (updates.length === 0) return this.findByIdAndUser(id, userId);

    params.push(id, userId);
    await pool.execute(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );
    return this.findByIdAndUser(id, userId);
  },

  // Delete a todo
  async delete(id, userId) {
    const [result] = await pool.execute(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Get counts for the dashboard stats
  async getStats(userId) {
    const [rows] = await pool.execute(
      `SELECT
         COUNT(*) AS total,
         SUM(completed = TRUE)  AS completed,
         SUM(completed = FALSE) AS active,
         SUM(priority = 'high' AND completed = FALSE) AS high_priority
       FROM todos WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  },
};

module.exports = Todo;
