"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";

const statusBg: Record<string, string> = {
  in_progress: "bg-status-green-100",
  done: "bg-status-orange-100",
  onboarding: "bg-primary-200",
  backlog: "bg-primary-200",
};

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = "Choose...",
  className,
}: {
  label?: string;
  value: T | "";
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = value ? options.find((o) => o.value === value) : undefined;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label ? (
        <div className="mb-[4px] text-[12px] font-medium leading-[16px] text-primary-900">{label}</div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cn(
          "h-[46px] w-full rounded-[8px] border bg-primary-100 p-[12px] outline-none",
          "border-primary-300 hover:border-primary-500",
          "flex items-center justify-between gap-[8px] text-left"
        )}
      >
        {selected ? (
          <span
            className={cn(
              "inline-flex items-center h-[18px] rounded-[20px] px-[6px] py-[4px]",
              "text-[10px] font-medium leading-[12px] text-primary-700",
              statusBg[String(selected.value)] ?? "bg-primary-200"
            )}
          >
            {selected.label}
          </span>
        ) : (
          <span className="text-[12px] font-normal leading-[20px] text-primary-700">{placeholder}</span>
        )}

        <span className="shrink-0 text-primary-700">▾</span>
      </button>

      {open ? (
          <div className="absolute right-0 top-full z-[60] mt-[8px] w-[205px] max-h-[136px] overflow-y-auto overflow-x-hidden rounded-[8px] border border-[#EEEEEE] bg-[#FEFEFE] shadow-md">
            <div className="flex flex-col">
              {options.map((o) => {
                const checked = o.value === value;
                return (
                    <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-[360px] h-[34px] flex items-center justify-between gap-[8px]",
                    "px-[12px] py-[8px] text-[12px] font-normal leading-[16px] text-primary-900",
                    "border-b border-primary-300 hover:bg-primary-200",
                    checked && "font-semibold"
                  )}
                >
                  <span>{o.label}</span>
                  {checked ? <span>✓</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
