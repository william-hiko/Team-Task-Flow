import { z } from 'zod';
import { 
  insertWorkspaceSchema, 
  insertProjectSchema, 
  insertColumnSchema, 
  insertTaskSchema,
  insertSubtaskSchema,
  insertCommentSchema,
  workspaces,
  projects,
  columns,
  tasks,
  subtasks,
  comments,
  users
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  workspaces: {
    list: {
      method: 'GET' as const,
      path: '/api/workspaces',
      responses: {
        200: z.array(z.custom<typeof workspaces.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/workspaces',
      input: insertWorkspaceSchema.omit({ ownerId: true }), // ownerId comes from auth session
      responses: {
        201: z.custom<typeof workspaces.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/workspaces/:id',
      responses: {
        200: z.custom<typeof workspaces.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/workspaces/:workspaceId/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/workspaces/:workspaceId/projects',
      input: insertProjectSchema.omit({ workspaceId: true }),
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/projects/:id',
      responses: {
        200: z.custom<typeof projects.$inferSelect & { columns: (typeof columns.$inferSelect & { tasks: typeof tasks.$inferSelect[] })[] }>(), // Deep nested response
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  columns: {
    create: {
      method: 'POST' as const,
      path: '/api/projects/:projectId/columns',
      input: insertColumnSchema.omit({ projectId: true }),
      responses: {
        201: z.custom<typeof columns.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/columns/:id',
      input: insertColumnSchema.partial(),
      responses: {
        200: z.custom<typeof columns.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/columns/:id',
      responses: {
        204: z.void(),
      },
    }
  },
  tasks: {
    create: {
      method: 'POST' as const,
      path: '/api/columns/:columnId/tasks',
      input: insertTaskSchema.omit({ columnId: true }),
      responses: {
        201: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/tasks/:id',
      input: insertTaskSchema.partial(),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    move: {
      method: 'PATCH' as const,
      path: '/api/tasks/:id/move',
      input: z.object({
        columnId: z.number(),
        order: z.number(),
      }),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tasks/:id',
      responses: {
        204: z.void(),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
