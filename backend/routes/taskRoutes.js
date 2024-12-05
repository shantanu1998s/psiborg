const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();

router.post('/', authenticate, authorize(['Admin', 'Manager']), createTask);
router.get('/', authenticate, getTasks);
router.put('/:taskId', authenticate, authorize(['Admin', 'Manager']), updateTask);
router.delete('/:taskId', authenticate, authorize(['Admin']), deleteTask);

module.exports = router;
