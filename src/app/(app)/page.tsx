import { getDefaultAccountId } from "@/modules/accounts/services/accounts";
import { ActionBar } from "@/modules/dashboard/ui/ActionBar/ActionBar";
import { Balance } from "@/modules/dashboard/ui/Balance/Balance";
import { ExpenseByCat } from "@/modules/dashboard/ui/ExpenseByCat/ExpenseByCat";
import { LastMovements } from "@/modules/dashboard/ui/LastMovements/LastMovements";
import { TotalWealth } from "@/modules/dashboard/ui/TotalWealth/TotalWealth";
import { UpcomingPayments } from "@/modules/dashboard/ui/UpcomingPayments/UpcomingPayments";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";

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
      <ActionBar accountId={accountId} />
      <Balance accountId={accountId} />
      <LastMovements accountId={accountId} />
      <ExpenseByCat
        accountId={accountId}
        year={new Date().getFullYear()}
        month={new Date().getMonth()}
      />
      <TotalWealth />
      <UpcomingPayments accountId={accountId} />

      <ToastManager />
    </>
  );
}
