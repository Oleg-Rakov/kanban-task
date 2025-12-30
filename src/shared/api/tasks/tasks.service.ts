import type { TaskDto } from "./dto";

export const tasksService = {
  async getTasks(): Promise<TaskDto[]> {
    const res = await fetch("/api/tasks", { cache: "no-store" });
    if (!res.ok) throw new Error(await safeMessage(res));
    return res.json();
  },

  async createTask(body: Omit<TaskDto, "id">): Promise<TaskDto> {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await safeMessage(res));
    return res.json();
  },

  async updateTask(id: string, body: Partial<Omit<TaskDto, "id">>): Promise<TaskDto> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await safeMessage(res));
    return res.json();
  },

  async deleteTask(id: string): Promise<{ ok: true }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await safeMessage(res));
    return res.json();
  },
};

async function safeMessage(res: Response) {
  try {
    const json = await res.json();
    return json?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}
