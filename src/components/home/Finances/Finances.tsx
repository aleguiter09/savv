import { Card, List } from "@tremor/react";
import { processMovements } from "@/utils/common";
import { getLastMovements } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import FinanceItem from "./FinanceItem";
import Link from "next/link";

export default async function Finances() {
  const supabase = createClient();

  const data = await getLastMovements(supabase);
  const { movements } = processMovements(data);

  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <p className="font-medium ml-2 mb-1">
        <i>Last movements</i>
      </p>
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
      <Link href="/movements">
        <p className="text-blue-500 font-semibold text-center pb-1 pt-3">
          See all
        </p>
      </Link>
    </Card>
  );
}
