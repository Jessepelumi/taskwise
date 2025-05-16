import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/userController";
import { findUserById } from "../middlewares/findUserById";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authenticateTokenOptional } from "../middlewares/authOptional";

const router = Router();

// conditional route
router.post("/", authenticateTokenOptional, createUser);

router.use(authenticateToken);

// protected routes
router.get("/", getUsers);
router.get("/:id", findUserById, getUserById);
router.patch("/:id", findUserById, updateUser);
router.delete("/:id", findUserById, deleteUser);

export default router;
