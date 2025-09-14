// backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const { createTask, getTasks, getTasksForTL, getTasksForEmployee , updateTask, deleteTask} = require("../controllers/taskController");
const { verifyToken } = require("../middleware/authMiddleware");

// All task routes require authentication
router.get("/", verifyToken, getTasks);
router.post("/", verifyToken, createTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id",verifyToken, deleteTask);
router.get("/tl", verifyToken, getTasksForTL);          // TL sees their tasks
router.get("/employee", verifyToken, getTasksForEmployee); // Employee sees only their tasks
module.exports = router;
