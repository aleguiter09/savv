import type { NextRequest } from "next/server";

/** Validates Vercel cron or manual trigger with Authorization: Bearer <CRON_SECRET>. */
export function isCronAuthorized(request: NextRequest): {
  authorized: boolean;
  reason?: "missing_secret" | "missing_header" | "invalid_token";
} {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return { authorized: false, reason: "missing_secret" };
  }

  const authHeader = request.headers.get("authorization")?.trim();
  if (!authHeader) {
    return { authorized: false, reason: "missing_header" };
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader;

  if (token !== cronSecret) {
    return { authorized: false, reason: "invalid_token" };
  }

  return { authorized: true };
}
