"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import { TACC_FIELDS } from "@/lib/data/fields";

const inputClass = "tacc-field min-w-0 flex-1 text-sm sm:min-w-[200px]";

export function ParticipantsTable() {
  const { t, lang } = useLanguage();
  const [q, setQ] = useState("");
  const [fieldRank, setFieldRank] = useState("all");
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const qs = new URLSearchParams();
        if (q.trim()) qs.set("q", q.trim());
        if (fieldRank !== "all") qs.set("fieldRank", fieldRank);
        const res = await fetch(`/api/registrations?${qs}`, { signal: ac.signal });
        const data = await res.json();
        setRows(Array.isArray(data.registrations) ? data.registrations : []);
      } catch {
        if (!ac.signal.aborted) setRows([]);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [q, fieldRank]);

  function regionLabel(code: unknown) {
    if (typeof code !== "string") return "—";
    return code.replace(/_/g, " ");
  }

  function committeePretty(codes: unknown) {
    if (!Array.isArray(codes)) return "—";
    return codes.join(", ");
  }

  return (
    <div className="tacc-shell py-12 sm:py-16">
      <div className="tacc-card p-6 sm:p-8">
        <h1 className="tacc-page-title">{t("part_title")}</h1>
        <p className="mt-2 text-sm text-slate-600">{t("confirmed")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <input
            className={inputClass}
            placeholder={t("filter_search")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className={`tacc-field min-w-[180px] text-sm`} value={fieldRank} onChange={(e) => setFieldRank(e.target.value)}>
            <option value="all">{t("filter_field")}</option>
            {TACC_FIELDS.map((f) => (
              <option key={f.rank} value={String(f.rank)}>
                {f.rank}. {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 inline-flex rounded-xl bg-[#0a1f5c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
          {t("reg_total")} {loading ? "…" : rows.length}
        </div>
      </div>

      <div className="tacc-card mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[#0a1f5c]">
              <th className="p-3.5 font-semibold">ID</th>
              <th className="p-3.5 font-semibold">{t("th_name")}</th>
              <th className="p-3.5 font-semibold">{t("th_field")}</th>
              <th className="p-3.5 font-semibold">{t("th_group")}</th>
              <th className="p-3.5 font-semibold">{t("th_region")}</th>
              <th className="p-3.5 font-semibold">{t("th_committee")}</th>
              <th className="p-3.5 font-semibold">{t("th_cat")}</th>
              <th className="p-3.5 font-semibold">{t("th_date")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.registrationId)} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                <td className="p-3.5 font-mono text-xs text-slate-600">{String(r.registrationId)}</td>
                <td className="p-3.5 font-medium text-slate-900">{String(r.fullName ?? "")}</td>
                <td className="p-3.5 text-xs text-slate-700">{String((r.field as { name?: string })?.name ?? "")}</td>
                <td className="p-3.5 text-xs text-slate-700">{String((r.group as { name?: string })?.name ?? "")}</td>
                <td className="p-3.5 text-xs text-slate-700">{regionLabel(r.regionOfOrigin)}</td>
                <td className="p-3.5 text-xs text-slate-700">{committeePretty(r.committees)}</td>
                <td className="p-3.5 text-xs text-slate-700">{String(r.participantCategory ?? "—")}</td>
                <td className="p-3.5 text-xs text-slate-500">
                  {r.createdAt
                    ? new Date(r.createdAt as string).toLocaleDateString(lang === "fr" ? "fr-CM" : "en-GB")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && (
          <p className="p-10 text-center text-slate-500">No records yet.</p>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/register" className="tacc-btn-navy px-10">
          {t("cta_register")}
        </Link>
      </div>
    </div>
  );
}
