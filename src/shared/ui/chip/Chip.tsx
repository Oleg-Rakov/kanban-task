"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[20px] bg-primary-200 px-[6px] py-[4px] text-[10px] font-semibold leading-[12px] text-primary-700",
        className
      )}
    >
      {children}
    </span>
  );
}
