import { Request } from "express";
import { users } from "../db/schema/index";

export interface CustomRequest extends Request {
  user?: typeof users.$inferSelect;
  userId?: number;
  role?: string;
}
