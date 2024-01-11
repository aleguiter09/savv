import { List } from "@tremor/react";
import { processMovements } from "@/utils/common";
import { getLastMovements } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import FinanceItem from "./FinanceItem";

export default async function LastMovementsList() {
  const supabase = createClient();

  const data = await getLastMovements(supabase);
  const { movements } = processMovements(data);

  return (
    <List>
      {movements.map((item) => (
        <FinanceItem
          key={item.date}
          items={item.movements}
          date={item.date}
          amount={item.total}
        />
      ))}
    </List>
  );
}
