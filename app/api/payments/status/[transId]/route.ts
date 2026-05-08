import { NextResponse } from "next/server";

import { fetchFapshiTransaction } from "@/lib/fapshi";

export const runtime = "nodejs";

/** Proxies [Fapshi Payment status](https://docs.fapshi.com/en/api-reference/endpoint/payment-status). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ transId: string }> },
) {
  const { transId } = await context.params;
  if (!transId?.trim()) {
    return NextResponse.json({ error: "Missing transaction id" }, { status: 400 });
  }

  const result = await fetchFapshiTransaction(transId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.statusCode });
  }
  return NextResponse.json(result.data);
}
