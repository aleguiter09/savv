import DateSlider from "@/components/home/Finances/DateSlider";
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

  return <DateSlider year={year} month={month} />;
}
