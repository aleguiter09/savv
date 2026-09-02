export type AnalyticsPageProps = {
  from?: string;
  to?: string;
  account?: string;
};

export type AnalyticsDateRange = {
  from: Date;
  to: Date;
};

export type AnalyticsAccountFilter = {
  accountId: string;
};

export type AnalyticsFiltersParams = AnalyticsDateRange & AnalyticsAccountFilter;

export type BalanceTimelineBucket = "day" | "week" | "month";
