import { CATEGORY_ICONS } from "@/utils/constants";
import { BadgeDelta, ListItem } from "@tremor/react";
import Icon from "@mdi/react";
import { FinanceItemProps } from "@/types/components";

export default function FinanceItem({
  date,
  items = [],
  amount,
}: Readonly<FinanceItemProps>) {
  return (
    <div className="rounded px-2 pb-1 pt-2">
      <div className="flex justify-between">
        <h2 className="text-xs">{date}</h2>
        <BadgeDelta
          deltaType={amount > 0 ? "increase" : "decrease"}
          size="xs"
        ></BadgeDelta>
      </div>
      {items.map((item) => (
        <ListItem key={item.id} className="text-black">
          <div className="flex items-center gap-2">
            <span className="flex flex-col text-center">
              <Icon
                className={`bg-${item.fullCategory.color} mx-auto rounded-full p-1.5`}
                path={CATEGORY_ICONS[item.fullCategory.icon]}
                size={"25px"}
                color="white"
              />
            </span>
            <span>{item.comment}</span>
          </div>
          <span>
            {`${item.type === "expense" ? "-" : ""}
              $${item.amount}`}
          </span>
        </ListItem>
      ))}
    </div>
  );
}
