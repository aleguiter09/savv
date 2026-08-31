import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/infra/supabase/admin";
import { isCronAuthorized } from "../cron-auth";

export async function GET(request: NextRequest) {
  const auth = isCronAuthorized(request);

  if (!auth.authorized) {
    const error =
      auth.reason === "missing_secret"
        ? "CRON_SECRET is not set on the server"
        : auth.reason === "missing_header"
          ? "Missing Authorization header (Vercel sends Bearer CRON_SECRET on cron runs)"
          : "Invalid cron secret";

    return NextResponse.json({ error }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.rpc("apply_due_movements");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ applied: data ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
