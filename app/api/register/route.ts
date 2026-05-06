import { NextResponse } from "next/server";

import { insertRegistration } from "@/lib/insert-registration";
import { RegistrationPayloadSchema } from "@/lib/registration-schema";

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

    const registrationId = await insertRegistration(parsed.data);
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
