import { Router } from "express";
import { body } from "express-validator";
import { createProject, getProjects, updateProject } from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getProjects);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  [
    body("name").notEmpty().withMessage("Project name required"),
    body("status").optional().isString(),
    body("dueDate").optional().isString()
  ],
  createProject
);

router.patch("/:id", authMiddleware, roleMiddleware(["admin"]), updateProject);

export default router;
