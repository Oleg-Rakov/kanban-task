import { NextResponse } from "next/server";
import type { TaskDto } from "@/shared/api/tasks/dto";
import { updateTask, deleteTask } from "../store";

export const runtime = "nodejs";

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const patch = (await req.json()) as Partial<Omit<TaskDto, "id">>;
    const updated = await updateTask(ctx.params.id, patch);
    return NextResponse.json(updated);
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ message: e?.message ?? "Error" }, { status });
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    await deleteTask(ctx.params.id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ message: e?.message ?? "Error" }, { status });
  }
}
