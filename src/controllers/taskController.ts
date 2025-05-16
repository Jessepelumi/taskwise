import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/express";
import { tasks, users } from "../db/schema/index";
import db from "../db/index";
import { createTaskSchema } from "../schema/task.schema";
import { eq } from "drizzle-orm";

// create new task
export const createTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const { title, description, dueDate, status, assignedTo } = validatedData;

    const created_by = req.userId!;
    const assigned_to = assignedTo ?? req.userId!;

    // check if assigned user exist
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, assigned_to))
      .then((res) => res.length > 0);

    if (!userExists) {
      res.status(400).json({
        message: `Assigned user with ID '${assigned_to}' does not exist.`,
      });
      return;
    }

    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description,
        dueDate: new Date(dueDate),
        status,
        createdBy: created_by,
        assignedTo: assigned_to,
      })
      .returning();

    res.status(200).json({ message: "New task created", task: newTask[0] });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ errors: error.errors });
      return;
    }

    next(error);
  }
};

// fetch all tasks - admin only
export const getTasks = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role != "admin") {
      res.status(403).json({ message: "Unauthorized — Access denied." });
      return;
    }

    const allTasks = await db.select().from(tasks);

    res.status(200).json({ tasks: allTasks });
  } catch (error) {
    next(error);
  }
};

// fetch created tasks
export const getCreatedTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;

    const taskCreated = await db
      .select()
      .from(tasks)
      .where(eq(tasks.createdBy, userId));

    res.status(200).json({ tasks: taskCreated });
  } catch (error) {
    next(error);
  }
};

// fetch assigned tasks
export const getAssignedTasks = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;

    const taskAssigned = await db
      .select()
      .from(tasks)
      .where(eq(tasks.assignedTo, userId));

    res.status(200).json({ tasks: taskAssigned });
  } catch (error) {
    next(error);
  }
};
