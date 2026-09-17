"use client";

import Link from "next/link";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export type CommitmentRow = {
  id: number;
  href: string;
  title: string;
  subtitle: string;
  amountLabel: string;
  amountTone?: "expense" | "income" | "neutral";
  meta?: string;
  progress?: number;
  icon: string;
  color: string;
};

export type CommitmentsTabData = {
  id: string;
  label: string;
  count: number;
  summaryLabel?: string;
  summaryValue?: string;
  emptyLabel: string;
  seeAllHref: string;
  rows: CommitmentRow[];
};

type Props = Readonly<{
  tabs: CommitmentsTabData[];
  seeAllLabel: string;
}>;

function CommitmentList({
  tab,
  seeAllLabel,
}: Readonly<{ tab: CommitmentsTabData; seeAllLabel: string }>) {
  if (tab.rows.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">{tab.emptyLabel}</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tab.summaryLabel && tab.summaryValue ? (
        <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
          <span className="text-muted-foreground">{tab.summaryLabel}</span>
          <span className="font-semibold text-expense">{tab.summaryValue}</span>
        </div>
      ) : null}

      <ul className="flex flex-col">
        {tab.rows.map((row) => (
          <li key={row.id} className="border-b border-border last:border-none">
            <Link
              href={row.href}
              className="flex items-center justify-between gap-3 px-1 py-2.5 hover:bg-accent"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <CategoryIcon icon={row.icon} color={row.color} size={14} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{row.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{row.subtitle}</p>
                  {row.progress != null ? (
                    <div className="mt-1.5 h-1 w-28 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={
                    row.amountTone === "income"
                      ? "text-sm font-medium text-income"
                      : row.amountTone === "neutral"
                        ? "text-sm font-medium text-muted-foreground"
                        : "text-sm font-medium text-expense"
                  }
                >
                  {row.amountLabel}
                </p>
                {row.meta ? (
                  <p className="text-xs text-muted-foreground">{row.meta}</p>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link href={tab.seeAllHref}>
        <p className="text-center text-sm font-semibold text-primary">{seeAllLabel}</p>
      </Link>
    </div>
  );
}

export function FutureCommitmentsTabs({ tabs, seeAllLabel }: Props) {
  const defaultTab =
    tabs.find((tab) => tab.rows.length > 0)?.id ?? tabs[0]?.id ?? "installments";

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="grid h-auto w-full grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="px-2 text-xs sm:text-sm">
            {tab.label}
            {tab.count > 0 ? (
              <span className="ml-1 text-text-muted">({tab.count})</span>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <CommitmentList tab={tab} seeAllLabel={seeAllLabel} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
