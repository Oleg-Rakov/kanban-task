"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";

export function MultiSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = "Choose...",
}: {
  label?: string;
  value: T[];
  onChange: (v: T[]) => void;
  options: Array<{ value: T; label: string }>;
  placeholder?: string;
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

  const toggle = (v: T) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  const remove = (v: T) => onChange(value.filter((x) => x !== v));

  return (
    <div ref={ref} className="relative">
      {label ? (
        <div className="mb-[4px] text-[12px] font-medium leading-[16px] text-primary-900">{label}</div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cn(
          "min-h-[40px] h-auto w-full rounded-[8px] border bg-primary-100 p-[12px] outline-none",
          "border-primary-300 hover:border-primary-500",
          "flex items-center gap-[8px] text-left"
        )}
      >
        {value.length ? (
          <div className="flex gap-[8px] overflow-x-auto min-w-0 flex-wrap">
            {value.map((v) => (
              <span
                key={v}
                className={cn(
                  "inline-flex items-center h-[20px] gap-[4px] rounded-[4px]",
                  "bg-primary-900 px-[4px] text-[12px] font-medium leading-[16px] text-primary-100 whitespace-nowrap"
                )}
                onMouseDown={(e) => e.preventDefault()}
              >
                {options.find((o) => o.value === v)?.label ?? v}
                <span
                  className="cursor-pointer text-primary-100/80 hover:text-primary-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(v);
                  }}
                >
                  ×
                </span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[12px] font-normal leading-[20px] text-primary-700">{placeholder}</span>
        )}
      </button>

      {open ? (
          <div className="absolute left-0 top-full mb-[8px] z-[60] w-[210px] max-h-[136px] overflow-y-auto overflow-x-hidden rounded-[8px] border border-[#EEEEEE] bg-[#FEFEFE] shadow-md">
            <div className="flex flex-col">
              {options.map((o) => {
                const checked = value.includes(o.value);
                return (
                    <button
                        key={o.value}
                        type="button"
                        onClick={() => toggle(o.value)}
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
