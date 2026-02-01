import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import Home from "@/pages/home";
import WorkspaceDashboard from "@/pages/workspace-dashboard";
import ProjectKanban from "@/pages/project-kanban";

function ProtectedRoute({ component: Component, ...props }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0 hidden md:block" />
      <main className="flex-1 overflow-y-auto">
        <Component {...props} />
      </main>
    </div>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/" /> : <LoginPage />}
      </Route>

      <Route path="/">
        <ProtectedRoute component={Home} />
      </Route>

      <Route path="/workspace/:id">
        <ProtectedRoute component={WorkspaceDashboard} />
      </Route>

      <Route path="/workspace/:wsId/project/:id">
        <ProtectedRoute component={ProjectKanban} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
