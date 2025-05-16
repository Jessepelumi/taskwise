import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config/config";
import db from "../db/index";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/index";
import { loginUserSchema } from "../schema/login.schema";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate request body
    const validatedData = loginUserSchema.parse(req.body);
    const { email, password } = validatedData;

    const requestedUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (requestedUser.length === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const user = requestedUser[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
