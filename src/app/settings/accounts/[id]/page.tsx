import EditAccountForm from "@/components/accounts/EditAccountForm";
import { getAccountById } from "@/services/accounts";
import { createClient } from "@/utils/supabase-server";
import { notFound } from "next/navigation";

export default async function EditAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const supabase = createClient();
  const account = await getAccountById(supabase, Number(id));

  if (!account) {
    notFound();
  }

  return (
    <main className="mx-5 sm:w-[32rem] sm:self-center">
      <EditAccountForm id={id} account={account} />
    </main>
  );
}
