import { NextResponse } from "next/server";
import { z } from "zod";

import { fetchFapshiTransaction } from "@/lib/fapshi";
import { getDb } from "@/lib/mongodb";
import { getTrustedClientIp } from "@/lib/request-client-ip";

export const runtime = "nodejs";

const PatchBodySchema = z.object({
  transId: z.string().trim().min(1),
});

/** After Fapshi reports SUCCESSFUL, verify upstream and mark the donation paid. */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ donationId: string }> },
) {
  try {
    const parsed = PatchBodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { donationId } = await context.params;
    const id = donationId?.trim();
    if (!id) {
      return NextResponse.json({ error: "Missing donation id" }, { status: 400 });
    }

    const db = await getDb();
    const doc = await db.collection("donations").findOne({ donationId: id });
    if (!doc) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    if (doc.paymentStatus === "paid") {
      return NextResponse.json({ ok: true, alreadyPaid: true });
    }

    const transId = parsed.data.transId;
    const storedIp =
      typeof doc.initiatorIp === "string" && doc.initiatorIp.trim() ?
        doc.initiatorIp.trim()
      : undefined;
    const payerIp = storedIp ?? getTrustedClientIp(req) ?? undefined;
    const ft = await fetchFapshiTransaction(transId, { payerIp });
    if (!ft.ok) {
      return NextResponse.json({ error: ft.error }, { status: ft.statusCode });
    }

    const status =
      typeof ft.data.status === "string" ? ft.data.status.toUpperCase() : "";
    if (status !== "SUCCESSFUL") {
      return NextResponse.json(
        {
          error: `Payment is not complete (status: ${status || "unknown"})`,
        },
        { status: 409 },
      );
    }

    const extRaw = ft.data.externalId;
    const ext = typeof extRaw === "string" ? extRaw.trim() : "";
    if (ext && ext !== id) {
      return NextResponse.json(
        { error: "Transaction does not match this donation" },
        { status: 400 },
      );
    }

    const paidAmount =
      typeof ft.data.amount === "number" ? Math.floor(ft.data.amount) : null;

    const expected = doc.amountFcfa as number;
    if (
      paidAmount !== null &&
      Number.isFinite(paidAmount) &&
      paidAmount !== expected
    ) {
      return NextResponse.json(
        { error: "Paid amount does not match this donation" },
        { status: 400 },
      );
    }

    await db.collection("donations").updateOne(
      { donationId: id },
      {
        $set: {
          paymentStatus: "paid",
          fapshiTransId: transId,
          paidAt: new Date(),
        },
      },
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unable to update donation";
    const isConfig = message.includes("MONGODB_URI");
    return NextResponse.json(
      { error: isConfig ? "Server database is not configured" : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
