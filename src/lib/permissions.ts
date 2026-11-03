import type { Role } from "./types";

export type Action =
  | "view_deadline"
  | "mark_done"
  | "add_deadline"
  | "delete_deadline";

const PERMISSIONS: Record<Action, Role[]> = {
  view_deadline: ["guest", "user", "admin"],
  mark_done: ["user", "admin"],
  add_deadline: ["admin"],
  delete_deadline: ["admin"],
};

export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[action].includes(role);
}

