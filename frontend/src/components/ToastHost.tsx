import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useToastStore } from "../store/useToastStore";
import { cn } from "../utils/cn";

const variantStyles = {
  success: "bg-emerald-600 text-white",
  error: "bg-rose-600 text-white",
  info: "bg-slate-900 text-white"
} as const;

export default function ToastHost() {
  const { toasts, removeToast } = useToastStore();
  const timersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!timersRef.current[toast.id]) {
        timersRef.current[toast.id] = window.setTimeout(() => {
          removeToast(toast.id);
          delete timersRef.current[toast.id];
        }, 3000);
      }
    });
  }, [removeToast, toasts]);

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-full max-w-xs flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "pointer-events-auto rounded-xl px-4 py-3 text-sm font-semibold shadow-glow",
              variantStyles[toast.variant]
            )}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
