const Project = require("../models/Project");
const Task = require("../models/Task");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description, deadline, tlId } = req.body;

    const project = await Project.create({
      name,
      description,
      deadline,
      assignedToTL: tlId,   // ✅ use assignedToTL (consistent with populate & update)
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Projects (Manager view)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("assignedToTL", "name email role");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Projects for TL
exports.getProjectsForTL = async (req, res) => {
  try {
    const projects = await Project.find({ assignedToTL: req.user.id }); // ✅ match with field
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.deadline = req.body.deadline || project.deadline;
    project.assignedToTL = req.body.assignedToTL || project.assignedToTL;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Project (and related tasks)
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete all tasks belonging to this project
    await Task.deleteMany({ project: project._id });

    // Delete the project itself
    await Project.findByIdAndDelete(id);

    res.json({ message: "Project and its tasks deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ message: "Server error while deleting project" });
  }
};
