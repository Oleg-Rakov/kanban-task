"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";
import type { Status } from "@/entities/task/model/types";

const map: Record<Status, { bg: string; label: string }> = {
  backlog: { bg: "bg-primary-200", label: "Backlog" },
  in_progress: { bg: "bg-status-green-100", label: "In Progress" },
  done: { bg: "bg-status-orange-100", label: "Done" },
};

export function StatusTag({ status }: { status: Status }) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex self-start h-[18px] items-center rounded-[20px] px-[6px] py-[4px] text-[10px] font-medium leading-[12px]",
        "text-primary-700",
        s.bg
      )}
    >
      {s.label}
    </span>
  );
}
