// src/routes/todoRoutes.js
// All todo routes are protected — protect middleware is applied to the whole router.

const express = require('express');
const router  = express.Router();

const {
  getAllTodos, getStats, getTodo,
  createTodo, updateTodo, toggleTodo, deleteTodo,
} = require('../controllers/todoController');

const { protect }    = require('../middleware/auth');
const { todoRules }  = require('../middleware/validate');

// Apply protect to every route in this file
router.use(protect);

router.get('/',         getAllTodos);
router.get('/stats',    getStats);
router.get('/:id',      getTodo);
router.post('/',        todoRules, createTodo);
router.put('/:id',      todoRules, updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id',   deleteTodo);

module.exports = router;
