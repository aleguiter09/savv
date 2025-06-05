import LastMovements from "@/components/home/LastMovements/LastMovements";
import Balance from "@/components/home/Balance/Balance";
import ActionBar from "@/components/home/ActionBar/ActionBar";
import ExpenseByCat from "@/components/home/ExpenseByCat/ExpenseByCat";
import TotalWealth from "@/components/home/TotalWealth/TotalWealth";
import { getDefaultAccountId } from "@/services/accounts";

export type MainPageParams = {
  searchParams: {
    account: string;
  };
};

export default async function MainPage({
  searchParams,
}: Readonly<MainPageParams>) {
  const defaultAcc = await getDefaultAccountId();
  const account: number =
    Number(searchParams.account) === 0
      ? 0
      : Number(searchParams.account) || defaultAcc;

  return (
    <>
      <ActionBar account={account} />
      <Balance account={account} />
      <LastMovements account={account} />
      <ExpenseByCat
        account={account}
        year={new Date().getFullYear()}
        month={new Date().getMonth()}
      />
      <TotalWealth />
    </>
  );
}
