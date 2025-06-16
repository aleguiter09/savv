import { BadgeDelta } from "@tremor/react";
import { Movement } from "@/types/database";
import { LastMovementDetail } from "@/components/home/LastMovements/LastMovementDetail";

type FinanceItemProps = {
  date: string;
  items: Movement[];
  amount: number;
};

export default function MovementItem({
  date,
  items = [],
  amount,
}: Readonly<FinanceItemProps>) {
  return (
    <div className="px-2 pb-1 pt-2 flex flex-col gap-2 text-gray-900">
      <div className="flex justify-between">
        <h2 className="text-xs">{date}</h2>
        <BadgeDelta
          deltaType={amount > 0 ? "increase" : "decrease"}
          size="xs"
        />
      </div>
      {items.map((item) => (
        <LastMovementDetail key={item.id} {...item} />
      ))}
    </div>
  );
}
