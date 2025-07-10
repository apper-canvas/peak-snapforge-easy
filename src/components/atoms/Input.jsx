import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-surface-100",
        "placeholder:text-surface-400",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-900",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-150 ease-out",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;