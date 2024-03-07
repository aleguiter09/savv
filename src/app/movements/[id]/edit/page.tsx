import LastMovementDetail from "@/components/home/LastMovements/LastMovementDetail";
import ConfirmDialog from "@/components/movements/ConfirmDialog/ConfirmDialog";
import { getMovementById } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import { notFound } from "next/navigation";

export default async function EditMovementPage({
  params,
  searchParams,
}: Readonly<{
  params: { id: string };
  searchParams: { confirm: string };
}>) {
  const id = params.id;
  const confirm = Boolean(searchParams?.confirm === "true");
  const supabase = await createClient();
  const movement = await getMovementById(supabase, Number(id));

  if (!movement) {
    notFound();
  }

  return (
    <>
      <LastMovementDetail {...movement} />
      <ConfirmDialog isOpen={confirm}>
        <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Are you sure? 🤔
        </h3>
        <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          You are about to delete the following movement:{" "}
          {`${movement.comment}`}. <br />
          This action cannot be undone.
        </p>
      </ConfirmDialog>
    </>
  );
}
