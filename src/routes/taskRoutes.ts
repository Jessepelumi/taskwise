import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTasks,
  updateTask,
} from "../controllers/taskController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createTask);

router.get("/", getTasks);
router.get("/all", getAllTasks);

router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
