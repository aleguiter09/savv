import DateSlider from "@/components/movements/MovementsList/DateSlider";
import MovementsByDate from "@/components/movements/MovementsList/MovementsByDate";
import { MovementsPageParams } from "@/types/pages";
import React from "react";

export default function MovementsPage({
  searchParams,
}: Readonly<MovementsPageParams>) {
  const year: number = searchParams?.year
    ? parseInt(searchParams.year)
    : new Date().getFullYear();
  const month: number = searchParams?.month
    ? parseInt(searchParams.month)
    : new Date().getMonth();
  const page: number = searchParams?.page ? parseInt(searchParams.page) : 0;

  return (
    <>
      <DateSlider year={year} month={month} />
      <MovementsByDate year={year} month={month} page={page} />
    </>
  );
}
