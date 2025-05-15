import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/express";
import db from "../db/index";
import { users } from "../db/schema/index";
import { eq } from "drizzle-orm";

export const findUserById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // parse ID
    const parsedId = parseInt(req.params.id, 10);

    // validate ID
    if (isNaN(parsedId)) {
      res.status(400).json({ message: `'${req.params.id}' is not a valid ID.` });
      return;
    }

    // read user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parsedId));

    if (existingUser.length === 0) {
      res
        .status(400)
        .json({ message: `User with ID '${parsedId}' was not found.` });
      return;
    }

    // attach user and ID to the request object
    req.user = existingUser[0];
    req.userId = parsedId;

    next();
  } catch (error) {
    next(error);
  }
};
