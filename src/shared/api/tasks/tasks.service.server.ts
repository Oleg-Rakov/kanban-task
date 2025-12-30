import type { TaskDto } from "./dto";

export const tasksServiceServer = {
  async getTasks(baseUrl: string): Promise<TaskDto[]> {
    const res = await fetch(`${baseUrl}/api/tasks`, { cache: "no-store" });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
};
