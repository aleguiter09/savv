import type {
  AnalyticsFiltersParams,
  AnalyticsPageProps,
} from "../types/analytics-filters.types";

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

export async function parseAnalyticsSearchParams(
  searchParams: AnalyticsPageProps,
): Promise<AnalyticsFiltersParams> {
  const { from, to, account } = searchParams;

  return {
    accountId: account ?? "all",
    from: parseDateParam(from, getDefaultFrom()),
    to: parseDateParam(to, getDefaultTo()),
  };
}
