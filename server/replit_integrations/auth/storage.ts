// This file is now a lightweight wrapper since we moved logic to replitAuth.ts 
// to consolidate the local strategy implementation
import { authStorage } from "./replitAuth";
export { authStorage };
export interface IAuthStorage {} // Deprecated interface
