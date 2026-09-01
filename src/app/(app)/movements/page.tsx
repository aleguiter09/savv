import { MovementsPage } from "@/modules/movements/pages/MovementsPage";

export type Props = Readonly<{
  searchParams: Promise<{
    from?: string;
    to?: string;
    account?: string;
    category?: string;
    page?: string;
  }>;
}>;

export default async function Page({ searchParams }: Props) {
  const { from, to, account, category, page } = await searchParams;

  return (
    <MovementsPage
      from={from}
      to={to}
      account={account}
      category={category}
      page={page}
    />
  );
}
