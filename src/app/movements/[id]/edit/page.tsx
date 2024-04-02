import LastMovementDetail from "@/components/home/LastMovements/LastMovementDetail";
// import ConfirmDialog from "@/components/movements/ConfirmDialog/ConfirmDialog";
import { getMovementById } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import { notFound } from "next/navigation";

export default async function EditMovementPage({
  params,
  // searchParams,
}: Readonly<{
  params: { id: string };
  // searchParams: { confirm: string };
}>) {
  const id = params.id;
  // const confirm = Boolean(searchParams?.confirm === "true");
  const supabase = await createClient();
  const movement = await getMovementById(supabase, Number(id));

  if (!movement) {
    notFound();
  }

  return <LastMovementDetail {...movement} />;
}
