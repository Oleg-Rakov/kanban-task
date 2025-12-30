"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";

type ModalContextValue = {
  open: (node: React.ReactNode) => void;
  close: () => void;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [node, setNode] = React.useState<React.ReactNode>(null);

  const open = React.useCallback((n: React.ReactNode) => setNode(n), []);
  const close = React.useCallback(() => setNode(null), []);

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      {node ? (
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-primary-900/60 p-4"
          )}
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) close();
          }}
        >
          {node}
        </div>
      ) : null}
    </ModalContext.Provider>
  );
}

export function ModalShell({
  title,
  children,
  onClose,
  footer,
  className,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[480px] rounded-xl3 bg-primary-400 shadow-modal",
        "relative overflow-visible p-[24px] flex flex-col gap-[40px]",
        className
      )}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[432px] flex flex-col gap-[32px]">
        <div className="flex items-start justify-between">
          <h2 className="text-[18px] font-bold leading-[20px] text-primary-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "inline-flex items-center justify-center",
              "w-[36px] h-[36px] rounded-[32px] p-[12px]",
              "bg-primary-200 text-primary-900 transition hover:bg-primary-300"
            )}
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-[16px]">{children}</div>
      </div>

      {footer ? <div className="w-[432px]">{footer}</div> : null}
    </div>
  );
}

