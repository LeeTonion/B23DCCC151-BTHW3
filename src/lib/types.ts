import "next-auth";
import type { DefaultSession } from "next-auth";

export type Role = "admin" | "user" | "guest";
export type DeadlinePriority = "high" | "medium" | "low";
export type DeadlineType =
  | "assignment"
  | "exam"
  | "lab"
  | "project"
  | "quiz"
  | "report"
  | "presentation";

export interface Subject {
  id: string;
  slug: string;
  name: string;
  code: string;
  description: string;
  instructor: string;
  color: string;
  icon: string;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectSlug: string;
  subjectName: string;
  subjectCode: string;
  dueDate: string;
  priority: DeadlinePriority;
  type: DeadlineType;
  createdAt: string;
  completedBy: string[]; // array of user IDs
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  studentId: string;
  createdAt: string;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  studentId: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      studentId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    studentId: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    studentId: string;
  }
}
