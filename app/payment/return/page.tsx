"use client";

import Link from "next/link";

import { useLanguage } from "@/contexts/LanguageContext";

export default function PaymentReturnPage() {
  const { t } = useLanguage();
  return (
    <div className="tacc-shell max-w-xl py-24 text-center">
      <h1 className="tacc-page-title">{t("pay_return_title")}</h1>
      <p className="mx-auto mt-5 text-[15px] leading-relaxed text-slate-600">
        {t("pay_return_body")}
      </p>
      <Link href="/" className="mt-10 inline-flex tacc-btn-navy px-8">
        {t("nav_home")}
      </Link>
    </div>
  );
}
