import { createClient } from "@/infra/supabase/server";
import { getAccounts } from "@/modules/accounts/services/accounts";

type BalanceTimelinePoint = {
  date: string;
  [key: string]: string | number | null;
};

type BalanceTimelineResult = {
  categories: string[];
  data: BalanceTimelinePoint[];
};

type TimelineGranularity = "day" | "week";

const getMondayOfWeek = (date: Date) => {
  const utc = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = utc.getUTCDay();
  const distanceToMonday = day === 0 ? -6 : 1 - day;
  utc.setUTCDate(utc.getUTCDate() + distanceToMonday);
  return utc.toISOString().slice(0, 10);
};

const getBucketDate = (date: string, granularity: TimelineGranularity) => {
  if (granularity === "week") {
    return getMondayOfWeek(new Date(`${date}T00:00:00Z`));
  }

  return date;
};

const getNextBucketDate = (date: string, granularity: TimelineGranularity) => {
  const nextDate = new Date(`${date}T00:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + (granularity === "week" ? 7 : 1));
  return nextDate.toISOString().slice(0, 10);
};

const getBucketRange = (
  startDate: Date,
  endDate: Date,
  granularity: TimelineGranularity,
) => {
  const startBucket = getBucketDate(
    startDate.toISOString().slice(0, 10),
    granularity,
  );
  const endBucket = getBucketDate(
    endDate.toISOString().slice(0, 10),
    granularity,
  );

  const buckets: string[] = [];
  let cursor = startBucket;

  while (cursor <= endBucket) {
    buckets.push(cursor);
    cursor = getNextBucketDate(cursor, granularity);
  }

  return buckets;
};

export const getAccountsBalanceTimeline = async (
  monthsBack: number = 3,
): Promise<BalanceTimelineResult> => {
  const [supabase, accounts] = await Promise.all([
    createClient(),
    getAccounts(),
  ]);

  if (accounts.length === 0) {
    return { categories: [], data: [] };
  }

  const accountLabelById = new Map<number, string>();
  const accountIds: number[] = [];

  for (const account of accounts) {
    if (account.id == null) {
      continue;
    }

    const accountLabel = `${account.name?.trim() || "Account"} (${account.id})`;
    accountLabelById.set(account.id, accountLabel);
    accountIds.push(account.id);
  }

  if (accountIds.length === 0) {
    return { categories: [], data: [] };
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsBack);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const rangeDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / MS_PER_DAY,
  );
  const granularity: TimelineGranularity = rangeDays > 120 ? "week" : "day";

  const [rangeMovementsResponse, baselineMovementsResponse] = await Promise.all(
    [
      supabase
        .from("movement")
        .select("from, done_at, balance_after")
        .in("from", accountIds)
        .gte("done_at", startDate.toISOString())
        .lte("done_at", endDate.toISOString())
        .order("done_at", { ascending: false }),
      supabase
        .from("movement")
        .select("from, done_at, balance_after")
        .in("from", accountIds)
        .lt("done_at", startDate.toISOString())
        .order("done_at", { ascending: false }),
    ],
  );

  const rangeMovements = rangeMovementsResponse.data ?? [];
  const baselineMovements = baselineMovementsResponse.data ?? [];

  if (rangeMovements.length === 0 && baselineMovements.length === 0) {
    return { categories: [], data: [] };
  }

  const balanceByAccountAndBucket = new Map<string, number>();
  const accountIdsWithData = new Set<number>();

  for (const movement of rangeMovements) {
    if (!movement.done_at || movement.balance_after == null) {
      continue;
    }

    const accountLabel = accountLabelById.get(movement.from);
    if (!accountLabel) {
      continue;
    }

    const day = movement.done_at.slice(0, 10);
    const bucketDate = getBucketDate(day, granularity);
    const movementKey = `${movement.from}|${bucketDate}`;

    if (!balanceByAccountAndBucket.has(movementKey)) {
      balanceByAccountAndBucket.set(movementKey, movement.balance_after);
      accountIdsWithData.add(movement.from);
    }
  }

  const baselineByAccount = new Map<number, number>();

  for (const movement of baselineMovements) {
    if (movement.balance_after == null) {
      continue;
    }

    const accountLabel = accountLabelById.get(movement.from);
    if (!accountLabel || baselineByAccount.has(movement.from)) {
      continue;
    }

    baselineByAccount.set(movement.from, movement.balance_after);
    accountIdsWithData.add(movement.from);
  }

  const accountSeries = accountIds
    .filter((id) => accountIdsWithData.has(id))
    .map((id) => ({
      id,
      label: accountLabelById.get(id) ?? `Account (${id})`,
    }));

  if (accountSeries.length === 0) {
    return { categories: [], data: [] };
  }

  const buckets = getBucketRange(startDate, endDate, granularity);
  const lastKnownBalance = new Map<number, number | null>();

  for (const account of accountSeries) {
    lastKnownBalance.set(account.id, baselineByAccount.get(account.id) ?? null);
  }

  const categories = accountSeries.map((account) => account.label);

  const timelineData = buckets.map((bucket) => {
    const point: BalanceTimelinePoint = { date: bucket };

    for (const account of accountSeries) {
      const key = `${account.id}|${bucket}`;
      const currentBalance = balanceByAccountAndBucket.get(key);

      if (currentBalance != null) {
        lastKnownBalance.set(account.id, currentBalance);
      }

      point[account.label] = lastKnownBalance.get(account.id) ?? null;
    }

    return point;
  });

  return {
    categories,
    data: timelineData,
  };
};
