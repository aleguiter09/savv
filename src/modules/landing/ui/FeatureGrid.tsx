import { cn } from "@/modules/shared/utils/cn";
import type { ReactNode } from "react";

type FeatureItem = {
  icon: ReactNode;
  title: string;
  description: string;
};

type Props = Readonly<{
  items: FeatureItem[];
  className?: string;
}>;

export function FeatureGrid({ items, className }: Props) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <li key={item.title} className="flex gap-3">
          <div className="mt-0.5 shrink-0">{item.icon}</div>
          <div>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
