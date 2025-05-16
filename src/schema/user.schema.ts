import { z } from "zod";

// Password must:
// - Be between 6 and 24 characters
// - Include at least one uppercase letter
// - Include at least one lowercase letter
// - Include at least one number
// - Include at least one special character

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name field must contain at least 2 characters" })
    .max(50, { message: "Name field cannot exceed 50 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 characters" })
    .max(24, { message: "Password cannot exceed 24 characters" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must include at least one number",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must include at least one special character",
    }),
  role: z.enum(["admin", "user"]).optional().default("user"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name field must contain at least 2 characters" })
    .max(50, { message: "Name field cannot exceed 50 characters" })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 characters" })
    .max(24, { message: "Password cannot exceed 24 characters" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must include at least one number",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must include at least one special character",
    })
    .optional(),
  role: z.enum(["admin", "user"]).optional(),
});
