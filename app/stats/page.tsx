import type { Metadata } from "next";

import { StatsDashboard } from "@/components/stats/StatsDashboard";

export const metadata: Metadata = {
  title: "Statistics",
  description:
    "Live conference analytics: registrations by field and region, committee interest and gender summaries, timelines, confirmed payments versus pending, donations received, and total funds.",
};

export default function StatsPage() {
  return <StatsDashboard />;
}
