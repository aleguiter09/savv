import { getLastMovements } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import LastMovementDetail from "./LastMovementDetail";

export default async function LastMovementsList({
  account,
}: Readonly<{ account: number }>) {
  const supabase = createClient();
  const movements = await getLastMovements(supabase, account);

  return (
    <div className="flex flex-col gap-2 mt-3">
      {movements.map((item, i) => (
        <LastMovementDetail
          key={item.id}
          border={i !== movements.length - 1}
          {...item}
        />
      ))}
    </div>
  );
}
