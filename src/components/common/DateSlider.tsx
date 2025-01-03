"use client";
import { Card } from "@tremor/react";
import { MONTHS } from "@/utils/constants";
import { YearMonth } from "@/types/general";
import Icon from "./Icon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DateSlider({ year, month }: Readonly<YearMonth>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleLeft = () => {
    const params = new URLSearchParams(searchParams);
    const _year = month === 0 ? year - 1 : year;
    const _month = month === 0 ? 11 : month - 1;
    params.set("year", _year.toString());
    params.set("month", _month.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const handleRight = () => {
    const params = new URLSearchParams(searchParams);
    const _year = month === 11 ? year + 1 : year;
    const _month = month === 11 ? 0 : month + 1;
    params.set("year", _year.toString());
    params.set("month", _month.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Card className="mb-4 flex justify-between px-3 py-2">
      <button onClick={handleLeft}>
        <Icon icon="arrow-left" />
      </button>
      <h5 className="mt-1 text-lg font-semibold">
        {MONTHS[month]} {year}
      </h5>
      <button onClick={handleRight}>
        <Icon icon="arrow-right" />
      </button>
    </Card>
  );
}
