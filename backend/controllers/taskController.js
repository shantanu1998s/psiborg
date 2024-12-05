const Task = require('../models/task');
const User = require('../models/User');

async function createTask(req, res) {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = new Task({
        title,
        description,
        dueDate,
        priority,
        status: 'Pending',
        createdBy: req.user.userId,
        assignedTo
    });

    await task.save();
    req.io.emit('newTask', task);
    res.status(201).json({ task });
}

async function getTasks(req, res) {
    const tasks = await Task.find({ createdBy: req.user.userId });
    res.status(200).json({ tasks });
}

async function updateTask(req, res) {
    const { taskId } = req.params;
    const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ task });
}

async function deleteTask(req, res) {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
}

module.exports = { createTask, getTasks, updateTask, deleteTask };


