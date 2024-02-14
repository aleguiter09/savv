import EditAccountForm from "@/components/accounts/EditAccountForm";
import { getAccountById } from "@/services/accounts";
import { createClient } from "@/utils/supabase-server";
import { notFound } from "next/navigation";

export default async function EditAccountPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const id = params.id;
  const supabase = createClient();
  const account = await getAccountById(supabase, Number(id));

  if (!account) {
    notFound();
  }

  return <EditAccountForm id={id} account={account} />;
}
