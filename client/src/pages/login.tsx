import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Layout className="w-8 h-8 text-primary" />
            TaskFlow
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold tracking-tight font-display mb-6">
            Manage projects with clarity and focus.
          </h1>
          <p className="text-lg text-slate-300">
            Streamline your workflow, collaborate with your team, and ship faster. 
            The modern standard for high-performance teams.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-400">
          © 2024 TaskFlow Inc.
        </div>
      </div>

      {/* Right side - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4 lg:hidden">
              <Layout className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full h-12 text-base font-semibold" 
              onClick={() => window.location.href = "/api/login"}
            >
              Log in with Replit
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Secure Authentication
                </span>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              By clicking continue, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
