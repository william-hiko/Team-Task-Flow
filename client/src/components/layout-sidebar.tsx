import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { 
  Layout, 
  Plus, 
  Settings, 
  LogOut, 
  Briefcase,
  ChevronRight,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar({ className }: { className?: string }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { data: workspaces } = useWorkspaces();

  // Helper to extract initials
  const initials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-sidebar", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              TaskFlow
            </h2>
          </div>
          
          <div className="px-3 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 h-12">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback>{initials(user?.firstName || "U")}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-xs">
                    <span className="font-medium truncate max-w-[120px]">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-muted-foreground truncate max-w-[120px]">
                      {user?.email}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1">
            <Button 
              asChild 
              variant={location === "/" ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <Link href="/">
                <Briefcase className="mr-2 h-4 w-4" />
                All Workspaces
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-4 mb-2">
            <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Workspaces
            </h2>
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
              <Link href="/?new=true">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {workspaces?.map((workspace) => (
                <Button
                  key={workspace.id}
                  asChild
                  variant={location.startsWith(`/workspace/${workspace.id}`) ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal"
                >
                  <Link href={`/workspace/${workspace.id}`}>
                    <div className="flex items-center w-full">
                      <span className="truncate">{workspace.name}</span>
                      {location.startsWith(`/workspace/${workspace.id}`) && (
                        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                      )}
                    </div>
                  </Link>
                </Button>
              ))}
              {workspaces?.length === 0 && (
                <div className="text-sm text-muted-foreground px-4 py-2">
                  No workspaces yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
