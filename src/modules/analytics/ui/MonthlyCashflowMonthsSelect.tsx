"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { CASHFLOW_MONTHS_OPTIONS } from "../adapters/analytics.adapter";
import type { CashflowMonthsOption } from "../types/analytics-filters.types";

type Props = Readonly<{
  months: CashflowMonthsOption;
}>;

export function MonthlyCashflowMonthsSelect({ months }: Props) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("months", value);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={String(months)} onValueChange={handleChange}>
      <SelectTrigger
        className="h-8 w-[7.5rem] bg-white text-xs"
        aria-label={t("monthsSelectLabel")}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CASHFLOW_MONTHS_OPTIONS.map((option) => (
          <SelectItem key={option} value={String(option)} className="text-xs">
            {t("monthsOption", { count: option })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
