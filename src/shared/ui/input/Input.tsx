"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";

export function Input({
  className,
  error,
  hint,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {label ? <div className="mb-[4px] text-[12px] font-medium leading-[16px] text-primary-900">{label}</div> : null}
      <input
        {...props}
        className={cn(
          "w-full rounded-[8px] border bg-primary-100 px-[12px] py-[8px] text-[12px] font-normal leading-[20px] outline-none",
          "border-primary-300 focus:border-primary-700",
          error && "border-status-red-400 focus:border-status-red-400",
          className
        )}
      />
      {error ? <div className="mt-1 text-xs text-status-red-500">{error}</div> : hint ? <div className="mt-1 text-xs text-primary-700">{hint}</div> : null}
    </label>
  );
}
