"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import { formatFcfa } from "@/lib/fees";

export default function DonatePage() {
  const { lang, t } = useLanguage();
  const [amount, setAmount] = useState(5000);
  const [custom, setCustom] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [wall, setWall] = useState<{ label: string; amountFcfa?: number }[]>([]);
  const [sent, setSent] = useState(false);

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

  async function submitDonation() {
    const amt = custom.trim() !== "" ? Number(custom) : amount;
    if (!Number.isFinite(amt) || amt < 100) return;
    await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountFcfa: Math.floor(amt),
        donorName: donorName.trim() || undefined,
        email: donorEmail.trim() || undefined,
        anonymous,
        message: message.trim() || undefined,
      }),
    });
    setSent(true);
    void loadWall();
  }

  const IC = "tacc-field mt-1 text-sm";
  const LB = "tacc-field-label";

  return (
    <div className="tacc-shell py-12 sm:py-16">
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
        <button type="button" className="tacc-btn-navy mt-10 w-full py-3 text-[15px]" onClick={() => void submitDonation()}>
          {t("btn_donate")}
        </button>
        {sent ? (
          <p className="mt-6 text-center text-sm font-medium text-emerald-800">Donation intent saved. Thank you!</p>
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
        <Link href="/" className="text-sm font-medium text-[#0a1f5c] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0a1f5c]">
          ← {t("nav_home")}
        </Link>
      </div>
    </div>
  );
}
