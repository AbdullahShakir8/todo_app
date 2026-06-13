// src/controllers/todoController.js
// All todo business logic. Every handler is a named async function —
// makes stack traces readable and controllers easy to test.

const Todo = require('../models/Todo');

// GET /api/todos
async function getAllTodos(req, res) {
  try {
    const { status, priority, search } = req.query;
    const todos = await Todo.findAllByUser(req.user.id, { status, priority, search });
    res.json({ todos });
  } catch (err) {
    console.error('Get todos error:', err);
    res.status(500).json({ message: 'Failed to fetch todos.' });
  }
}

// GET /api/todos/stats
async function getStats(req, res) {
  try {
    const stats = await Todo.getStats(req.user.id);
    res.json({ stats });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
}

// GET /api/todos/:id
async function getTodo(req, res) {
  try {
    const todo = await Todo.findByIdAndUser(req.params.id, req.user.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found.' });
    res.json({ todo });
  } catch (err) {
    console.error('Get todo error:', err);
    res.status(500).json({ message: 'Failed to fetch todo.' });
  }
}

// POST /api/todos
async function createTodo(req, res) {
  try {
    const todo = await Todo.create({
      userId:      req.user.id,
      title:       req.body.title,
      description: req.body.description,
      priority:    req.body.priority,
      due_date:    req.body.due_date,
    });
    res.status(201).json({ message: 'Todo created', todo });
  } catch (err) {
    console.error('Create todo error:', err);
    res.status(500).json({ message: 'Failed to create todo.' });
  }
}

// PUT /api/todos/:id
async function updateTodo(req, res) {
  try {
    const exists = await Todo.findByIdAndUser(req.params.id, req.user.id);
    if (!exists) return res.status(404).json({ message: 'Todo not found.' });

    const updated = await Todo.update(req.params.id, req.user.id, req.body);
    res.json({ message: 'Todo updated', todo: updated });
  } catch (err) {
    console.error('Update todo error:', err);
    res.status(500).json({ message: 'Failed to update todo.' });
  }
}

// PATCH /api/todos/:id/toggle
async function toggleTodo(req, res) {
  try {
    const todo = await Todo.findByIdAndUser(req.params.id, req.user.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found.' });

    const updated = await Todo.update(req.params.id, req.user.id, {
      completed: !todo.completed,
    });
    res.json({ message: 'Todo toggled', todo: updated });
  } catch (err) {
    console.error('Toggle todo error:', err);
    res.status(500).json({ message: 'Failed to toggle todo.' });
  }
}

// DELETE /api/todos/:id
async function deleteTodo(req, res) {
  try {
    const deleted = await Todo.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ message: 'Todo not found.' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error('Delete todo error:', err);
    res.status(500).json({ message: 'Failed to delete todo.' });
  }
}

module.exports = { getAllTodos, getStats, getTodo, createTodo, updateTodo, toggleTodo, deleteTodo };
