import { NextResponse } from "next/server";

import { getFapshiEnvConfig } from "@/lib/fapshi";

export const runtime = "nodejs";

/** Proxies [Fapshi Payment status](https://docs.fapshi.com/en/api-reference/endpoint/payment-status). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ transId: string }> },
) {
  const cfg = getFapshiEnvConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Payment gateway is not configured (missing FAPSHI_* env)." },
      { status: 503 },
    );
  }

  const { transId } = await context.params;
  if (!transId?.trim()) {
    return NextResponse.json({ error: "Missing transaction id" }, { status: 400 });
  }

  const url = `${cfg.baseUrl.replace(/\/$/, "")}/payment-status/${encodeURIComponent(transId)}`;

  const upstream = await fetch(url, {
    method: "GET",
    headers: {
      apiuser: cfg.apiUser,
      apikey: cfg.apiKey,
    },
  });

  let data: Record<string, unknown>;
  try {
    data = (await upstream.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Unexpected response from payment provider" },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const msg =
      typeof data.message === "string"
        ? data.message
        : `Status error (${upstream.status})`;
    return NextResponse.json({ error: msg }, { status: upstream.status });
  }

  return NextResponse.json(data);
}
