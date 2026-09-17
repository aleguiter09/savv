"use client";

import { cn } from "@/modules/shared/utils/cn";
import { PlusIcon } from "lucide-react";
import { forwardRef } from "react";

const iconClasses =
  "rounded-full bg-primary p-2.5 text-primary-foreground shadow-sm hover:bg-primary-hover";
const wrapperClasses =
  "cursor-pointer rounded-full focus:outline-1 focus:outline-ring focus:outline-offset-2 transition-all";

export const FloatingAddButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function FloatingAddButton({ className, type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(wrapperClasses, className)}
      {...props}
    >
      <PlusIcon size={36} className={iconClasses} />
    </button>
  );
});
