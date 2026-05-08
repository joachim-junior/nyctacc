"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PaymentModal } from "@/components/payment/PaymentModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatFcfa } from "@/lib/fees";

function summarizeDonationApiError(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const raw = (payload as { error?: unknown }).error;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (!raw || typeof raw !== "object") return fallback;
  const o = raw as { formErrors?: unknown; fieldErrors?: unknown };
  const form =
    Array.isArray(o.formErrors) ?
      o.formErrors.filter((x): x is string => typeof x === "string")
    : [];
  const fieldParts: string[] = [];
  if (o.fieldErrors && typeof o.fieldErrors === "object") {
    for (const [key, val] of Object.entries(o.fieldErrors)) {
      if (Array.isArray(val)) {
        const msgs = val.filter((m): m is string => typeof m === "string");
        if (msgs.length) fieldParts.push(`${key}: ${msgs.join(", ")}`);
      }
    }
  }
  const all = [...form, ...fieldParts].filter(Boolean);
  return all.length ? all.join(" · ") : fallback;
}

export default function DonatePage() {
  const { lang, t } = useLanguage();
  const [amount, setAmount] = useState(5000);
  const [custom, setCustom] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [wall, setWall] = useState<{ label: string; amountFcfa?: number }[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paidThankYou, setPaidThankYou] = useState(false);

  const [payOpen, setPayOpen] = useState(false);
  const [pendingDonationId, setPendingDonationId] = useState<string | null>(null);
  const [payAmountFcfa, setPayAmountFcfa] = useState(0);
  const [fapshiMemo, setFapshiMemo] = useState("");

  const loadWall = useCallback(async () => {
    try {
      const res = await fetch("/api/donations");
      const data = await res.json();
      setWall(data.donors ?? []);
    } catch {
      setWall([]);
    }
  }, []);

  useEffect(() => {
    void loadWall();
  }, [loadWall]);

  function resolveAmountFcfa(): number | null {
    const amt = custom.trim() !== "" ? Number(custom) : amount;
    if (!Number.isFinite(amt) || amt < 100) return null;
    return Math.floor(amt);
  }

  async function startDonationAndPay() {
    setFormError(null);
    const amt = resolveAmountFcfa();
    if (amt === null) {
      setFormError(lang === "fr" ? "Montant invalide (minimum 100 FCFA)." : "Invalid amount (minimum 100 FCFA).");
      return;
    }

    const dedication = message.trim();
    const memo = dedication
      ? `TACC NYC 2026 donation — ${dedication.slice(0, 450)}`
      : "TACC NYC 2026 donation";

    setSubmitting(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountFcfa: amt,
          donorName: donorName.trim() || undefined,
          email: donorEmail.trim() || undefined,
          anonymous,
          message: dedication || undefined,
        }),
      });

      const data = (await res.json()) as { donationId?: string; error?: unknown };

      if (res.status === 503) {
        setFormError(t("don_err_gateway"));
        setSubmitting(false);
        return;
      }
      if (!res.ok || typeof data.donationId !== "string") {
        setFormError(summarizeDonationApiError(data, t("don_err_save")));
        setSubmitting(false);
        return;
      }

      setPayAmountFcfa(amt);
      setFapshiMemo(memo);
      setPendingDonationId(data.donationId);
      setPayOpen(true);
      setPaidThankYou(false);
    } catch {
      setFormError(t("don_err_save"));
    } finally {
      setSubmitting(false);
    }
  }

  const finalizeDonation = useCallback(
    async (transId: string): Promise<{ ok: boolean; error?: string }> => {
      if (!pendingDonationId) {
        return { ok: false, error: t("pay_status_unknown") };
      }
      try {
        const res = await fetch(
          `/api/donations/${encodeURIComponent(pendingDonationId)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transId }),
          },
        );
        const data = (await res.json()) as { ok?: boolean; error?: unknown };
        if (!res.ok) {
          const err =
            typeof data.error === "string"
              ? data.error
              : t("pay_status_unknown");
          return { ok: false, error: err };
        }
        setPaidThankYou(true);
        void loadWall();
        return { ok: true };
      } catch {
        return { ok: false, error: t("pay_status_unknown") };
      }
    },
    [pendingDonationId, loadWall, t],
  );

  const IC = "tacc-field mt-1 text-sm";
  const LB = "tacc-field-label";

  return (
    <div className="tacc-shell py-12 sm:py-16">
      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amountFcfa={payAmountFcfa}
        personCount={1}
        billKind="single"
        referenceLabel={pendingDonationId ?? "—"}
        externalId={pendingDonationId ?? undefined}
        email={anonymous ? undefined : donorEmail.trim() || undefined}
        payerName={anonymous ? undefined : donorName.trim() || undefined}
        paymentMessage={fapshiMemo}
        onFapshiSuccess={(tid) => finalizeDonation(tid)}
      />

      <div className="tacc-card mx-auto max-w-lg p-8 sm:p-10">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold tracking-tight text-[#0a1f5c]">
          {t("don_title")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{t("don_sub")}</p>
        <h2 className="mt-10 text-[15px] font-bold uppercase tracking-wide text-[#c8980a]">
          {t("don_give")}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{t("don_desc")}</p>

        <label className={`${LB} mt-8 block`}>{t("don_amount")}</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1000, 2500, 5000, 10000].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setAmount(n);
                setCustom("");
              }}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                amount === n && custom.trim() === ""
                  ? "border-[#0a1f5c] bg-[#0a1f5c] text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {formatFcfa(n, lang)}
            </button>
          ))}
        </div>
        <label className={`${LB} mt-6 block`}>{t("don_custom")}</label>
        <input
          type="number"
          className={IC}
          min={100}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="3000"
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={`${LB} block`}>{t("don_name")}</label>
            <input className={IC} value={donorName} disabled={anonymous} onChange={(e) => setDonorName(e.target.value)} />
          </div>
          <div>
            <label className={`${LB} block`}>{t("don_email")}</label>
            <input
              type="email"
              className={IC}
              value={donorEmail}
              disabled={anonymous}
              onChange={(e) => setDonorEmail(e.target.value)}
            />
          </div>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          {t("don_anon")}
        </label>
        <label className={`${LB} mt-6 block`}>{t("don_message")}</label>
        <textarea className={`${IC} resize-y`} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        {formError ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {formError}
          </div>
        ) : null}
        <button
          type="button"
          className="tacc-btn-navy mt-10 w-full py-3 text-[15px] disabled:opacity-50"
          disabled={submitting}
          onClick={() => void startDonationAndPay()}
        >
          {submitting ? t("pay_sending_request") : t("btn_donate")}
        </button>
        {paidThankYou ? (
          <p className="mt-6 text-center text-sm font-medium text-emerald-800">{t("don_thank_you")}</p>
        ) : null}
      </div>

      <div className="mx-auto mt-14 max-w-2xl">
        <h3 className="text-center font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#0a1f5c]">
          {t("donor_wall")}
        </h3>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {(wall.length ? wall : [{ label: "—" }]).map((d, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm text-slate-800"
            >
              {d.label}
              {typeof d.amountFcfa === "number" ? (
                <span className="text-slate-500">· {formatFcfa(d.amountFcfa, lang)}</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-12 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-[#0a1f5c] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0a1f5c]"
        >
          ← {t("nav_home")}
        </Link>
      </div>
    </div>
  );
}
