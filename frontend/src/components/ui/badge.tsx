import { cn } from "../../utils/cn";

type BadgeProps = {
  variant?: "success" | "warning" | "danger" | "info";
  className?: string;
  children: React.ReactNode;
};

const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-blue-100 text-blue-700"
};

export function Badge({ variant = "info", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
