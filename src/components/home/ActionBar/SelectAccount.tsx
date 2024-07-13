import SelectAccountClient from "./SelectAccountClient";
import { getAccounts } from "@/services/accounts";
import { createClient } from "@/utils/supabase-server";

export default async function SelectAccount({
  defaultAcc,
  containerClassName,
}: Readonly<{ defaultAcc: number; containerClassName?: string }>) {
  const supabase = await createClient();
  const accounts = await getAccounts(supabase);

  return (
    <SelectAccountClient
      accounts={accounts}
      defaultAcc={defaultAcc}
      containerClassName={containerClassName}
    />
  );
}
