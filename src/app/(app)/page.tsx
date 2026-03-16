import { HomePage } from "@/modules/dashboard/pages/HomePage";

type MainPageParams = {
  searchParams: Promise<{
    account: string;
  }>;
};

export default async function MainPage({
  searchParams,
}: Readonly<MainPageParams>) {
  const { account } = await searchParams;
  return <HomePage account={account} />;
}
