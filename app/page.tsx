import type { Metadata } from "next";

import { HomeLanding } from "@/components/home/HomeLanding";

export const metadata: Metadata = {
  description:
    "Countdown to National Youth Conference 2026 in Yaoundé. Register, donate, and explore conference information for The Apostolic Church Cameroon youth.",
};

export default function Home() {
  return <HomeLanding />;
}
