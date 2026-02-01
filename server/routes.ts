import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Require auth for API routes (except maybe read-only public ones? No, secure everything)
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Workspaces
  app.get(api.workspaces.list.path, requireAuth, async (req: any, res) => {
    const userId = req.user!.claims.sub;
    let workspaces = await storage.getWorkspaces(userId);
    
    // Auto-seed if no workspaces exist for this user
    if (workspaces.length === 0) {
      const workspace = await storage.createWorkspace({
        name: "My Workspace",
        description: "Your first workspace",
        ownerId: userId
      });
      
      const project = await storage.createProject({
        name: "My Project",
        description: "Get started with your first project",
        workspaceId: workspace.id
      });
      
      const todoCol = await storage.createColumn({ name: "To Do", projectId: project.id, order: 0 });
      const inProgressCol = await storage.createColumn({ name: "In Progress", projectId: project.id, order: 1 });
      const doneCol = await storage.createColumn({ name: "Done", projectId: project.id, order: 2 });
      
      await storage.createTask({ 
        title: "Welcome to your new project!", 
        description: "Try dragging this task to another column.", 
        columnId: todoCol.id, 
        priority: "high",
        order: 0
      });
      
      await storage.createTask({ 
        title: "Explore the features", 
        description: "Click on a task to see details.", 
        columnId: todoCol.id, 
        priority: "medium",
        order: 1
      });

      workspaces = [workspace];
    }
    
    res.json(workspaces);
  });

  app.post(api.workspaces.create.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.workspaces.create.input.parse(req.body);
      const workspace = await storage.createWorkspace({
        ...input,
        ownerId: req.user!.claims.sub
      });
      res.status(201).json(workspace);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.workspaces.get.path, requireAuth, async (req, res) => {
    const workspace = await storage.getWorkspace(Number(req.params.id));
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    res.json(workspace);
  });

  // Projects
  app.get(api.projects.list.path, requireAuth, async (req, res) => {
    const projects = await storage.getProjects(Number(req.params.workspaceId));
    res.json(projects);
  });

  app.post(api.projects.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject({
        ...input,
        workspaceId: Number(req.params.workspaceId)
      });
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.projects.get.path, requireAuth, async (req, res) => {
    const projectId = Number(req.params.id);
    const project = await storage.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Hydrate project with columns and tasks for the Kanban view
    const columns = await storage.getColumns(projectId);
    const columnsWithTasks = await Promise.all(columns.map(async (col) => {
      const tasks = await storage.getTasks(col.id);
      return { ...col, tasks };
    }));

    res.json({ ...project, columns: columnsWithTasks });
  });

  // Columns
  app.post(api.columns.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.columns.create.input.parse(req.body);
      const column = await storage.createColumn({
        ...input,
        projectId: Number(req.params.projectId)
      });
      res.status(201).json(column);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.columns.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.columns.update.input.parse(req.body);
      const column = await storage.updateColumn(Number(req.params.id), input);
      res.json(column);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.columns.delete.path, requireAuth, async (req, res) => {
    await storage.deleteColumn(Number(req.params.id));
    res.status(204).send();
  });

  // Tasks
  app.post(api.tasks.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask({
        ...input,
        columnId: Number(req.params.columnId)
      });
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.tasks.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.tasks.update.input.parse(req.body);
      const task = await storage.updateTask(Number(req.params.id), input);
      res.json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });
  
  app.patch(api.tasks.move.path, requireAuth, async (req, res) => {
    try {
      const { columnId, order } = api.tasks.move.input.parse(req.body);
      const task = await storage.updateTask(Number(req.params.id), { columnId, order });
      res.json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.tasks.delete.path, requireAuth, async (req, res) => {
    await storage.deleteTask(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}
