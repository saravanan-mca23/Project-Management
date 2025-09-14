const express = require("express");
const router = express.Router();
const { createProject, getProjects,getProjectsForTL, updateProject, deleteProject } = require("../controllers/projectController");
const { verifyToken } = require("../middleware/authMiddleware");

// All project routes require authentication
router.get("/", verifyToken, getProjects);
router.post("/", verifyToken, createProject);
router.get("/tl", verifyToken, getProjectsForTL); 
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);

module.exports = router;
