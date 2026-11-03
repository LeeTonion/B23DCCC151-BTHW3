import fs from "fs";
import path from "path";
import type { Subject, Deadline, User } from "./types";
import initialSubjects from "../../data/subjects.json";
import initialDeadlines from "../../data/deadlines.json";
import initialUsers from "../../data/users.json";

const dataDir = path.join(process.cwd(), "data");

let memorySubjects = [...(initialSubjects as Subject[])];
let memoryDeadlines = [...(initialDeadlines as Deadline[])];
let memoryUsers = [...(initialUsers as User[])];

function readJSON<T>(filename: string): T {
  try {
    const filepath = path.join(dataDir, filename);
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch {}

  if (filename === "subjects.json") return memorySubjects as unknown as T;
  if (filename === "deadlines.json") return memoryDeadlines as unknown as T;
  if (filename === "users.json") return memoryUsers as unknown as T;
  return [] as unknown as T;
}

function writeJSON<T>(filename: string, data: T): void {
  if (filename === "subjects.json") memorySubjects = data as unknown as Subject[];
  if (filename === "deadlines.json") memoryDeadlines = data as unknown as Deadline[];
  if (filename === "users.json") memoryUsers = data as unknown as User[];

  try {
    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
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
