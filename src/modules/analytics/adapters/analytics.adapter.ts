import type {
  AnalyticsPageParams,
  AnalyticsPageProps,
  CashflowMonthsOption,
} from "../types/analytics-filters.types";

export const CASHFLOW_MONTHS_OPTIONS = [6, 12, 24] as const;
export const DEFAULT_CASHFLOW_MONTHS: CashflowMonthsOption = 12;

function getDefaultFrom(): Date {
  return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

function getDefaultTo(): Date {
  return new Date();
}

function parseDateParam(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export function parseCashflowMonths(
  value: string | undefined,
): CashflowMonthsOption {
  const parsed = Number.parseInt(value ?? "", 10);
  if (parsed === 6 || parsed === 12 || parsed === 24) {
    return parsed;
  }
  return DEFAULT_CASHFLOW_MONTHS;
}

export async function parseAnalyticsSearchParams(
  searchParams: AnalyticsPageProps,
): Promise<AnalyticsPageParams> {
  const { from, to, account, months } = searchParams;

  return {
    accountId: account ?? "all",
    from: parseDateParam(from, getDefaultFrom()),
    to: parseDateParam(to, getDefaultTo()),
    months: parseCashflowMonths(months),
  };
}
