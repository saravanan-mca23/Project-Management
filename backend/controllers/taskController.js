// backend/controllers/taskController.js
const Task = require("../models/Task");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, employeeId } = req.body;

    if (!title || !projectId || !employeeId) {
      return res.status(400).json({ message: "Title, Project, and Employee are required" });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,      // Reference to project
      assignedTo: employeeId,  // Employee assigned
      tl: req.user.id,          // Logged-in TL assigns
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks (for Admin/Head)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("tl", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks for logged-in TL
exports.getTasksForTL = async (req, res) => {
  try {
    const tasks = await Task.find({ tl: req.user.id })
      .populate("project", "name")
      .populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks for logged-in Employee
exports.getTasksForEmployee = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("project", "name")
      .populate("tl", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status || task.status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
