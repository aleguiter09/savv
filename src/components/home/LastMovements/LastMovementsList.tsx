import { getLastMovements } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import LastMovementDetail from "./LastMovementDetail";

export default async function LastMovementsList({
  account,
}: Readonly<{ account: number }>) {
  const supabase = await createClient();
  const movements = await getLastMovements(supabase, account);

  return (
    <div className="flex flex-col gap-2 mt-3">
      {movements.map((item) => (
        <LastMovementDetail key={item.id} {...item} />
      ))}
      {movements.length === 0 && (
        <p className="pt-2 text-sm text-slate-500 text-center col-span-3">
          No transactions uploaded so far
        </p>
      )}
    </div>
  );
}
