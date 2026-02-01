import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import type { InsertProject, Project, Column, Task } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type ProjectWithDetails = Project & {
  columns: (Column & { tasks: Task[] })[];
};

export function useProjects(workspaceId: number) {
  return useQuery<Project[]>({
    queryKey: [api.projects.list.path, workspaceId],
    queryFn: async () => {
      const url = buildUrl(api.projects.list.path, { workspaceId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: !!workspaceId,
  });
}

export function useProject(id: number) {
  return useQuery<ProjectWithDetails>({
    queryKey: [api.projects.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.projects.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch project details");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ workspaceId, ...data }: Omit<InsertProject, "workspaceId"> & { workspaceId: number }) => {
      const url = buildUrl(api.projects.create.path, { workspaceId });
      const res = await apiRequest("POST", url, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate project list for this workspace
      const listUrl = buildUrl(api.projects.list.path, { workspaceId: variables.workspaceId });
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path, variables.workspaceId] });
      toast({
        title: "Project created",
        description: "Your new project is ready.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
