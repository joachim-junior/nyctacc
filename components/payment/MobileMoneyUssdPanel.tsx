"use client";

import { useLanguage } from "@/contexts/LanguageContext";

type Wallet = "mtn" | "orange";

type Props = {
  /** Highlight the wallet the payer selected */
  emphasize?: Wallet;
  className?: string;
};

export function MobileMoneyUssdPanel({
  emphasize,
  className = "",
}: Props) {
  const { t } = useLanguage();

  const chip = (wallet: Wallet) =>
    emphasize === wallet ?
          "rounded-lg border border-[#0a1f5c] bg-white shadow-sm ring-2 ring-[#0a1f5c]/15"
        : "rounded-lg border border-slate-200/90 bg-white/80";

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c8980a]">
        {t("pay_ussd_heading")}
      </p>
      <p className="text-xs leading-relaxed text-slate-600">{t("pay_ussd_sub")}</p>
      <ul className="space-y-2.5">
        <li className={`px-3 py-2.5 ${chip("mtn")}`}>
          <p className="text-xs font-semibold text-[#0a1f5c]">{t("pay_ussd_mtn_label")}</p>
          <p className="mt-1 font-mono text-base font-bold tracking-wide text-slate-900">
            {t("pay_ussd_mtn_code")}
          </p>
        </li>
        <li className={`px-3 py-2.5 ${chip("orange")}`}>
          <p className="text-xs font-semibold text-[#0a1f5c]">{t("pay_ussd_orange_label")}</p>
          <p className="mt-1 font-mono text-base font-bold tracking-wide text-slate-900">
            {t("pay_ussd_orange_code")}
          </p>
        </li>
      </ul>
    </div>
  );
}
