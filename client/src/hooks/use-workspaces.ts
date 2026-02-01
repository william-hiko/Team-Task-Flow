import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import type { InsertWorkspace, Workspace } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useWorkspaces() {
  const { toast } = useToast();
  
  return useQuery<Workspace[]>({
    queryKey: [api.workspaces.list.path],
    queryFn: async () => {
      const res = await fetch(api.workspaces.list.path);
      if (res.status === 401) return []; // Handled by useAuth generally
      if (!res.ok) throw new Error("Failed to fetch workspaces");
      return res.json();
    },
  });
}

export function useWorkspace(id: number) {
  return useQuery<Workspace>({
    queryKey: [api.workspaces.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.workspaces.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch workspace");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertWorkspace, "ownerId">) => {
      const res = await apiRequest("POST", api.workspaces.create.path, data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.workspaces.list.path] });
      toast({
        title: "Workspace created",
        description: `"${data.name}" has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create workspace",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
