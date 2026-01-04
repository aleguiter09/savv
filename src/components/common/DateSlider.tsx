"use client";
import type { YearMonth } from "@/types/general";
import { MONTHS } from "@/utils/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card } from "../ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
        <ArrowLeft />
      </button>
      <h5 className="mt-1 text-lg font-semibold">
        {MONTHS[month]} {year}
      </h5>
      <button onClick={handleRight}>
        <ArrowRight />
      </button>
    </Card>
  );
}
