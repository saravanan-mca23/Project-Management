const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, // Project reference
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Employee
  tl: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // ✅ Team Lead
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"], 
    default: "pending" 
  },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
