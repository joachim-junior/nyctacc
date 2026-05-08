import type { Metadata } from "next";

import { ParticipantsTable } from "@/components/participants/ParticipantsTable";

export const metadata: Metadata = {
  title: "Participants",
  description:
    "Public participants list for National Youth Conference 2026 submissions — search profiles by name, field of origin, ministry group, region, committee interest, and category.",
};

export default function ParticipantsPage() {
  return <ParticipantsTable />;
}
