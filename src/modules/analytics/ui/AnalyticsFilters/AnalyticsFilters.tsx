"use client";

import { format } from "date-fns";
import { getDateFnsLocale } from "@/modules/shared/utils/dateFnsLocale";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/ui/button";
import { DateRangePicker } from "@/ui/date-picker";
import { AccountFilterSelect } from "@/modules/shared/ui/common/AccountFilterSelect";
import type { AnalyticsFiltersParams } from "../../types/analytics-filters.types";

type Props = Readonly<AnalyticsFiltersParams>;

function getDefaultFrom() {
  return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

function getDefaultTo() {
  return new Date();
}

export function AnalyticsFilters({ from, to, accountId }: Props) {
  const locale = useLocale();
  const t = useTranslations("movements");
  const pathname = usePathname();
  const { replace } = useRouter();

  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [draftAccountId, setDraftAccountId] = useState(accountId);

  useEffect(() => {
    setDraftFrom(from);
    setDraftTo(to);
    setDraftAccountId(accountId);
  }, [from, to, accountId]);

  const isDirty = useMemo(() => {
    const appliedFrom = format(from, "yyyy-MM-dd");
    const appliedTo = format(to, "yyyy-MM-dd");
    const draftFromStr = format(draftFrom, "yyyy-MM-dd");
    const draftToStr = format(draftTo, "yyyy-MM-dd");

    return (
      appliedFrom !== draftFromStr ||
      appliedTo !== draftToStr ||
      accountId !== draftAccountId
    );
  }, [from, to, accountId, draftFrom, draftTo, draftAccountId]);

  const handleApply = () => {
    const params = new URLSearchParams();
    params.set("from", format(draftFrom, "yyyy-MM-dd"));
    params.set("to", format(draftTo, "yyyy-MM-dd"));
    params.set("account", draftAccountId);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setDraftFrom(getDefaultFrom());
    setDraftTo(getDefaultTo());
    setDraftAccountId("all");
  };

  return (
    <div className="mb-4 flex flex-col gap-2">
      <DateRangePicker
        value={{ from: draftFrom, to: draftTo }}
        onChange={(val) => {
          if (val?.from) setDraftFrom(val.from);
          if (val?.to) setDraftTo(val.to);
        }}
        locale={getDateFnsLocale(locale)}
      />
      <AccountFilterSelect
        value={draftAccountId}
        onValueChange={setDraftAccountId}
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="default"
          disabled={!isDirty}
          onClick={handleApply}
        >
          {t("applyFilters")}
        </Button>
        <Button type="button" variant="outline" onClick={handleClear}>
          {t("clearFilters")}
        </Button>
      </div>
    </div>
  );
}
