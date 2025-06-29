"use client";

import * as React from "react";
import { Calendar1 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange, Locale } from "react-day-picker";
import { useTranslations } from "next-intl";

type DatePickerProps = Readonly<{
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  locale: Locale;
  className?: string;
  error?: string;
}>;

export function DatePicker({
  value,
  onChange,
  locale,
  className,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations();

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn(
              "justify-start font-normal flex gap-3 px-2 bg-white hover:bg-gray-50",
              error && "border-red-500"
            )}
          >
            <Calendar1 className="text-gray-600" />
            {value ? value.toLocaleDateString() : t("chooseDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            locale={locale}
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

type DateRangePickerProps = Readonly<{
  value?: DateRange;
  onChange: (date: DateRange | undefined) => void;
  locale: Locale;
  className?: string;
}>;

export function DateRangePicker({
  value,
  onChange,
  locale,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations();

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn(
              "justify-start font-normal flex gap-3 px-2 bg-white hover:bg-gray-50"
            )}
          >
            <Calendar1 className="text-gray-600" />
            {value?.from && value?.to
              ? value.from.toLocaleDateString() +
                " - " +
                value.to.toLocaleDateString()
              : t("chooseDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            locale={locale}
            selected={value}
            onSelect={(date) => {
              if (date?.from && date?.to) {
                onChange(date);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
