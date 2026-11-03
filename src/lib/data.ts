import fs from "fs";
import path from "path";
import type { Subject, Deadline, User } from "./types";

const dataDir = path.join(process.cwd(), "data");

function readJSON<T>(filename: string): T {
  const filepath = path.join(dataDir, filename);
  const content = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(content) as T;
}

function writeJSON<T>(filename: string, data: T): void {
  const filepath = path.join(dataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

export function getSubjects(): Subject[] {
  return readJSON<Subject[]>("subjects.json");
}

export function getSubjectBySlug(slug: string): Subject | undefined {
  return getSubjects().find((s) => s.slug === slug);
}

export function getDeadlines(): Deadline[] {
  return readJSON<Deadline[]>("deadlines.json");
}

export function getDeadlineById(id: string): Deadline | undefined {
  return getDeadlines().find((d) => d.id === id);
}

export function getDeadlinesBySubject(subjectSlug: string): Deadline[] {
  return getDeadlines().filter((d) => d.subjectSlug === subjectSlug);
}

export function addDeadline(
  deadline: Omit<Deadline, "id" | "createdAt" | "completedBy">
): Deadline {
  const deadlines = getDeadlines();
  const newDeadline: Deadline = {
    ...deadline,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    completedBy: [],
  };
  deadlines.push(newDeadline);
  writeJSON("deadlines.json", deadlines);
  return newDeadline;
}

export function deleteDeadline(id: string): boolean {
  const deadlines = getDeadlines();
  const index = deadlines.findIndex((d) => d.id === id);
  if (index === -1) return false;
  deadlines.splice(index, 1);
  writeJSON("deadlines.json", deadlines);
  return true;
}

export function toggleDeadlineComplete(
  deadlineId: string,
  userId: string
): Deadline | null {
  const deadlines = getDeadlines();
  const deadline = deadlines.find((d) => d.id === deadlineId);
  if (!deadline) return null;

  const idx = deadline.completedBy.indexOf(userId);
  if (idx === -1) {
    deadline.completedBy.push(userId);
  } else {
    deadline.completedBy.splice(idx, 1);
  }

  writeJSON("deadlines.json", deadlines);
  return deadline;
}

export function getUsers(): User[] {
  return readJSON<User[]>("users.json");
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

