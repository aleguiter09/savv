import { MovementsPage } from "@/modules/movements/pages/MovementsPage";
import type { MovementsScope } from "@/modules/movements/types/types";

export type Props = Readonly<{
  searchParams: Promise<{
    from?: string;
    to?: string;
    account?: string;
    category?: string;
    page?: string;
    scope?: MovementsScope;
  }>;
}>;

export default async function Page({ searchParams }: Props) {
  const { from, to, account, category, page, scope } = await searchParams;

  return (
    <MovementsPage
      from={from}
      to={to}
      account={account}
      category={category}
      page={page}
      scope={scope}
    />
  );
}
