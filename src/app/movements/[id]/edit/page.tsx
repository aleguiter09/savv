import LastMovementDetail from "@/components/home/LastMovements/LastMovementDetail";
import { getMovementById } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import { notFound } from "next/navigation";

export default async function EditMovementPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const supabase = createClient();
  const movement = await getMovementById(supabase, Number(id));

  if (!movement) {
    notFound();
  }

  return <LastMovementDetail {...movement} />;
}
