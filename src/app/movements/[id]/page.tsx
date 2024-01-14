import MovementDetail from "@/components/movements/MovementDetail/MovementDetail";
import { getMovementById } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import { notFound } from "next/navigation";

export default async function MovementDetailPage({
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

  return (
    <>
      <h2 className="font-medium mb-4">Details</h2>
      <MovementDetail {...movement} />
    </>
  );
}
