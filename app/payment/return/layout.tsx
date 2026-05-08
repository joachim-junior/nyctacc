import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment redirect",
  description:
    "Information about returning after a hosted payment redirect. Prefer the Mobile Money checkout on the registration or donation confirmation flows.",
};

export default function PaymentReturnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
