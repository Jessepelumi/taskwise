import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/express";
import bcrypt from "bcryptjs";
import { createUserSchema, updateUserSchema } from "../schema/user.schema";
import { users } from "../db/schema/index";
import db from "../db/index";
import { eq } from "drizzle-orm";

// create new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate request body (incoming data)
    const validatedData = createUserSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // check is user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      res.status(400).json({
        message: `User with ${email} already exists. Please use a different email.`,
      });
      return;
    }

    // hash user password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const newUser = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning();

    res
      .status(201)
      .json({ message: "User sucessfully created", user: newUser[0] });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ errors: error.errors });
      return;
    }

    next(error);
  }
};

// read all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // read users from db
    const allUsers = await db.select().from(users);

    if (allUsers.length === 0) {
      res.status(404).json({ message: "No user found in the system" });
      return;
    }

    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

// read a single user
// export const getUserById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // parse id
//     const parsedId = parseInt(req.params.id, 10);

//     // check for user with id
//     const selectedUser = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, parsedId));

//     if (selectedUser.length === 0) {
//       res
//         .status(400)
//         .json({ message: `User with ID '${parsedId}' was not found` });
//       return;
//     }

//     res.status(200).json(selectedUser);
//   } catch (error) {
//     next(error);
//   }
// };

export const getUserById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json(req.user);
};

// update user
// export const updateUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // parse id
//     const parsedId = parseInt(req.params.id, 10);

//     // check for user
//     const existingUser = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, parsedId));

//     if (existingUser.length === 0) {
//       res
//         .status(400)
//         .json({ message: `User with ID '${parsedId}' was not found` });
//       return;
//     }

//     // validate incoming fields
//     const validatedData = updateUserSchema.parse(req.body);

//     // nothing to update
//     if (Object.keys(validatedData).length === 0) {
//       res.status(400).json({ message: "No valid fields to update" });
//       return;
//     }

//     const updateData: Partial<typeof users.$inferInsert> = { ...validatedData };

//     // hash password
//     if (validatedData.password) {
//       updateData.password = await bcrypt.hash(validatedData.password, 10);
//     }

//     const updatedUser = await db
//       .update(users)
//       .set(updateData)
//       .where(eq(users.id, parsedId))
//       .returning();

//     res.status(200).json({
//       message: `User with ID '${parsedId}' has been updated`,
//       user: updatedUser[0],
//     });
//   } catch (error: any) {
//     if (error.name === "ZodError") {
//       res.status(400).json({ errors: error.errors });
//       return;
//     }

//     next(error);
//   }
// };

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if ID was passed
    if (!req.userId) {
      res.status(400).json({ message: "User ID is missing from request" });
      return;
    }

    // validate incoming fields
    const validatedData = updateUserSchema.parse(req.body);

    // nothing to update
    if (Object.keys(validatedData).length === 0) {
      res.status(400).json({ message: "No valid fields to update" });
      return;
    }

    const updateData: Partial<typeof users.$inferInsert> = { ...validatedData };

    // hash password
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, req.userId!))
      .returning();

    res.status(200).json({
      message: `User with ID '${req.userId}' has been updated`,
      user: updatedUser[0],
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ errors: error.errors });
      return;
    }

    next(error);
  }
};

// delete user using id
// email & passowrd are required
export const deleteUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const userId = req.userId;

    if (!user || !userId) {
      res.status(400).json({ message: "User not found in request" });
      return;
    }

    // take email to confirm delete request
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).json({
        message: "Email and password are required to delete this user",
      });
      return;
    }

    // verify email
    if (user.email !== email) {
      res.status(401).json({ message: "Invalid email address" });
      return;
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    // delete user
    await db.delete(users).where(eq(users.id, userId));

    res.status(200).json({
      message: `User with ID '${userId}' has been deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
