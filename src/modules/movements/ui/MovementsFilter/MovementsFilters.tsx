"use client";

import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useData } from "@/modules/shared/stores/DataProvider";
import { Button } from "@/ui/button";
import { DateRangePicker } from "@/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
}>;

function getDefaultFrom() {
  return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

function getDefaultTo() {
  return new Date();
}

export function MovementsFilters({
  from,
  to,
  accountId,
  categoryId,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("movements");
  const tDashboard = useTranslations("dashboard");
  const tCategories = useTranslations("categories");
  const pathname = usePathname();
  const { replace } = useRouter();
  const { accounts, incomeCategories, expenseCategories } = useData();

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
    const appliedFrom = format(from, "yyyy-MM-dd");
    const appliedTo = format(to, "yyyy-MM-dd");
    const draftFromStr = format(draftFrom, "yyyy-MM-dd");
    const draftToStr = format(draftTo, "yyyy-MM-dd");

    return (
      appliedFrom !== draftFromStr ||
      appliedTo !== draftToStr ||
      accountId !== draftAccountId ||
      categoryId !== draftCategoryId
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
  ]);

  const handleApply = () => {
    const params = new URLSearchParams();
    params.set("from", format(draftFrom, "yyyy-MM-dd"));
    params.set("to", format(draftTo, "yyyy-MM-dd"));
    params.set("account", draftAccountId);
    params.set("category", draftCategoryId);
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
      <DateRangePicker
        value={{ from: draftFrom, to: draftTo }}
        onChange={(val) => {
          if (val?.from) setDraftFrom(val.from);
          if (val?.to) setDraftTo(val.to);
        }}
        locale={locale.includes("es") ? es : enUS}
      />
      <div className="flex items-center gap-2">
        <Select value={draftAccountId} onValueChange={setDraftAccountId}>
          <SelectTrigger className="w-full max-w-none bg-white">
            <SelectValue placeholder={tDashboard("selectPlaceholder")} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">{tDashboard("allAccounts")}</SelectItem>
            <SelectGroup>
              {accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id?.toString() ?? ""}
                >
                  {account.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={draftCategoryId} onValueChange={setDraftCategoryId}>
          <SelectTrigger className="w-full max-w-none bg-white">
            <SelectValue placeholder={tCategories("selectPlaceholder")} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">{tCategories("allCategories")}</SelectItem>
            <SelectGroup>
              <SelectLabel>{tCategories("incomes")}</SelectLabel>
              <SelectItem value="incomes">
                {tCategories("allIncomes")}
              </SelectItem>
              {incomeCategories.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.isGlobal && !item.isCustomName
                    ? tCategories(item.title)
                    : item.title}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>{tCategories("expenses")}</SelectLabel>
              <SelectItem value="expenses">
                {tCategories("allExpenses")}
              </SelectItem>
              {expenseCategories.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.isGlobal && !item.isCustomName
                    ? tCategories(item.title)
                    : item.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
