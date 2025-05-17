import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/express";
import { tasks, users } from "../db/schema/index";
import db from "../db/index";
import { createTaskSchema, updateTaskSchema } from "../schema/task.schema";
import { eq, or } from "drizzle-orm";

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

// admin fetch
export const getAllTasks = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.role;

    // admin access only
    if (userRole !== "admin") {
      res.status(403).json({ message: "Unauthorized — Admin access only." });
      return;
    }

    const allTasks = await db.select().from(tasks);
    res.status(200).json({ tasks: allTasks });
  } catch (error) {
    next(error);
  }
};

// fetch created or assigned tasks
export const getTasks = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;

    // users get tasks they created or were assigned
    const userTask = await db
      .select()
      .from(tasks)
      .where(or(eq(tasks.createdBy, userId), eq(tasks.assignedTo, userId)));

    res.status(200).json({ tasks: userTask });
  } catch (error) {
    next(error);
  }
};

// update tasks
export const updateTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // parse task ID
    const parsedId = parseInt(req.params.id);

    // validate ID
    if (isNaN(parsedId)) {
      res
        .status(400)
        .json({ message: `'${req.params.id}' is not a valid ID.` });
      return;
    }

    const userId = req.userId!;
    const userRole = req.role;

    // check if task exist
    const existingTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parsedId));

    if (existingTask.length === 0) {
      res
        .status(404)
        .json({ message: `Task with ID '${parsedId}' was not found.` });
      return;
    }

    // only creators and admin can update tasks
    const task = existingTask[0];
    const isCreator = task.createdBy === userId;
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      res.status(403).json({
        message:
          "Unauthorized — Only the creator or an admin can update this task.",
      });
      return;
    }

    // validate update body
    const validatedData = updateTaskSchema.parse(req.body);

    // validate task assigned user
    if (validatedData.assignedTo) {
      const userExists = await db
        .select()
        .from(users)
        .where(eq(users.id, validatedData.assignedTo))
        .then((res) => res.length > 0);

      if (!userExists) {
        res.status(400).json({
          message: `Assigned user with ID '${validatedData.assignedTo}' does not exist.`,
        });
        return;
      }
    }

    // update task
    const updateTask = await db
      .update(tasks)
      .set(validatedData)
      .where(eq(tasks.id, parsedId))
      .returning();

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updateTask[0] });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ errors: error.errors });
      return;
    }

    next(error);
  }
};

// delete tasks
export const deleteTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // parse task ID
    const parsedId = parseInt(req.params.id);

    // validate ID
    if (isNaN(parsedId)) {
      res
        .status(400)
        .json({ message: `'${req.params.id}' is not a valid ID.` });
      return;
    }

    const userId = req.userId!;
    const userRole = req.role;

    // check if task exist
    const existingTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parsedId));

    if (existingTask.length === 0) {
      res
        .status(404)
        .json({ message: `Task with ID '${parsedId}' was not found.` });
      return;
    }

    // only creator or admin can delete
    const task = existingTask[0];
    const isCreator = task.createdBy === userId;
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      res.status(403).json({
        message:
          "Unauthorized — Only the creator or an admin can delete this task.",
      });
      return;
    }

    // delete the task
    await db.delete(tasks).where(eq(tasks.id, parsedId));

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
