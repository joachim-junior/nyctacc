import { NextResponse } from "next/server";

import { fetchFapshiTransaction } from "@/lib/fapshi";
import { getTrustedClientIp } from "@/lib/request-client-ip";

export const runtime = "nodejs";

/** Proxies [Fapshi Payment status](https://docs.fapshi.com/en/api-reference/endpoint/payment-status). */
export async function GET(
  request: Request,
  context: { params: Promise<{ transId: string }> },
) {
  const { transId } = await context.params;
  if (!transId?.trim()) {
    return NextResponse.json({ error: "Missing transaction id" }, { status: 400 });
  }

  const payerIp = getTrustedClientIp(request);
  const result = await fetchFapshiTransaction(transId, {
    payerIp,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.statusCode });
  }
  return NextResponse.json(result.data);
}
