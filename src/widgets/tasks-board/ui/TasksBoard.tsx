"use client";

import React from "react";
import type { Task } from "@/entities/task/model/types";
import { TasksColumn } from "./TasksColumn";

export function TasksBoard({
  tasks,
  onTaskClick,
}: {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  const backlog = tasks.filter((t) => t.status === "backlog");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-start">
      <TasksColumn title="Backlog" status="backlog" tasks={backlog} onTaskClick={onTaskClick} />
      <TasksColumn title="In Progress" status="in_progress" tasks={inProgress} onTaskClick={onTaskClick} />
      <TasksColumn title="Done" status="done" tasks={done} onTaskClick={onTaskClick} />
    </div>
  );
}
