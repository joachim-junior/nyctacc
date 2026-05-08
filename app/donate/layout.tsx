import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support the National Youth Conference 2026 with a secure online gift through Fapshi (MTN Mobile Money or Orange Money). Confirmed donations appear on the honour roll.",
};

export default function DonateSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
