"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { MobileMoneyUssdPanel } from "@/components/payment/MobileMoneyUssdPanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatFcfa } from "@/lib/fees";

function parseWallet(v: string | null): "mtn" | "orange" | undefined {
  if (v === "mtn" || v === "orange") return v;
  return undefined;
}

function DonateSuccessContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const donationId = searchParams.get("donationId")?.trim() ?? "";
  const amountRaw = searchParams.get("amount");
  const amount =
    amountRaw !== null && amountRaw !== "" ? Math.floor(Number(amountRaw)) : NaN;
  const wallet = parseWallet(searchParams.get("wallet"));

  const hasDetails = donationId.length > 0 && Number.isFinite(amount) && amount >= 100;

  return (
    <div className="tacc-shell py-12 sm:py-16">
      <div className="tacc-card mx-auto max-w-lg border-t-4 border-emerald-500/80 p-8 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-2xl text-emerald-700">
          ✓
        </div>
        <h1 className="mt-6 text-center font-[family-name:var(--font-playfair)] text-2xl font-semibold tracking-tight text-[#0a1f5c]">
          {hasDetails ? t("don_success_title") : t("don_success_generic")}
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed text-slate-600">
          {hasDetails ? t("don_success_sub") : t("don_success_generic_hint")}
        </p>

        {hasDetails ? (
          <dl className="mt-10 space-y-5 rounded-xl border border-slate-100 bg-slate-50/60 px-5 py-5">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {t("don_success_amount")}
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-bold tabular-nums text-[#0a1f5c]">
                {formatFcfa(amount, lang)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {t("don_success_ref")}
              </dt>
              <dd className="mt-1 break-all font-mono text-base font-semibold text-[#0a1f5c]">
                {donationId}
              </dd>
            </div>
          </dl>
        ) : null}

        <div className="mt-10 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white px-5 py-4">
          <p className="mb-3 text-center text-xs font-medium text-slate-600">
            {t("don_success_ussd_note")}
          </p>
          <MobileMoneyUssdPanel emphasize={wallet} />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/donate#honour-roll"
            className="tacc-btn-navy inline-flex flex-1 justify-center py-3 text-center text-[15px] sm:flex-initial sm:min-w-[10rem]"
          >
            {t("don_success_cta_wall")}
          </Link>
          <Link
            href="/donate"
            className="tacc-btn-ghost inline-flex flex-1 justify-center py-3 text-center sm:flex-initial sm:min-w-[10rem]"
          >
            {t("don_success_cta_again")}
          </Link>
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#0a1f5c] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0a1f5c]"
          >
            ← {t("nav_home")}
          </Link>
        </p>
      </div>
    </div>
  );
}

function SuccessFallback() {
  const { t } = useLanguage();
  return (
    <div className="tacc-shell flex min-h-[40vh] items-center justify-center py-16">
      <p className="text-sm text-slate-500">{t("pay_status_checking")}</p>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <DonateSuccessContent />
    </Suspense>
  );
}
