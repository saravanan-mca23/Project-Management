const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  deadline: { type: Date },
  assignedToTL: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Team Lead
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model("Project", projectSchema);
