import { users } from "../db/schema/index";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      role?: "admin" | "user";
    }
  }
}
