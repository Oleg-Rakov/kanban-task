"use client";

import React from "react";
import type { Task } from "@/entities/task/model/types";
import { cn } from "@/shared/lib/cn";
import { StatusTag } from "@/shared/ui/tag";
import { Chip } from "@/shared/ui/chip";

export function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-[356px] rounded-[16px] border border-primary-300 bg-primary-100 p-[12px] text-left shadow-sm transition",
        "hover:border-primary-700",
        "flex flex-col gap-[16px]"
      )}
    >
      <StatusTag status={task.status} />

      <div className="flex flex-col gap-[4px]">
        <div className="text-[14px] font-bold leading-[16px] text-primary-900">{task.name}</div>
        <div className="text-[12px] font-normal leading-[16px] text-primary-600">{task.key}</div>
      </div>

      <div className={cn("text-[12px] font-normal leading-[16px]", "text-[rgba(38,38,38,0.70)]", "line-clamp-2")}>
        {task.description}
      </div>

      <div className="w-[332px] border-t-[0.5px] border-primary-300" />

      <div className="flex flex-wrap gap-[4px]">
        {task.labels.map((l) => (
          <Chip key={l}>{labelPretty(l)}</Chip>
        ))}
      </div>
    </button>
  );
}

function labelPretty(v: string) {
  return v
    .split("_")
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}
