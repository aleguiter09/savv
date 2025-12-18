import { getDefaultAccountId } from "@/services/accounts";
import { AccountIds } from "@/types/general";
import { ActionBar } from "@/components/home/ActionBar/ActionBar";
import { Balance } from "@/components/home/Balance/Balance";
import { LastMovements } from "@/components/home/LastMovements/LastMovements";
import { ExpenseByCat } from "@/components/home/ExpenseByCat/ExpenseByCat";
import { TotalWealth } from "@/components/home/TotalWealth/TotalWealth";
import { ToastManager } from "@/components/ui/ToastManager";
import { UpcomingPayments } from "@/components/home/UpcomingPayments/UpcomingPayments";

type MainPageParams = {
  searchParams: {
    account: string;
  };
};

export default async function MainPage({
  searchParams,
}: Readonly<MainPageParams>) {
  const defaultAcc = await getDefaultAccountId();
  const accountId =
    searchParams.account ?? (defaultAcc === 0 ? "all" : defaultAcc);

  return (
    <>
      <ActionBar accountId={accountId as AccountIds} />
      <Balance accountId={accountId as AccountIds} />
      <LastMovements accountId={accountId as AccountIds} />
      <ExpenseByCat
        accountId={accountId as AccountIds}
        year={new Date().getFullYear()}
        month={new Date().getMonth()}
      />
      <TotalWealth />
      <UpcomingPayments accountId={accountId as AccountIds} />

      <ToastManager />
    </>
  );
}
