import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Layout, 
  Settings, 
  LogOut, 
  Plus, 
  LayoutDashboard,
  KanbanSquare
} from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const { user, logout } = useAuth();
  
  // Just grabbing the first workspace for now as default context
  // Real app would have a workspace switcher/context
  const activeWorkspace = workspaces?.[0];
  const { data: projects, isLoading: projectsLoading } = useProjects(activeWorkspace?.id);
  
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);

  // Extract initials
  const initials = user?.username 
    ? user.username.substring(0, 2).toUpperCase() 
    : "U";

  return (
    <div className={cn("flex flex-col h-full border-r bg-card/50 backdrop-blur-xl", className)}>
      <div className="p-4 h-14 border-b flex items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Layout className="h-5 w-5" />
        </div>
        <span className="font-display font-semibold text-lg tracking-tight">TaskFlow</span>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-6">
          {/* Workspaces Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Workspaces
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 hover:bg-primary/10 hover:text-primary"
                onClick={() => setCreateWorkspaceOpen(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {workspacesLoading ? (
              <div className="space-y-1 px-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-1">
                {workspaces?.map((ws) => (
                  <Link key={ws.id} href={`/workspace/${ws.id}`}>
                    <div className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer group",
                      location.startsWith(`/workspace/${ws.id}`) 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}>
                      <LayoutDashboard className="h-4 w-4" />
                      {ws.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Projects Section */}
          {activeWorkspace && (
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Projects
                </h2>
                {/* Project creation is usually context specific, button could go here */}
              </div>
              
              {projectsLoading ? (
                <div className="space-y-1 px-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-1">
                  {projects?.map((project) => (
                    <Link key={project.id} href={`/workspace/${activeWorkspace.id}/project/${project.id}`}>
                      <div className={cn(
                        "flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer",
                        location.includes(`/project/${project.id}`)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}>
                        <KanbanSquare className="h-4 w-4" />
                        <span className="truncate">{project.name}</span>
                      </div>
                    </Link>
                  ))}
                  {projects?.length === 0 && (
                    <div className="px-2 text-xs text-muted-foreground italic">No projects yet</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Footer */}
      <div className="p-4 border-t bg-muted/20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2 py-1.5 h-auto hover:bg-muted">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left overflow-hidden">
                  <span className="text-sm font-medium truncate w-32">
                    {user?.username}
                  </span>
                  <span className="text-xs text-muted-foreground truncate w-32">
                    {user?.email || "No email"}
                  </span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateWorkspaceDialog open={createWorkspaceOpen} onOpenChange={setCreateWorkspaceOpen} />
    </div>
  );
}
