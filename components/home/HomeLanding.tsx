"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import { CONFERENCE_COMMITTEES } from "@/lib/data/committees";
import { REGISTRATION_FEE_FCFA, formatFcfa } from "@/lib/fees";

export function HomeLanding() {
  const { t, lang } = useLanguage();
  const target = Date.UTC(2026, 6, 14, 8, 0, 0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hrs = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const min = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const sec = Math.floor((diff % (60 * 1000)) / 1000);

  return (
    <div className="tacc-shell py-14 sm:py-20">
      <section className="tacc-card overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div className="border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/90 p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#c8980a]">
              {lang === "fr" ? "Inscription officielle" : "Official registration"}
            </p>
            <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-[1.75rem] leading-[1.18] tracking-tight text-[#0a1f5c] sm:text-4xl md:text-[2.5rem]">
              {t("hero_title")}
            </h1>
            <p className="mt-4 text-[15px] font-medium italic text-slate-600">
              {t("hero_theme")}
            </p>
            <p className="mt-2 text-sm text-slate-500">{t("hero_org")}</p>
            <p className="mt-8 inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              {t("hero_date")}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/register" className="tacc-btn-navy px-8 py-3 text-[15px]">
                {t("cta_register")}
              </Link>
              <Link href="/batch" className="tacc-btn-ghost px-8 py-3 text-[15px]">
                {t("cta_group")}
              </Link>
              <Link href="/donate" className="tacc-btn-gold px-8 py-3 text-[15px]">
                {t("cta_donate")}
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-4">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <Image
                  src="/logo.jpeg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </span>
              <p className="text-sm leading-relaxed text-slate-600">{t("reg_sub")}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-[#0a1f5c] p-8 text-white sm:p-10">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-white/55">
              {lang === "fr" ? "Compte à rebours" : "Countdown"}
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
              {[
                [days, t("cd_days")],
                [hrs, t("cd_hrs")],
                [min, t("cd_min")],
                [sec, t("cd_sec")],
              ].map(([n, lbl]) => (
                <div
                  key={String(lbl)}
                  className="rounded-xl border border-white/10 bg-white/[0.07] px-2 py-4 text-center backdrop-blur-sm"
                >
                  <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold tabular-nums text-[#f0d078] sm:text-3xl">
                    {String(n).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-[9px] font-semibold uppercase tracking-wider text-white/45">
                    {lbl}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="tacc-page-title">{t("home_about_title")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          {t("home_about_sub")}
        </p>
      </section>

      <div className="mx-auto mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: "📅",
            titleKey: "ic_date" as const,
            body: `14 – 17 ${lang === "fr" ? "juillet" : "July"} 2026`,
          },
          { icon: "📍", titleKey: "ic_venue" as const, body: "Yaoundé, Cameroon" },
          {
            icon: "💰",
            titleKey: "ic_fee" as const,
            body: `${formatFcfa(REGISTRATION_FEE_FCFA, lang)} ${t("ic_or")} $2 ${t("ic_per")}`,
          },
          {
            icon: "✉️",
            titleKey: "ic_contact" as const,
            body: "tacc.nationalyouth@gmail.com",
          },
        ].map((item) => (
          <div
            key={item.titleKey}
            className="tacc-card p-7 text-center transition hover:border-[#c8980a]/35 hover:shadow-md"
          >
            <span className="text-3xl grayscale-[30%]" aria-hidden>
              {item.icon}
            </span>
            <h3 className="mt-4 text-[13px] font-bold uppercase tracking-wide text-[#0a1f5c]">
              {t(item.titleKey)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-20">
        <h2 className="text-center font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#0a1f5c] sm:text-2xl">
          {t("home_committees")}
        </h2>
        <div className="mx-auto mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CONFERENCE_COMMITTEES.map((c) => (
            <div
              key={c.id}
              className="tacc-card flex flex-col items-start gap-2 p-5 transition hover:border-[#0a1f5c]/20"
            >
              <span className="text-xl" aria-hidden>
                {c.icon}
              </span>
              <h3 className="text-[13px] font-semibold leading-snug text-[#0a1f5c]">
                {lang === "fr" ? c.fr : c.en}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <Image
          src="/hero.jpeg"
          alt=""
          width={1200}
          height={460}
          className="aspect-[21/9] max-h-[min(22rem,52vh)] w-full object-cover"
          sizes="(max-width:1024px) 100vw, 1024px"
        />
      </div>
    </div>
  );
}
