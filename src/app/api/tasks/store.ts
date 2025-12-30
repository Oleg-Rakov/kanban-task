import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { TaskDto } from "@/shared/api/tasks/dto";

const FILE_PATH = path.join(process.cwd(), "data", "tasks.json");

let cache: TaskDto[] | null = null;

async function readFileTasks(): Promise<TaskDto[]> {
  const raw = await fs.readFile(FILE_PATH, "utf8");
  const parsed = JSON.parse(raw) as TaskDto[];
  return parsed;
}

async function writeFileTasks(tasks: TaskDto[]) {
  await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2) + "\n", "utf8");
}

export async function getAllTasks(): Promise<TaskDto[]> {
  if (!cache) {
    cache = await readFileTasks();
  }
  return cache;
}

export async function createTask(task: Omit<TaskDto, "id">): Promise<TaskDto> {
  const tasks = await getAllTasks();
  const created: TaskDto = { ...task, id: randomUUID() };
  cache = [created, ...tasks];
  await writeFileTasks(cache);
  return created;
}

export async function updateTask(id: string, patch: Partial<Omit<TaskDto, "id">>): Promise<TaskDto> {
  const tasks = await getAllTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw Object.assign(new Error("Task not found"), { status: 404 });
  const updated = { ...tasks[idx], ...patch, id };
  const next = tasks.slice();
  next[idx] = updated;
  cache = next;
  await writeFileTasks(cache);
  return updated;
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = await getAllTasks();
  const found = tasks.find((t) => t.id === id);
  if (!found) throw Object.assign(new Error("Task not found"), { status: 404 });

  if (found.status === "in_progress") {
    throw Object.assign(new Error("Cannot delete task in progress"), { status: 409 });
  }

  cache = tasks.filter((t) => t.id !== id);
  await writeFileTasks(cache);
}
