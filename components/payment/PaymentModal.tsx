"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import { formatFcfa } from "@/lib/fees";

type FapshiWallet = "mtn" | "orange";

type Props = {
  open: boolean;
  onClose: () => void;
  amountFcfa: number;
  personCount: number;
  referenceLabel: string;
  externalId?: string;
  email?: string;
  /** Shown to Fapshi as payer name when supported. */
  payerName?: string;
};

type PollState = "idle" | "loading" | "ok" | "bad";

export function PaymentModal({
  open,
  onClose,
  amountFcfa,
  personCount,
  referenceLabel,
  externalId: externalIdProp,
  email,
  payerName,
}: Props) {
  const { lang, t } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [medium, setMedium] = useState<FapshiWallet>("mtn");
  const [phase, setPhase] = useState<"collect" | "sent">("collect");
  const [transId, setTransId] = useState<string | null>(null);
  const [apiMsg, setApiMsg] = useState<string | null>(null);
  const [pollState, setPollState] = useState<PollState>("idle");
  const [pollHint, setPollHint] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setBusy(false);
    setErr(null);
    setPhone("");
    setMedium("mtn");
    setPhase("collect");
    setTransId(null);
    setApiMsg(null);
    setPollState("idle");
    setPollHint(null);
  }, [open]);

  async function sendDirectPay() {
    setErr(null);
    setPollHint(null);
    setBusy(true);
    try {
      const res = await fetch("/api/payments/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountFcfa,
          phone: phone.trim(),
          medium,
          externalId: externalIdProp ?? referenceLabel,
          email: email?.trim() || undefined,
          name: payerName?.trim() || undefined,
          message:
            personCount > 1
              ? `TACC NYC 2026 — ${personCount} registrations`
              : "TACC NYC 2026 registration fee",
        }),
      });
      const data = (await res.json()) as {
        transId?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok || typeof data.transId !== "string") {
        setErr(typeof data.error === "string" ? data.error : t("pay_error_generic"));
        setBusy(false);
        return;
      }
      setTransId(data.transId);
      setApiMsg(typeof data.message === "string" ? data.message : null);
      setPhase("sent");
    } catch {
      setErr(t("pay_error_generic"));
    } finally {
      setBusy(false);
    }
  }

  async function checkStatus() {
    if (!transId) return;
    setPollHint(null);
    setPollState("loading");
    try {
      const res = await fetch(`/api/payments/status/${encodeURIComponent(transId)}`);
      const data = (await res.json()) as { status?: string; error?: string };
      if (!res.ok) {
        setPollState("idle");
        setPollHint(typeof data.error === "string" ? data.error : t("pay_status_unknown"));
        return;
      }
      const st = typeof data.status === "string" ? data.status.toUpperCase() : "";
      if (st === "SUCCESSFUL") {
        setPollState("ok");
        setPollHint(t("pay_status_successful"));
      } else if (st === "FAILED") {
        setPollState("bad");
        setPollHint(t("pay_status_failed"));
      } else if (st === "PENDING" || st === "CREATED") {
        setPollState("idle");
        setPollHint(t("pay_status_pending"));
      } else if (st === "EXPIRED") {
        setPollState("bad");
        setPollHint(t("pay_status_expired"));
      } else {
        setPollState("idle");
        setPollHint(t("pay_status_unknown"));
      }
    } catch {
      setPollState("idle");
      setPollHint(t("pay_status_unknown"));
    }
  }

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="tacc-card max-h-[min(90vh,560px)] w-full max-w-md overflow-y-auto border-slate-200/90 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c8980a]/40 bg-amber-50 text-base font-black text-[#0a1f5c]">
            $
          </div>
          <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#0a1f5c] sm:text-xl">
            {t("pay_title")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("pay_sub")}</p>
        </div>

        <div className="mx-auto mt-6 rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-white px-5 py-4 text-center shadow-inner">
          <p className="font-[family-name:var(--font-playfair)] text-[1.65rem] font-bold tabular-nums text-[#0a1f5c]">
            {formatFcfa(amountFcfa, lang)}
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {personCount} ×{" "}
            {formatFcfa(Math.round(amountFcfa / Math.max(personCount, 1)), lang)}
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          Ref:{" "}
          <span className="font-mono font-semibold text-[#0a1f5c]">{referenceLabel}</span>
        </p>

        {phase === "collect" ? (
          <div className="mt-6 space-y-5 text-left">
            <div>
              <span className="tacc-field-label">{t("pay_method_label")}</span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMedium("mtn")}
                  className={`rounded-xl border px-3 py-3 text-center text-sm font-semibold transition ${
                    medium === "mtn"
                      ? "border-[#0a1f5c] bg-slate-50 text-[#0a1f5c] ring-2 ring-[#0a1f5c]/10"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {t("pay_medium_mtn")}
                </button>
                <button
                  type="button"
                  onClick={() => setMedium("orange")}
                  className={`rounded-xl border px-3 py-3 text-center text-sm font-semibold transition ${
                    medium === "orange"
                      ? "border-[#0a1f5c] bg-slate-50 text-[#0a1f5c] ring-2 ring-[#0a1f5c]/10"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {t("pay_medium_orange")}
                </button>
              </div>
            </div>
            <div>
              <label className="tacc-field-label" htmlFor="pay-phone">
                {t("pay_phone_label")}
              </label>
              <input
                id="pay-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={t("pay_phone_placeholder")}
                className="tacc-field mt-1.5"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-slate-500">{t("pay_phone_hint")}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-left">
            <p className="text-sm font-semibold text-[#0a1f5c]">{t("pay_sent_title")}</p>
            <p className="text-sm leading-relaxed text-slate-600">{t("pay_sent_body")}</p>
            {apiMsg ? (
              <p className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {apiMsg}
              </p>
            ) : null}
            <p className="text-xs font-medium text-slate-500">Fapshi · transId</p>
            <p className="break-all font-mono text-sm text-[#0a1f5c]">{transId}</p>

            {pollHint ? (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  pollState === "ok"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                    : pollState === "bad"
                      ? "border border-red-200 bg-red-50 text-red-900"
                      : "border border-amber-100 bg-amber-50/80 text-amber-950"
                }`}
              >
                {pollHint}
              </p>
            ) : null}

            <button
              type="button"
              className="tacc-btn-ghost w-full py-3"
              disabled={pollState === "loading"}
              onClick={() => void checkStatus()}
            >
              {pollState === "loading" ? t("pay_status_checking") : t("pay_check_status")}
            </button>
          </div>
        )}

        {err ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-900">
            {err}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="tacc-btn-ghost flex-1 py-3"
            onClick={onClose}
            disabled={busy || pollState === "loading"}
          >
            {phase === "sent" ? t("btn_done") : t("btn_cancel")}
          </button>
          {phase === "collect" ? (
            <button
              type="button"
              className="tacc-btn-navy flex-1 py-3"
              onClick={() => void sendDirectPay()}
              disabled={busy}
            >
              {busy ? t("pay_sending_request") : t("pay_send_request")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
