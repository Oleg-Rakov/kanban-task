import { promises as fs } from "node:fs";
import path from "node:path";
import type { TaskDto } from "@/shared/api/tasks/dto";

const filePath = path.join(process.cwd(), "data", "tasks.json");

// simple in-process mutex for file writes
let queue = Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  // Ensure queue continues even if fn rejects
  queue = next.then(() => undefined, () => undefined);
  return next;
}

export async function readAll(): Promise<TaskDto[]> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as TaskDto[];
}

export async function writeAll(tasks: TaskDto[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");
}

export async function listTasks(): Promise<TaskDto[]> {
  return readAll();
}

export async function createTask(input: Omit<TaskDto, "id">): Promise<TaskDto> {
  return withLock(async () => {
    const tasks = await readAll();
    const id = crypto.randomUUID();
    const task: TaskDto = {
      id,
      name: input.name ?? "",
      key: input.key ?? "",
      description: input.description ?? "",
      status: (input.status ?? "backlog") as any,
      labels: (input.labels ?? []) as any,
    };
    tasks.unshift(task);
    await writeAll(tasks);
    return task;
  });
}

export async function updateTask(id: string, patch: Partial<Omit<TaskDto, "id">>): Promise<TaskDto | null> {
  return withLock(async () => {
    const tasks = await readAll();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const updated: TaskDto = {
      ...tasks[idx],
      ...patch,
      id,
    };
    tasks[idx] = updated;
    await writeAll(tasks);
    return updated;
  });
}

export async function deleteTask(id: string): Promise<{ ok: true } | { ok: false; conflict: true } | null> {
  return withLock(async () => {
    const tasks = await readAll();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    if (tasks[idx].status === "in_progress") {
      return { ok: false, conflict: true };
    }
    tasks.splice(idx, 1);
    await writeAll(tasks);
    return { ok: true };
  });
}
