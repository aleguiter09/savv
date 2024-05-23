import EditAccountForm from "@/components/accounts/EditAccountForm";
import Icon from "@/components/common/Icon";
import { getAccountById } from "@/services/accounts";
import { createClient } from "@/utils/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditAccountPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const id = params.id;
  const supabase = await createClient();
  const account = await getAccountById(supabase, Number(id));

  if (!account) {
    notFound();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/accounts">
          <Icon color="stone" icon={"arrow-left"} />
        </Link>
        <h4 className="font-medium">Account Details</h4>
        <span></span>
      </div>
      <EditAccountForm id={id} account={account} />
    </>
  );
}
