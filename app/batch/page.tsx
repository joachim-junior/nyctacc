import type { Metadata } from "next";

import { BatchRegistration } from "@/components/batch/BatchRegistration";

export const metadata: Metadata = {
  title: "Group registration",
  description:
    "Batch registration for National Youth Conference 2026 — add multiple participants under one Parish or delegation and complete a single Mobile Money checkout via Fapshi.",
};

export default function BatchPage() {
  return <BatchRegistration />;
}
