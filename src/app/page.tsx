import LastMovements from "@/components/home/LastMovements/LastMovements";
import Balance from "@/components/home/Balance/Balance";
import ActionBar from "@/components/home/ActionBar/ActionBar";
import ExpenseByCat from "@/components/home/ExpenseByCat/ExpenseByCat";
import { getAccounts, getDefaultAccountId } from "@/services/accounts";
import { createClient } from "@/utils/supabase-server";
import TotalWealth from "@/components/home/TotalWealth/TotalWealth";

export type MainPageParams = {
  searchParams: {
    account: string;
  };
};

export default async function MainPage({
  searchParams,
}: Readonly<MainPageParams>) {
  const supabase = await createClient();
  const accounts = await getAccounts(supabase);
  const defaultAcc = await getDefaultAccountId(supabase);
  const account =
    Number(searchParams.account) === 0
      ? 0
      : Number(searchParams.account) || defaultAcc;

  return (
    <>
      <ActionBar accounts={accounts} defaultAcc={defaultAcc} />
      <Balance account={account} />
      <LastMovements account={account} />
      <ExpenseByCat
        account={account}
        year={new Date().getFullYear()}
        month={new Date().getMonth()}
      />
      <TotalWealth accounts={accounts} />
    </>
  );
}
