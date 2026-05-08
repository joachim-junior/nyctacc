import { NextResponse } from "next/server";

import {
  FAPSHI_MEDIUM,
  type FapshiWallet,
  getFapshiEnvConfig,
  normalizeCmPhoneForFapshi,
  sanitizeExternalId,
} from "@/lib/fapshi";
import { getTrustedClientIp } from "@/lib/request-client-ip";

export const runtime = "nodejs";

type Body = {
  amount?: number;
  phone?: string;
  medium?: FapshiWallet | string;
  email?: string;
  externalId?: string;
  message?: string;
  name?: string;
};

/** Proxies [Fapshi Direct Pay](https://docs.fapshi.com/en/api-reference/endpoint/direct-pay). */
export async function POST(request: Request) {
  const cfg = getFapshiEnvConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Payment gateway is not configured (missing FAPSHI_* env)." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const amount =
    typeof body.amount === "number" ? body.amount : Number(body.amount);
  if (!Number.isFinite(amount) || amount < 100) {
    return NextResponse.json(
      { error: "Amount must be at least 100 XAF" },
      { status: 400 },
    );
  }

  if (typeof body.phone !== "string" || !body.phone.trim()) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 },
    );
  }

  const phone = normalizeCmPhoneForFapshi(body.phone);
  if (!phone) {
    return NextResponse.json(
      {
        error:
          "Enter a valid Cameroon mobile number (9 digits, e.g. 677123456 or +237 677 123 456).",
      },
      { status: 400 },
    );
  }

  let medium: string | undefined;
  if (body.medium === "mtn" || body.medium === "orange") {
    medium = FAPSHI_MEDIUM[body.medium];
  } else if (
    body.medium === FAPSHI_MEDIUM.mtn ||
    body.medium === FAPSHI_MEDIUM.orange
  ) {
    medium = body.medium;
  } else {
    return NextResponse.json(
      { error: "Select MTN Mobile Money or Orange Money." },
      { status: 400 },
    );
  }

  const externalId = sanitizeExternalId(body.externalId);
  const email =
    typeof body.email === "string" && body.email.includes("@")
      ? body.email.trim().slice(0, 320)
      : undefined;
  const name =
    typeof body.name === "string" ? body.name.trim().slice(0, 120) : undefined;
  const message =
    typeof body.message === "string"
      ? body.message.trim().slice(0, 500)
      : undefined;

  const paymentHeaders = new Headers({
    "Content-Type": "application/json",
    apiuser: cfg.apiUser,
    apikey: cfg.apiKey,
  });
  const payerIp = getTrustedClientIp(request);
  if (payerIp) {
    paymentHeaders.set("X-Forwarded-For", payerIp);
    paymentHeaders.set("X-Real-IP", payerIp);
  }

  const upstream = await fetch(
    `${cfg.baseUrl.replace(/\/$/, "")}/direct-pay`,
    {
      method: "POST",
      headers: paymentHeaders,
      body: JSON.stringify({
        amount: Math.floor(amount),
        phone,
        medium,
        ...(externalId ? { externalId } : {}),
        ...(email ? { email } : {}),
        ...(name ? { name } : {}),
        ...(message ? { message } : {}),
      }),
    },
  );

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
        : `Payment gateway error (${upstream.status})`;
    return NextResponse.json({ error: msg }, { status: upstream.status });
  }

  const transId = data.transId;
  if (typeof transId !== "string" || !transId.trim()) {
    return NextResponse.json(
      { error: "Payment gateway returned no transaction id" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    transId,
    message: typeof data.message === "string" ? data.message : undefined,
    dateInitiated:
      typeof data.dateInitiated === "string" ? data.dateInitiated : undefined,
  });
}
