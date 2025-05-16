import {
  pgTable,
  pgEnum,
  serial,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const taskStatusEnum = pgEnum("status", [
  "todo",
  "in_progress",
  "completed",
]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: taskStatusEnum().default("todo"),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  assignedTo: integer("assigned_to")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
