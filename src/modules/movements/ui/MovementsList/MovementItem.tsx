import { Badge } from "@/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/modules/shared/utils/cn";
import {
  MovementItemDetail,
  type MovementItemDetailProps,
} from "./MovementItemDetail";

export type MovementItemProps = {
  date: string;
  amount: number;
  items: MovementItemDetailProps[];
};

export function MovementItem({ date, items = [], amount }: MovementItemProps) {
  return (
    <div className="px-2 pb-1 pt-2 flex flex-col gap-2 text-gray-900 border-b border-gray-2 last:border-0">
      <div className="flex justify-between">
        <h2 className="text-xs">{date}</h2>
        <Badge
          className={cn(
            amount > 0
              ? "bg-green-500/10 px-2 py-0.5 text-xs text-green-600 hover:bg-green-500/10 ring-1 ring-green-500/50"
              : "bg-red-500/10 px-2 py-0.5 text-xs text-red-600 hover:bg-red-500/10 ring-1 ring-red-500/50",
          )}
        >
          {amount > 0 ? <ArrowUp size="12px" /> : <ArrowDown size="12px" />}
        </Badge>
      </div>
      {items.map((item) => (
        <MovementItemDetail key={item.id} {...item} />
      ))}
    </div>
  );
}
