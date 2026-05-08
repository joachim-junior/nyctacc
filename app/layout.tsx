import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";

import { AppProviders } from "@/components/AppProviders";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
});

const SITE_TITLE_DEFAULT =
  "National Youth Conference 2026 — TACC Cameroon";
const SITE_DESCRIPTION =
  "Official site for The Apostolic Church Cameroon National Youth Conference 2026 in Yaoundé (14–17 July). Individual and group registration, participant list, live statistics, and secure donations via Fapshi.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: "%s · TACC NYC 2026",
  },
  description: SITE_DESCRIPTION,
  applicationName: "TACC NYC 2026",
  keywords: [
    "TACC",
    "The Apostolic Church Cameroon",
    "National Youth Conference",
    "NYC 2026",
    "yaoundé",
    "cameroon",
    "youth conference",
    "Apostolic Church",
    "Fapshi",
    "Mobile Money registration",
  ],
  authors: [{ name: "The Apostolic Church Cameroon — TACC" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TACC National Youth Conference 2026",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${playfair.variable} ${nunito.className} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
