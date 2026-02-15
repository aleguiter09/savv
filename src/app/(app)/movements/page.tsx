import { MovementsPage } from "@/modules/movements/pages/MovementsPage";

export type Props = Readonly<{
  searchParams: {
    from?: string;
    to?: string;
    account?: string;
    category?: string;
  };
}>;

export default async function Page({ searchParams }: Props) {
  return <MovementsPage {...searchParams} />;
}
