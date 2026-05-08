import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank you",
  description:
    "Your donation to The Apostolic Church Cameroon National Youth Conference 2026 has been confirmed. View the donor honour roll or return home anytime.",
};

export default function DonateSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
