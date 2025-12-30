import { NextResponse } from "next/server";
import type { TaskDto } from "@/shared/api/tasks/dto";
import { getAllTasks, createTask } from "./store";

export const runtime = "nodejs";

export async function GET() {
  const tasks = await getAllTasks();
  // requirement: fixed list of 20 tasks
  return NextResponse.json(tasks.slice(0, 20));
}

export async function POST(req: Request) {
  const body = (await req.json()) as Omit<TaskDto, "id">;
  const created = await createTask(body);
  return NextResponse.json(created, { status: 201 });
}
