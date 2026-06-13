// src/config/db.js
// Uses a connection pool — much better than a single connection.
// A pool reuses connections instead of opening a new one per query.

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT || 3306, 
  waitForConnections: true,
  connectionLimit: 10,   // max simultaneous DB connections
  queueLimit: 0,         // 0 = unlimited queue
});

// Test the connection on startup
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release(); // always release back to pool
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1); // stop server if DB is unreachable
  }
}

module.exports = { pool, testConnection };
