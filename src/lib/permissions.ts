// src/lib/permissions.ts
import type { Role } from "./types";

export type Action =
  | "view_deadline"
  | "mark_done"
  | "add_deadline"
  | "delete_deadline";

// Permission matrix - single source of truth
const PERMISSIONS: Record<Action, Role[]> = {
  view_deadline: ["guest", "user", "admin"],
  mark_done: ["user", "admin"],
  add_deadline: ["admin"],
  delete_deadline: ["admin"],
};

/**
 * Check if a role has permission to perform an action.
 * Single source of truth for all authorization decisions.
 */
export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[action].includes(role);
}

