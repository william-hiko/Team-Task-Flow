import { 
  workspaces, workspaceMembers, projects, columns, tasks, subtasks, comments, users,
  type Workspace, type InsertWorkspace,
  type Project, type InsertProject,
  type Column, type InsertColumn,
  type Task, type InsertTask,
  type Subtask, type InsertSubtask,
  type Comment, type InsertComment,
  type User
} from "@shared/schema";
import { db } from "./db";
import { eq, and, asc, desc } from "drizzle-orm";

export interface IStorage {
  // Workspaces
  getWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspace(id: number): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  
  // Projects
  getProjects(workspaceId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Columns
  getColumns(projectId: number): Promise<Column[]>;
  createColumn(column: InsertColumn): Promise<Column>;
  updateColumn(id: number, updates: Partial<InsertColumn>): Promise<Column>;
  deleteColumn(id: number): Promise<void>;
  
  // Tasks
  getTasks(columnId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  
  // Subtasks
  getSubtasks(taskId: number): Promise<Subtask[]>;
  createSubtask(subtask: InsertSubtask): Promise<Subtask>;
  updateSubtask(id: number, updates: Partial<InsertSubtask>): Promise<Subtask>;
  deleteSubtask(id: number): Promise<void>;
  
  // Comments
  getComments(taskId: number): Promise<(Comment & { user: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class DatabaseStorage implements IStorage {
  // Workspaces
  async getWorkspaces(userId: string): Promise<Workspace[]> {
    return await db.select().from(workspaces).where(eq(workspaces.ownerId, userId));
  }

  async getWorkspace(id: number): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace;
  }

  async createWorkspace(workspace: InsertWorkspace): Promise<Workspace> {
    const [newWorkspace] = await db.insert(workspaces).values(workspace).returning();
    return newWorkspace;
  }

  // Projects
  async getProjects(workspaceId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.workspaceId, workspaceId));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  // Columns
  async getColumns(projectId: number): Promise<Column[]> {
    return await db.select().from(columns)
      .where(eq(columns.projectId, projectId))
      .orderBy(asc(columns.order));
  }

  async createColumn(column: InsertColumn): Promise<Column> {
    const [newColumn] = await db.insert(columns).values(column).returning();
    return newColumn;
  }

  async updateColumn(id: number, updates: Partial<InsertColumn>): Promise<Column> {
    const [updatedColumn] = await db.update(columns)
      .set(updates)
      .where(eq(columns.id, id))
      .returning();
    return updatedColumn;
  }

  async deleteColumn(id: number): Promise<void> {
    await db.delete(columns).where(eq(columns.id, id));
  }

  // Tasks
  async getTasks(columnId: number): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(eq(tasks.columnId, columnId))
      .orderBy(asc(tasks.order));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db.update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Subtasks
  async getSubtasks(taskId: number): Promise<Subtask[]> {
    return await db.select().from(subtasks)
      .where(eq(subtasks.taskId, taskId))
      .orderBy(asc(subtasks.order));
  }

  async createSubtask(subtask: InsertSubtask): Promise<Subtask> {
    const [newSubtask] = await db.insert(subtasks).values(subtask).returning();
    return newSubtask;
  }

  async updateSubtask(id: number, updates: Partial<InsertSubtask>): Promise<Subtask> {
    const [updatedSubtask] = await db.update(subtasks)
      .set(updates)
      .where(eq(subtasks.id, id))
      .returning();
    return updatedSubtask;
  }

  async deleteSubtask(id: number): Promise<void> {
    await db.delete(subtasks).where(eq(subtasks.id, id));
  }

  // Comments
  async getComments(taskId: number): Promise<(Comment & { user: User })[]> {
    const rows = await db.select({
      comment: comments,
      user: users
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.taskId, taskId))
    .orderBy(asc(comments.createdAt));

    return rows.map(row => ({
      ...row.comment,
      user: row.user
    }));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }
}

export const storage = new DatabaseStorage();
