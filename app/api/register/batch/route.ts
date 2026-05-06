import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { insertRegistration } from "@/lib/insert-registration";
import { RegistrationPayloadSchema } from "@/lib/registration-schema";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const list = raw?.participants;
    if (!Array.isArray(list) || list.length === 0) {
      return NextResponse.json(
        { error: "participants array required" },
        { status: 400 },
      );
    }

    const batchId = `BATCH-${nanoid(10)}`;
    const registrationIds: string[] = [];

    for (let i = 0; i < list.length; i++) {
      const parsed = RegistrationPayloadSchema.safeParse(list[i]);
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: parsed.error.flatten(),
            index: i,
          },
          { status: 422 },
        );
      }
      const id = await insertRegistration(parsed.data, { batchId });
      registrationIds.push(id);
    }

    return NextResponse.json(
      {
        ok: true,
        batchId,
        registrationIds,
        count: registrationIds.length,
      },
      { status: 201 },
    );
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unable to save batch";
    const isConfig = message.includes("MONGODB_URI");
    return NextResponse.json(
      { error: isConfig ? "Server database is not configured" : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
