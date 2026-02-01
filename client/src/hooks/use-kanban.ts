import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import type { InsertColumn, InsertTask, Task, Column } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Columns
export function useCreateColumn() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, ...data }: Omit<InsertColumn, "projectId"> & { projectId: number }) => {
      const url = buildUrl(api.columns.create.path, { projectId });
      const res = await apiRequest("POST", url, data);
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, vars.projectId] });
      toast({ title: "Column added" });
    },
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: number; projectId: number }) => {
      const url = buildUrl(api.columns.delete.path, { id });
      await apiRequest("DELETE", url);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, vars.projectId] });
      toast({ title: "Column deleted" });
    },
  });
}

// Tasks
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ columnId, projectId, ...data }: Omit<InsertTask, "columnId"> & { columnId: number; projectId: number }) => {
      const url = buildUrl(api.tasks.create.path, { columnId });
      const res = await apiRequest("POST", url, data);
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, vars.projectId] });
      toast({ title: "Task created" });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      taskId, 
      columnId, 
      order, 
      projectId 
    }: { 
      taskId: number; 
      columnId: number; 
      order: number; 
      projectId: number;
    }) => {
      const url = buildUrl(api.tasks.move.path, { id: taskId });
      const res = await apiRequest("PATCH", url, { columnId, order });
      return res.json();
    },
    // We rely on optimistic UI in the component for smoothness, 
    // but we invalidate to ensure consistency eventually
    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, vars.projectId] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: number; projectId: number }) => {
      const url = buildUrl(api.tasks.delete.path, { id });
      await apiRequest("DELETE", url);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, vars.projectId] });
      toast({ title: "Task deleted" });
    },
  });
}
