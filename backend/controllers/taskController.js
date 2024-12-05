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



const searchTasks = async (req, res) => {
    try {
      const { status, priority, dueDate, keyword } = req.query;
  
      // Create a dynamic filter object based on the query parameters
      const filter = {};
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
      if (keyword) filter.$text = { $search: keyword };
  
      // Fetch tasks with sorting by due date
      const tasks = await Task.find(filter).sort({ dueDate: 1 });
  
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching tasks', error: error.message });
    }
  };
  

module.exports = { createTask, getTasks, updateTask, deleteTask, searchTasks };


