import { Router } from "express";
import { body } from "express-validator";
import { createTask, getTasks, updateTask } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getTasks);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  [
    body("title").notEmpty().withMessage("Task title required"),
    body("project").notEmpty().withMessage("Project is required"),
    body("assignee").notEmpty().withMessage("Assignee is required"),
    body("status").optional().isString(),
    body("priority").optional().isString()
  ],
  createTask
);

router.patch("/:id", authMiddleware, updateTask);

export default router;
