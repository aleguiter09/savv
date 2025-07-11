"use client";
import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { enUS, es } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { DateRangePicker as Drp } from "@/components/ui/date-picker";

export function SelectDate({ from, to }: Readonly<{ from: Date; to: Date }>) {
  const t = useTranslations("movements");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (value: DateRangePickerValue) => {
    const params = new URLSearchParams(searchParams);
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
    <>
      {/*
        <Drp
          value={{ from, to }}
          onChange={(val) => handleSelect({ from: val?.from, to: val?.to })}
          locale={locale.includes("es") ? es : enUS}
        />
      */}
      <DateRangePicker
        className="max-w-none"
        onValueChange={handleSelect}
        selectPlaceholder={t("selectDateRange")}
        enableClear={false}
        locale={locale.includes("es") ? es : enUS}
        defaultValue={{
          from,
          to,
        }}
      >
        <DateRangePickerItem
          key="today"
          value="today"
          from={new Date()}
          to={new Date()}
        >
          {t("today")}
        </DateRangePickerItem>
        <DateRangePickerItem
          key="week"
          value="week"
          from={new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)}
          to={new Date()}
        >
          {t("last7Days")}
        </DateRangePickerItem>
        <DateRangePickerItem
          key="month"
          value="month"
          from={new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)}
          to={new Date()}
        >
          {t("last30Days")}
        </DateRangePickerItem>
        <DateRangePickerItem
          key="this-month"
          value="this-month"
          from={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
        >
          {t("thisMonth")}
        </DateRangePickerItem>
      </DateRangePicker>
    </>
  );
}
