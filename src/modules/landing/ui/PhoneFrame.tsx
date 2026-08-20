import type { ReactNode } from "react";
import { cn } from "@/modules/shared/utils/cn";

type Props = Readonly<{
  children: ReactNode;
  className?: string;
  label?: string;
}>;

export function PhoneFrame({ children, className, label }: Props) {
  return (
    <div className={cn("mx-auto w-full max-w-[300px]", className)}>
      {label ? (
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      ) : null}
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-gray-100 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] motion-safe:animate-[landing-rise_700ms_ease-out]"
      >
        <div className="flex items-center justify-center bg-gray-100 px-4 pb-2 pt-3">
          <div className="h-1.5 w-16 rounded-full bg-gray-300" />
        </div>
        <div className="max-h-[420px] space-y-3 overflow-hidden bg-gray-100 px-3 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}
