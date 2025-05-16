import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Access denied — Authorization token missing." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: number;
      role: string;
    };
    const customReq = req as CustomRequest;
    customReq.userId = decoded.userId;
    customReq.role = decoded.role;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    next(error);
  }
};
