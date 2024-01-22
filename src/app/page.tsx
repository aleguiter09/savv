import LastMovements from "@/components/home/LastMovements/LastMovements";
import Balance from "@/components/home/Balance/Balance";
import ActionBar from "@/components/home/ActionBar/ActionBar";
import { MainPageParams } from "@/types/pages";
// import ExpenseByCat from "@/components/home/ExpenseByCat/ExpenseByCat";

export default async function MainPage({
  searchParams,
}: Readonly<MainPageParams>) {
  const account = Number(searchParams.account) || 0;

  return (
    <>
      <ActionBar />
      <Balance account={account} />
      <LastMovements account={account} />
      {/* <ExpenseByCat account={account} / >*/}
    </>
  );
}
