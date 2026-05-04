import * as React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm transition focus-visible:border-primary",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
