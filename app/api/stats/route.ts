import { NextResponse } from "next/server";

import { REGISTRATION_FEE_FCFA } from "@/lib/fees";
import { TACC_FIELDS } from "@/lib/data/fields";
import { YOUTH_GROUPS } from "@/lib/data/groups";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const col = db.collection("registrations");

    const totalRegs = await col.countDocuments({});
    const paidRegs = await col.countDocuments({
      paymentStatus: "paid",
    });
    const pendingRegs = await col.countDocuments({
      paymentStatus: "pending",
    });

    const fieldRankList = (await col.distinct("field.rank", {})).filter(
      (x): x is number => typeof x === "number",
    );
    const uniqueFieldCount = fieldRankList.length;
    const groupNumList = (await col.distinct("group.number", {})).filter(
      (x): x is number => typeof x === "number",
    );
    const uniqueGroupCount = groupNumList.length;

    const regRevenuePaid = paidRegs * REGISTRATION_FEE_FCFA;
    const regRevenuePotential = totalRegs * REGISTRATION_FEE_FCFA;

    const donationAgg = await db
      .collection("donations")
      .aggregate([
        {
          $group: {
            _id: null,
            sum: { $sum: "$amountFcfa" },
          },
        },
      ])
      .toArray();
    const donationTotal =
      donationAgg.length > 0 ? (donationAgg[0].sum as number) ?? 0 : 0;

    const byField = await col
      .aggregate([
        {
          $group: {
            _id: "$field.name",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const byRegion = await col
      .aggregate([
        {
          $group: {
            _id: "$regionOfOrigin",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const byCommittee = await col
      .aggregate([
        { $unwind: "$committees" },
        {
          $group: {
            _id: "$committees",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const byGender = await col
      .aggregate([
        {
          $group: {
            _id: "$gender",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const overTime = await col
      .aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 90 },
      ])
      .toArray();

    return NextResponse.json({
      totals: {
        registrations: totalRegs,
        registrationsPaid: paidRegs,
        registrationsPending: pendingRegs,
        uniqueFields: uniqueFieldCount || 0,
        uniqueGroups: uniqueGroupCount || 0,
        totalTaccFields: TACC_FIELDS.length,
        totalYouthGroups: YOUTH_GROUPS.length,
        revenueRegistrationPaidFcfa: regRevenuePaid,
        revenueRegistrationAllFcfa: regRevenuePotential,
        donationsFcfa: donationTotal,
        fundsTotalFcfa: regRevenuePaid + donationTotal,
      },
      charts: {
        byField: byField.map((x) => ({ label: String(x._id), count: x.count })),
        byRegion: byRegion.map((x) => ({
          label: String(x._id),
          count: x.count,
        })),
        byCommittee: byCommittee.map((x) => ({
          label: String(x._id),
          count: x.count,
        })),
        byGender: byGender.map((x) => ({
          label: String(x._id),
          count: x.count,
        })),
        overTime: overTime.map((x) => ({
          label: String(x._id),
          count: x.count,
        })),
        paymentStatus: [
          { label: "pending", count: pendingRegs },
          { label: "paid", count: paidRegs },
        ],
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stats failed";
    const isConfig = message.includes("MONGODB_URI");
    return NextResponse.json(
      { error: isConfig ? "Server database is not configured" : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
