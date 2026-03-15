"use client";

import * as React from "react";
import { Calendar1 } from "lucide-react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  subDays,
} from "date-fns";

import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/modules/shared/utils/cn";
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
  const t = useTranslations("common");

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id="date"
            className={cn(
              "justify-start font-normal flex gap-3 px-2 bg-white hover:bg-gray-50 w-full",
              error && "border-red-500",
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
  const t = useTranslations("common");

  const presets = [
    {
      label: t("thisWeek"),
      getValue: () => {
        const today = new Date();
        return {
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfDay(today),
        };
      },
    },
    {
      label: t("currentMonth"),
      getValue: () => {
        const today = new Date();
        return { from: startOfMonth(today), to: endOfDay(today) };
      },
    },
    {
      label: t("last30Days"),
      getValue: () => {
        const today = new Date();
        return { from: startOfDay(subDays(today, 29)), to: endOfDay(today) };
      },
    },
  ];

  const handlePresetClick = (preset: (typeof presets)[0]) => {
    const dateRange = preset.getValue();
    onChange(dateRange);
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              id="date"
              className={cn(
                "justify-start font-normal flex gap-3 px-2 bg-white hover:bg-gray-50 flex-1",
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

        <Select
          onValueChange={(value) => {
            const preset = presets.find((p) => p.label === value);
            if (preset) {
              handlePresetClick(preset);
            }
          }}
        >
          <SelectTrigger className="w-45 bg-white hover:bg-gray-50">
            <SelectValue placeholder={t("quickSelect")} />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.label} value={preset.label}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
