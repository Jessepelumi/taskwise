import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/userController";
import { findUserById } from "../middlewares/findUserById";

const router = Router();

router.post("/", createUser);

router.get("/", getUsers);
router.get("/:id", findUserById, getUserById);

router.patch("/:id", findUserById, updateUser);

router.delete("/:id", findUserById, deleteUser);

export default router;
