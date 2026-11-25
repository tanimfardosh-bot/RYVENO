"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { Check, X } from "lucide-react";

type Toast = { id: number; message: string; kind: "success" | "error" };
const ToastContext = createContext<{ notify: (message: string, kind?: "success" | "error") => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, kind: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-4 z-[200] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 border border-neutral-200 bg-white px-4 py-3.5 shadow-[0_10px_40px_rgba(0,0,0,.12)] animate-slideIn"
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center ${t.kind === "error" ? "bg-red-50 text-red-600" : "bg-ink text-white"}`}>
              {t.kind === "error" ? <X size={14} /> : <Check size={14} />}
            </span>
            <p className="flex-1 text-[13px] font-medium leading-snug">{t.message}</p>
            <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="text-neutral-400 hover:text-ink" aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
