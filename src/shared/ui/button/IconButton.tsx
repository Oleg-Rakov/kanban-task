"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";

export function IconButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-primary-100 hover:bg-primary-300 transition",
        className
      )}
    />
  );
}
