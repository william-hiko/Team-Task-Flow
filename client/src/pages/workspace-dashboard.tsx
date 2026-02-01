import { useParams, Link } from "wouter";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, FolderKanban, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function WorkspaceDashboard() {
  const { id } = useParams();
  const workspaceId = Number(id);
  
  const { data: workspace, isLoading: wsLoading } = useWorkspace(workspaceId);
  const { data: projects, isLoading: projectsLoading } = useProjects(workspaceId);
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  
  const [createOpen, setCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProject(
      { ...newProject, workspaceId },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setNewProject({ name: "", description: "" });
        }
      }
    );
  };

  if (wsLoading || projectsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace) return <div>Workspace not found</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{workspace.name}</h1>
          <p className="text-muted-foreground">{workspace.description || "No description provided."}</p>
        </div>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name" 
                  value={newProject.name} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Website Redesign"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc" 
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Link key={project.id} href={`/workspace/${workspaceId}/project/${project.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mb-2 group-hover:scale-110 transition-transform">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <div className="text-xs text-muted-foreground pt-4 border-t w-full flex justify-between items-center">
                  <span>Created {format(new Date(project.createdAt!), "MMM d, yyyy")}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {projects?.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-muted/20">
            <div className="p-4 bg-muted rounded-full mb-4">
              <FolderKanban className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Create your first project to get started.</p>
            <Button variant="outline" onClick={() => setCreateOpen(true)}>
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
