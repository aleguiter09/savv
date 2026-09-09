import { AnalyticsPage } from "@/modules/analytics/pages/AnalyticsPage";

export type Props = Readonly<{
  searchParams: Promise<{
    from?: string;
    to?: string;
    account?: string;
    months?: string;
  }>;
}>;

export default async function AnayliticsPage({ searchParams }: Props) {
  const { from, to, account, months } = await searchParams;

  return (
    <AnalyticsPage from={from} to={to} account={account} months={months} />
  );
}
