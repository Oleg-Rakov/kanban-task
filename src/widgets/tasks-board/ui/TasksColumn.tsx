"use client";

import React from "react";
import type { Status, Task } from "@/entities/task/model/types";
import { TaskCard } from "@/entities/task/ui/TaskCard";
import { cn } from "@/shared/lib/cn";

export function TasksColumn({
  title,
  status,
  tasks,
  onTaskClick,
}: {
  title: string;
  status: Status;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  return (
    <section className="w-[380px] rounded-xl3 bg-primary-200 p-[12px]">
      <h3 className="h-[16px] w-[190px] pl-[8px] text-[16px] font-bold leading-[16px] text-primary-900">
        {title}
      </h3>

      <div className={cn("mt-[16px] grid gap-[16px]")}>
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onClick={() => onTaskClick(t)} />
        ))}
      </div>
    </section>
  );
}
