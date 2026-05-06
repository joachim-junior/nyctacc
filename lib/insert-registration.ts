import { customAlphabet } from "nanoid";

import { getDb } from "@/lib/mongodb";
import type { RegistrationPayload } from "@/lib/registration-schema";

const makeId = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 5);

export type InsertRegistrationOptions = {
  batchId?: string;
};

/** Persists validated registration payload; strips prayer onto confidential sub-doc. */
export async function insertRegistration(
  body: RegistrationPayload,
  opts: InsertRegistrationOptions = {},
) {
  const registrationId = `NYC2026-${makeId()}`;
  const { prayerRequest, ...rest } = body;
  const db = await getDb();

  const doc = {
    registrationId,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentStatus: "pending" as const,
    ...rest,
    ...(opts.batchId ? { batchId: opts.batchId } : {}),
    confidential: {
      prayerRequest: prayerRequest?.trim() ? prayerRequest.trim() : null,
    },
  };

  await db.collection("registrations").insertOne(doc);
  return registrationId;
}
