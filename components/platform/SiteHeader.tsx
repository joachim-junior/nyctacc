"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { useLanguage } from "@/contexts/LanguageContext";

const routes = [
  { href: "/", key: "nav_home" as const },
  { href: "/register", key: "nav_register" as const },
  { href: "/batch", key: "nav_batch" as const },
  { href: "/participants", key: "nav_participants" as const },
  { href: "/donate", key: "nav_donate" as const },
  { href: "/stats", key: "nav_stats" as const },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/85 backdrop-blur-xl">
      <div className="tacc-shell flex h-14 items-center justify-between gap-4 sm:h-16">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 rounded-xl outline-none ring-offset-2 transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#0a1f5c]"
        >
          <span className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm sm:h-11 sm:w-11">
            <Image
              src="/logo.jpeg"
              alt="TACC"
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="44px"
            />
          </span>
          <div className="hidden min-w-0 leading-tight sm:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c8980a]">
              NYC · 2026
            </p>
            <p className="line-clamp-2 max-w-[11rem] text-xs font-semibold leading-snug text-[#0a1f5c] md:max-w-[16rem]">
              {t("hero_org")}
            </p>
          </div>
        </Link>

        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/90 p-0.5">
          <button
            type="button"
            aria-pressed={lang === "en"}
            onClick={() => setLang("en")}
            className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
              lang === "en"
                ? "bg-white text-[#0a1f5c] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            aria-pressed={lang === "fr"}
            onClick={() => setLang("fr")}
            className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
              lang === "fr"
                ? "bg-white text-[#0a1f5c] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            FR
          </button>
        </div>
      </div>

      <nav
        aria-label="Main"
        className="border-t border-slate-100 bg-slate-50/70"
      >
        <div className="tacc-shell flex gap-1 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center md:gap-2 [&::-webkit-scrollbar]:hidden">
          {routes.map((r) => {
            const active =
              r.href === "/"
                ? pathname === "/"
                : pathname.startsWith(r.href);
            return (
              <Link
                key={r.href}
                href={r.href}
                className={`shrink-0 rounded-lg px-3 py-2 text-[13px] font-semibold transition md:text-sm ${
                  active
                    ? "bg-[#0a1f5c] text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-[#0a1f5c]"
                }`}
              >
                {t(r.key)}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
