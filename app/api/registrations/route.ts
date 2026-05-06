import { NextResponse } from "next/server";

import { getDb } from "@/lib/mongodb";

/** Public-facing delegate roster (omit confidential + raw emails). */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qName = searchParams.get("q")?.trim().toLowerCase() ?? "";
    const fieldRank = searchParams.get("fieldRank");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    const and: Record<string, unknown>[] = [];

    if (fieldRank && fieldRank !== "all") {
      const rank = Number(fieldRank);
      if (!Number.isNaN(rank)) {
        and.push({ "field.rank": rank });
      }
    }

    if (qName) {
      and.push({
        $or: [
          { fullName: { $regex: qName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
          { registrationId: { $regex: qName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
        ],
      });
    }

    if (and.length) {
      filter.$and = and;
    }

    const rows = await db
      .collection("registrations")
      .find(filter, {
        projection: {
          registrationId: 1,
          fullName: 1,
          field: 1,
          group: 1,
          regionOfOrigin: 1,
          committees: 1,
          participantCategory: 1,
          paymentStatus: 1,
          createdAt: 1,
        },
      })
      .sort({ createdAt: -1 })
      .limit(400)
      .toArray();

    return NextResponse.json({ registrations: rows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Query failed";
    const isConfig = message.includes("MONGODB_URI");
    return NextResponse.json(
      { error: isConfig ? "Server database is not configured" : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
