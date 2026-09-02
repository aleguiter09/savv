import type { BalanceTimelineBucket } from "../types/analytics-filters.types";

const DAY_BUCKET_MAX_DAYS = 31;
const WEEK_BUCKET_MAX_DAYS = 90;

export function deriveTimelineBucket(from: Date, to: Date): BalanceTimelineBucket {
  const diffMs = to.getTime() - from.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= DAY_BUCKET_MAX_DAYS) return "day";
  if (diffDays <= WEEK_BUCKET_MAX_DAYS) return "week";
  return "month";
}
