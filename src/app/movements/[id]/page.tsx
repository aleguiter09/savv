import Icon from "@/components/common/Icon";
import { Icon as MDIIcon } from "@mdi/react";
import MovementDetail from "@/components/movements/MovementDetail/MovementDetail";
import { getMovementById } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import { mdiTrashCanOutline } from "@mdi/js";
import { notFound } from "next/navigation";
import Link from "next/link";
import ConfirmDialog from "@/components/movements/ConfirmDialog/ConfirmDialog";

export default async function MovementDetailPage({
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

  const alertDialog = () => {
    return (
      <ConfirmDialog
        movement={movement}
        isOpen={confirm}
        button={<MDIIcon path={mdiTrashCanOutline} size="24px" />}
      >
        <h3 className="text-lg font-semibold text-tremor-content-strong">
          Are you sure? 🤔
        </h3>
        <p className="mt-2 leading-5 text-tremor-default text-tremor-content">
          You are about to delete the following movement:{" "}
          {`${movement.comment}`}. <br />
          <br />
          This action will restore your account balance and cannot be undone.
        </p>
      </ConfirmDialog>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/">
          <Icon color="stone" icon={"arrow-left"} />
        </Link>
        <h4 className="font-medium">Details</h4>
        {alertDialog()}
      </div>
      <MovementDetail {...movement} />
    </>
  );
}
