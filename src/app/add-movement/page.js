import MovementsModal from "@/components/MovementsModal/MovementsModal";

export default function Page({ searchParams }) {
  const year = searchParams?.year
    ? parseInt(searchParams.year)
    : new Date().getFullYear();
  const month = searchParams?.month
    ? parseInt(searchParams.month)
    : new Date().getMonth();

  return <MovementsModal currentPage={{ year, month }} />;
}
