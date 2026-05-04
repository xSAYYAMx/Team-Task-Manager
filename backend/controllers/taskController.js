import { validationResult } from "express-validator";
import Task from "../models/Task.js";

export async function getTasks(req, res) {
  const query = req.query.projectId ? { project: req.query.projectId } : {};
  if (req.user.role !== "admin") {
    query.assignee = req.user._id;
  }
  const tasks = await Task.find(query)
    .populate("project", "name")
    .populate("assignee", "name email");
  res.json(tasks);
}

export async function createTask(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const task = await Task.create({
    ...req.body,
    assignee: req.body.assignee || req.user._id
  });
  const populatedTask = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignee", "name email");
  res.status(201).json(populatedTask);
}

export async function updateTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  if (req.user.role !== "admin" && task.assignee?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
    .populate("project", "name")
    .populate("assignee", "name email");

  res.json(updatedTask);
}
