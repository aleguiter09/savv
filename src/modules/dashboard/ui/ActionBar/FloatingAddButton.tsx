"use client";

import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import { forwardRef } from "react";

const iconClasses =
  "rounded-full bg-blue-600 p-2.5 text-white shadow-md hover:bg-blue-700";
const wrapperClasses =
  "cursor-pointer rounded-full focus:outline-1 focus:outline-blue-600 focus:outline-offset-2 transition-all";

export const FloatingAddButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function FloatingAddButton({ className, type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(wrapperClasses, className)}
      {...props}
    >
      <PlusIcon size={36} className={iconClasses} />
    </button>
  );
});
