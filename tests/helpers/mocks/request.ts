import type { NextRequest } from "next/server";

export function mockRequest(
  headers: Record<string, string | undefined> = {},
): NextRequest {
  return {
    headers: {
      get: (name: string) => {
        const key = Object.keys(headers).find(
          (k) => k.toLowerCase() === name.toLowerCase(),
        );
        return key ? (headers[key] ?? null) : null;
      },
    },
  } as NextRequest;
}

export function withCronSecret(secret = "test-cron-secret") {
  const previous = process.env.CRON_SECRET;
  process.env.CRON_SECRET = secret;
  return () => {
    if (previous === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = previous;
    }
  };
}
