import {
  MovementsPage,
  type MovementsPageProps,
} from "@/modules/movements/pages/MovementsPage";

export default async function Page({ searchParams }: MovementsPageProps) {
  return <MovementsPage searchParams={searchParams} />;
}
