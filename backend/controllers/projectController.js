import { validationResult } from "express-validator";
import Project from "../models/Project.js";

export async function getProjects(_req, res) {
  const projects = await Project.find().populate("members", "name email role");
  res.json(projects);
}

export async function createProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const members = Array.isArray(req.body.members) && req.body.members.length > 0
    ? req.body.members
    : [req.user._id];
  const project = await Project.create({
    ...req.body,
    members
  });
  res.status(201).json(project);
}

export async function updateProject(req, res) {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(project);
}
