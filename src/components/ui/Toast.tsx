"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

const TOAST_CONFIG: Record<
  ToastType,
  { color: string; icon: React.ReactNode }
> = {
  success: {
    color: "#10B981",
    icon: <CheckCircle size={18} />,
  },
  error: {
    color: "#EF4444",
    icon: <XCircle size={18} />,
  },
  warning: {
    color: "#F59E0B",
    icon: <AlertTriangle size={18} />,
  },
  info: {
    color: "#3B82F6",
    icon: <Info size={18} />,
  },
};

function ToastNotification({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const config = TOAST_CONFIG[item.type];

  React.useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), 4000);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      role="alert"
      aria-live="polite"
      className="pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 shadow-2xl backdrop-blur-sm"
      style={{
        background: "#1A1A22",
        borderLeft: `4px solid ${config.color}`,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderLeftColor: config.color,
        borderLeftWidth: 4,
        minWidth: 300,
        maxWidth: 420,
      }}
    >
      <span style={{ color: config.color }} className="shrink-0">
        {config.icon}
      </span>
      <p className="flex-1 text-sm leading-snug" style={{ color: "#E8E8ED" }}>
        {item.message}
      </p>
      <button
        onClick={() => onDismiss(item.id)}
        className="shrink-0 rounded p-1 transition-colors hover:bg-white/5"
        style={{ color: "#66667A" }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <ToastNotification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
