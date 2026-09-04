"use client";

import { format } from "date-fns";
import Link from "next/link";
import { getDateFnsLocale } from "@/modules/shared/utils/dateFnsLocale";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/ui/button";
import { DateRangePicker } from "@/ui/date-picker";
import { AccountFilterSelect } from "@/modules/shared/ui/common/AccountFilterSelect";
import { CategoryFilterSelect } from "@/modules/shared/ui/common/CategoryFilterSelect";
import { cn } from "@/modules/shared/utils/cn";
import type { MovementsScope } from "../../types/types";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
  scope: MovementsScope;
}>;

function getDefaultFrom() {
  return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

function getDefaultTo() {
  return new Date();
}

function buildScopeHref(
  scope: MovementsScope,
  accountId: string,
  categoryId: string,
  from: Date,
  to: Date,
) {
  const params = new URLSearchParams();
  params.set("account", accountId);
  params.set("category", categoryId);

  if (scope === "upcoming") {
    params.set("scope", "upcoming");
  } else {
    params.set("from", format(from, "yyyy-MM-dd"));
    params.set("to", format(to, "yyyy-MM-dd"));
  }

  return `/movements?${params.toString()}`;
}

export function MovementsFilters({
  from,
  to,
  accountId,
  categoryId,
  scope,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("movements");
  const pathname = usePathname();
  const { replace } = useRouter();
  const isUpcoming = scope === "upcoming";

  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [draftAccountId, setDraftAccountId] = useState(accountId);
  const [draftCategoryId, setDraftCategoryId] = useState(categoryId);

  useEffect(() => {
    setDraftFrom(from);
    setDraftTo(to);
    setDraftAccountId(accountId);
    setDraftCategoryId(categoryId);
  }, [from, to, accountId, categoryId]);

  const isDirty = useMemo(() => {
    const accountChanged = accountId !== draftAccountId;
    const categoryChanged = categoryId !== draftCategoryId;

    if (isUpcoming) {
      return accountChanged || categoryChanged;
    }

    const appliedFrom = format(from, "yyyy-MM-dd");
    const appliedTo = format(to, "yyyy-MM-dd");
    const draftFromStr = format(draftFrom, "yyyy-MM-dd");
    const draftToStr = format(draftTo, "yyyy-MM-dd");

    return (
      appliedFrom !== draftFromStr ||
      appliedTo !== draftToStr ||
      accountChanged ||
      categoryChanged
    );
  }, [
    from,
    to,
    accountId,
    categoryId,
    draftFrom,
    draftTo,
    draftAccountId,
    draftCategoryId,
    isUpcoming,
  ]);

  const handleApply = () => {
    const params = new URLSearchParams();
    params.set("account", draftAccountId);
    params.set("category", draftCategoryId);

    if (isUpcoming) {
      params.set("scope", "upcoming");
    } else {
      params.set("from", format(draftFrom, "yyyy-MM-dd"));
      params.set("to", format(draftTo, "yyyy-MM-dd"));
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setDraftFrom(getDefaultFrom());
    setDraftTo(getDefaultTo());
    setDraftAccountId("all");
    setDraftCategoryId("all");
  };

  return (
    <div className="mb-4 flex flex-col gap-2">
      <div className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
        <Link
          href={buildScopeHref("applied", accountId, categoryId, from, to)}
          className={cn(
            "inline-flex h-full flex-1 items-center justify-center rounded-md px-3 text-sm font-medium transition-all",
            !isUpcoming && "bg-background text-foreground shadow-sm",
          )}
        >
          {t("scopeApplied")}
        </Link>
        <Link
          href={buildScopeHref("upcoming", accountId, categoryId, from, to)}
          className={cn(
            "inline-flex h-full flex-1 items-center justify-center rounded-md px-3 text-sm font-medium transition-all",
            isUpcoming && "bg-background text-foreground shadow-sm",
          )}
        >
          {t("scopeUpcoming")}
        </Link>
      </div>

      {!isUpcoming && (
        <DateRangePicker
          value={{ from: draftFrom, to: draftTo }}
          onChange={(val) => {
            if (val?.from) setDraftFrom(val.from);
            if (val?.to) setDraftTo(val.to);
          }}
          locale={getDateFnsLocale(locale)}
        />
      )}
      <div className="flex items-center gap-2">
        <AccountFilterSelect
          value={draftAccountId}
          onValueChange={setDraftAccountId}
        />
        <CategoryFilterSelect
          value={draftCategoryId}
          onValueChange={setDraftCategoryId}
        />
      </div>
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
