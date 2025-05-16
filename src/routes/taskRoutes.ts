import { Router } from "express";
import {
  createTask,
  getAssignedTasks,
  getCreatedTask,
  getTasks,
} from "../controllers/taskController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createTask);

router.get("/", getTasks);

router.get("/created", getCreatedTask);
router.get("/assigned", getAssignedTasks);

export default router;
