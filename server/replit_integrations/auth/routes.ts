import type { Express } from "express";
import { authStorage } from "./replitAuth";

// Register auth-specific routes
// Most routes are now handled directly in replitAuth.ts setupAuth
export function registerAuthRoutes(app: Express): void {
  // Keeping this for backward compatibility if any other modules import it
  // But the main auth logic is now in replitAuth.ts
}
