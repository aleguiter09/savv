"use client";
import { enUS, es } from "date-fns/locale";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRangePicker } from "@/components/ui/date-picker";

export function SelectDate({ from, to }: Readonly<{ from: Date; to: Date }>) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleSelect = (value: { from?: Date; to?: Date }) => {
    if (value.from) {
      params.set(
        "from",
        `${value.from.getFullYear()}-${value.from.getMonth() + 1}-${value.from.getDate()}`
      );
    }
    if (value.to) {
      params.set(
        "to",
        `${value.to.getFullYear()}-${value.to.getMonth() + 1}-${value.to.getDate()}`
      );
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <DateRangePicker
      value={{ from, to }}
      onChange={(val) => handleSelect({ from: val?.from, to: val?.to })}
      locale={locale.includes("es") ? es : enUS}
    />
  );
}
