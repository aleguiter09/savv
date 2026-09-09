export type AnalyticsPageProps = {
  from?: string;
  to?: string;
  account?: string;
  months?: string;
};

export type AnalyticsDateRange = {
  from: Date;
  to: Date;
};

export type AnalyticsAccountFilter = {
  accountId: string;
};

export type CashflowMonthsOption = 6 | 12 | 24;

export type AnalyticsFiltersParams = AnalyticsDateRange & AnalyticsAccountFilter;

export type AnalyticsPageParams = AnalyticsFiltersParams & {
  months: CashflowMonthsOption;
};

export type BalanceTimelineBucket = "day" | "week" | "month";
