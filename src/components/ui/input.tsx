import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="mt-2 mb-2 block text-sm font-medium">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
