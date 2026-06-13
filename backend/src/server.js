// src/server.js
// The entry point. Keeps app setup clean by importing everything.

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const { testConnection } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────

// Allow requests from the React dev server
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Parse incoming JSON bodies
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/auth',  authRoutes);
app.use('/api/todos', todoRoutes);

// Health check — useful to verify the server is running
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404 handler for unknown routes
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler — catches any error passed to next(err)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Start ───────────────────────────────────────────────────────────────────

async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API docs: http://localhost:${PORT}/api/health`);
  });
}

start();
