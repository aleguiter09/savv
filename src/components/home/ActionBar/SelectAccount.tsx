import SelectAccountClient from "./SelectAccountClient";
import { getAccounts } from "@/services/accounts";
import { createClient } from "@/utils/supabase-server";

export default async function SelectAccount() {
  const supabase = createClient();
  const accounts = await getAccounts(supabase);

  return <SelectAccountClient accounts={accounts} />;
}
