"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";

type ToastType = "success" | "error";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
};

type ToastContextValue = {
  success: (title: string) => void;
  error: (title: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Toast[]>([]);

  const push = React.useCallback((type: ToastType, title: string) => {
    const id = crypto.randomUUID();
    const toast: Toast = { id, type, title };
    setItems((prev) => [toast, ...prev].slice(0, 5));

    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const value = React.useMemo<ToastContextValue>(
    () => ({
      success: (t) => push("success", t),
      error: (t) => push("error", t),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-6 top-6 z-[60] flex w-[320px] flex-col gap-3">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-xl2 border border-primary-300 bg-primary-100 px-4 py-3 shadow-soft",
              t.type === "success" && "border-status-green-300",
              t.type === "error" && "border-status-red-300"
            )}
          >
            <div className="text-sm font-semibold">
              {t.type === "success" ? "Success" : "Error"}
            </div>
            <div className="text-sm text-primary-800">{t.title}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
