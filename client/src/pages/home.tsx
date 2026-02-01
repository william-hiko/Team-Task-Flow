import { useWorkspaces } from "@/hooks/use-workspaces";
import { CreateWorkspaceDialog } from "@/components/create-workspace-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Layout, ArrowRight, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function Home() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const [location] = useLocation();
  const [createOpen, setCreateOpen] = useState(false);

  // Auto-open create dialog if url query param exists
  useEffect(() => {
    if (window.location.search.includes("new=true")) {
      setCreateOpen(true);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Select a workspace to continue your work.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="lg" className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces?.map((workspace) => (
          <Link key={workspace.id} href={`/workspace/${workspace.id}`}>
            <Card className="group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 hover:border-primary/50 h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Layout className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </div>
                <CardTitle className="text-xl">{workspace.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {workspace.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <div className="text-sm text-muted-foreground pt-4 border-t w-full">
                  Created {format(new Date(workspace.createdAt!), "MMM d, yyyy")}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {workspaces?.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-2xl bg-muted/10">
            <div className="p-6 bg-muted/50 rounded-full mb-6">
              <Layout className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No workspaces yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Workspaces organize your projects and team members. Create one to get started.
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              Create Your First Workspace
            </Button>
          </div>
        )}
      </div>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
