import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workspaceMembers = pgTable("workspace_members", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").notNull().references(() => workspaces.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role", { enum: ["admin", "member"] }).notNull().default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  workspaceId: integer("workspace_id").notNull().references(() => workspaces.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const columns = pgTable("columns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  columnId: integer("column_id").notNull().references(() => columns.id),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).default("medium"),
  dueDate: timestamp("due_date"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subtasks = pgTable("subtasks", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => tasks.id),
  title: text("title").notNull(),
  completed: boolean("completed").default(false),
  order: integer("order").notNull().default(0),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => tasks.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const taskAssignees = pgTable("task_assignees", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => tasks.id),
  userId: varchar("user_id").notNull().references(() => users.id),
});

// === RELATIONS ===

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  projects: many(projects),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  columns: many(columns),
}));

export const columnsRelations = relations(columns, ({ one, many }) => ({
  project: one(projects, {
    fields: [columns.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
  subtasks: many(subtasks),
  comments: many(comments),
  assignees: many(taskAssignees),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const taskAssigneesRelations = relations(taskAssignees, ({ one }) => ({
  task: one(tasks, {
    fields: [taskAssignees.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskAssignees.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertColumnSchema = createInsertSchema(columns).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubtaskSchema = createInsertSchema(subtasks).omit({ id: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertTaskAssigneeSchema = createInsertSchema(taskAssignees).omit({ id: true });

// === TYPES ===

export type Workspace = typeof workspaces.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Column = typeof columns.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Subtask = typeof subtasks.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type TaskAssignee = typeof taskAssignees.$inferSelect;

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertColumn = z.infer<typeof insertColumnSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertSubtask = z.infer<typeof insertSubtaskSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertTaskAssignee = z.infer<typeof insertTaskAssigneeSchema>;
