import { useParams, Link } from "wouter";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, KanbanSquare, ArrowRight, Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function WorkspaceDashboard() {
  const { id } = useParams();
  const workspaceId = Number(id);
  const { data: workspace, isLoading: wsLoading } = useWorkspace(workspaceId);
  const { data: projects, isLoading: projectsLoading, createProject, isCreating } = useProjects(workspaceId);
  const [createOpen, setCreateOpen] = useState(false);

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: InsertProject) => {
    createProject(
      { ...data, workspaceId },
      {
        onSuccess: () => {
          form.reset();
          setCreateOpen(false);
        },
      }
    );
  };

  if (wsLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!workspace) return <div className="p-8">Workspace not found</div>;

  return (
    <div className="h-full overflow-y-auto p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Workspace Header */}
        <div className="flex items-start justify-between border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight font-display">{workspace.name}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{workspace.description}</p>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
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
                  <DialogDescription>
                    Add a new project to {workspace.name}.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe the project goal..." {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Project"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))
            ) : (
              projects?.map((project) => (
                <Link key={project.id} href={`/workspace/${workspace.id}/project/${project.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-muted hover:border-primary/50 flex flex-col justify-between">
                    <CardHeader>
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                        <KanbanSquare className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {project.description || "No description provided."}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="text-sm font-medium text-primary flex items-center group-hover:underline">
                        View Board <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))
            )}
            
            {!projectsLoading && projects?.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-muted/10">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <KanbanSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No projects yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  Get started by creating your first project in this workspace.
                </p>
                <Button variant="secondary" onClick={() => setCreateOpen(true)}>Create Project</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
