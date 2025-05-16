import { Router } from "express";
import { loginUser } from "../controllers/authController";

const router = Router();

router.post("/", loginUser);

export default router;
