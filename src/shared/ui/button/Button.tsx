"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "danger-soft" | "ghost" | "text-danger";

export function Button({
  children,
  className,
  variant = "primary",
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        // Base
        "inline-flex items-center justify-center font-medium transition whitespace-nowrap",

        // Primary button (Create/Update)
        variant === "primary" &&
          cn(
            "w-[150px] h-[36px] rounded-[32px] px-[12px] py-[8px] gap-[4px]",
            "bg-primary-900 text-primary-100 text-[12px] leading-[20px]",
            "hover:bg-primary-800",
            disabled && "bg-primary-600 hover:bg-primary-600 cursor-not-allowed"
          ),

        // Soft danger (rare)
        variant === "danger-soft" &&
          cn(
            "h-[36px] rounded-[32px] px-[12px] py-[8px]",
            "bg-status-red-100 text-status-red-500 text-[12px] leading-[20px]",
            "hover:bg-status-red-200",
            disabled && "opacity-60 cursor-not-allowed"
          ),

        // Ghost/neutral button
        variant === "ghost" &&
          cn(
            "h-[36px] rounded-[32px] px-[12px] py-[8px]",
            "text-primary-900 text-[12px] leading-[20px]",
            "hover:bg-primary-200",
            disabled && "opacity-60 cursor-not-allowed"
          ),

        // Text-like danger button (Delete Task)
        variant === "text-danger" &&
          cn(
            "w-[89px] h-[36px] rounded-[32px] px-[12px] py-[8px] gap-[8px]",
            "text-status-red-500 text-[12px] leading-[20px]",
            "hover:text-status-red-400",
            disabled && "opacity-60 cursor-not-allowed"
          ),
        className
      )}
    >
      {children}
    </button>
  );
}
