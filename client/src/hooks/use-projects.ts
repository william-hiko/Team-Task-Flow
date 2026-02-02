import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertProject } from "@shared/schema";

export function useProjects(workspaceId?: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey = workspaceId ? [api.projects.list.path, workspaceId] : null;

  const { data: projects, isLoading } = useQuery({
    queryKey: queryKey || [],
    enabled: !!workspaceId,
    queryFn: async () => {
      if (!workspaceId) throw new Error("Workspace ID required");
      const url = buildUrl(api.projects.list.path, { workspaceId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      return api.projects.list.responses[200].parse(await res.json());
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject & { workspaceId: number }) => {
      const { workspaceId, ...body } = data;
      const url = buildUrl(api.projects.create.path, { workspaceId });
      
      const res = await fetch(url, {
        method: api.projects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create project");
      return api.projects.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path, variables.workspaceId] });
      toast({ title: "Success", description: "Project created successfully" });
    },
  });

  return {
    projects,
    isLoading,
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
  };
}

export function useProject(id: number) {
  return useQuery({
    queryKey: [api.projects.get.path, id],
    enabled: !isNaN(id),
    queryFn: async () => {
      const url = buildUrl(api.projects.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch project");
      return api.projects.get.responses[200].parse(await res.json());
    },
  });
}
