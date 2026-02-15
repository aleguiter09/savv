"use client";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRangePicker } from "@/ui/date-picker";

export function SelectDate({ from, to }: { from: Date; to: Date }) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (value: { from?: Date; to?: Date }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.from) {
      params.set("from", format(value.from, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }

    if (value.to) {
      params.set("to", format(value.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <DateRangePicker
      value={{ from, to }}
      onChange={(val) => handleSelect({ from: val?.from, to: val?.to })}
      locale={locale.includes("es") ? es : enUS}
    />
  );
}
