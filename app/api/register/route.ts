import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

import { getDb } from "@/lib/mongodb";
import { RegistrationPayloadSchema } from "@/lib/registration-schema";

const makeId = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 5);

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = RegistrationPayloadSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const body = parsed.data;
    const registrationId = `NYC2026-${makeId()}`;
    const db = await getDb();
    const { prayerRequest, ...rest } = body;

    const doc = {
      registrationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: "pending" as const,
      ...rest,
      confidential: {
        prayerRequest: prayerRequest?.trim() ? prayerRequest.trim() : null,
      },
    };

    await db.collection("registrations").insertOne(doc);

    return NextResponse.json({ ok: true, registrationId }, { status: 201 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unable to save registration";
    const isConfig = message.includes("MONGODB_URI");
    return NextResponse.json(
      { error: isConfig ? "Server database is not configured" : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
