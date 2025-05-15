import { users } from "../../db/schema/index";

declare global {
  namespace Express {
    interface Request {
      user?: typeof users.$inferSelect;
      userId?: number;
    }
  }
}
