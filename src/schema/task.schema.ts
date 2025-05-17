import { z } from "zod";

// Tasks can only be assigned to one person

export const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z
    .string()
    .min(1, { message: "A description of this task is required" }),
  dueDate: z
    .preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date
          ? new Date(arg)
          : undefined,
      z.date()
    )
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid due date",
    }),
  status: z
    .enum(["todo", "in_progress", "completed"])
    .optional()
    .default("todo"),
  assignedTo: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  description: z
    .string()
    .min(1, { message: "A description of this task is required" })
    .optional(),
  dueDate: z
    .preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date
          ? new Date(arg)
          : undefined,
      z.date()
    )
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid due date",
    })
    .optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  assignedTo: z.number().optional(),
});
