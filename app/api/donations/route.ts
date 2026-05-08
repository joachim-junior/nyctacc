import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getFapshiEnvConfig } from "@/lib/fapshi";
import { getDb } from "@/lib/mongodb";

const DonationBodySchema = z.object({
  amountFcfa: z.number().int().min(100).max(100_000_000),
  donorName: z.string().optional(),
  email: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.string().email().optional(),
  ),
  anonymous: z.boolean(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    if (!getFapshiEnvConfig()) {
      return NextResponse.json(
        { error: "Payment gateway is not configured (missing FAPSHI_* env)." },
        { status: 503 },
      );
    }
    const parsed = DonationBodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }
    const body = parsed.data;
    const db = await getDb();
    const donationId = `DON-${nanoid(8)}`;
    await db.collection("donations").insertOne({
      donationId,
      createdAt: new Date(),
      paymentStatus: "pending",
      amountFcfa: body.amountFcfa,
      donorName: body.anonymous ? null : body.donorName?.trim() || "Supporter",
      email: body.anonymous ? null : body.email,
      anonymous: body.anonymous,
      message: body.message?.trim() || null,
    });
    return NextResponse.json({ ok: true, donationId }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unable to save donation";
    const isConfig = message.includes("MONGODB_URI");
    return NextResponse.json(
      { error: isConfig ? "Server database is not configured" : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const donors = await db
      .collection("donations")
      .find(
        { paymentStatus: "paid" },
        {
          projection: {
            donorName: 1,
            anonymous: 1,
            amountFcfa: 1,
            createdAt: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .limit(40)
      .toArray();

    const wall = donors.map((d) => ({
      label: (d.anonymous ? "Anonymous" : d.donorName) as string,
      amountFcfa: d.amountFcfa as number | undefined,
    }));

    return NextResponse.json({ donors: wall });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Query failed";
    const isConfig = message.includes("MONGODB_URI");
    return NextResponse.json(
      { error: isConfig ? "Server database is not configured" : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
