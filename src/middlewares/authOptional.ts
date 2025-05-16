import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const authenticateTokenOptional = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: number;
        role: string;
      };

      const customReq = req as CustomRequest;
      customReq.userId = decoded.userId;
      customReq.role = decoded.role;
    } catch (error) {
      next(error);
    }
  }

  next(); 
};
