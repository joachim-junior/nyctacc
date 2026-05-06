"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteHeader } from "@/components/platform/SiteHeader";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </div>
    </LanguageProvider>
  );
}
