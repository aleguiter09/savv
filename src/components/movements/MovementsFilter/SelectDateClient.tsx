"use client";
import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SelectDateClient({
  from,
  to,
}: Readonly<{ from: Date; to: Date }>) {
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
    <DateRangePicker
      className="max-w-none"
      onValueChange={handleSelect}
      enableClear={false}
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
        Today
      </DateRangePickerItem>
      <DateRangePickerItem
        key="week"
        value="week"
        from={new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)}
        to={new Date()}
      >
        Last 7 days
      </DateRangePickerItem>
      <DateRangePickerItem
        key="month"
        value="month"
        from={new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)}
        to={new Date()}
      >
        Last 30 days
      </DateRangePickerItem>
      <DateRangePickerItem
        key="this-month"
        value="this-month"
        from={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
      >
        This month
      </DateRangePickerItem>
    </DateRangePicker>
  );
}
