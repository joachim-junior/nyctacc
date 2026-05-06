"use client";

import Link from "next/link";
import { useState } from "react";

import { PaymentModal } from "@/components/payment/PaymentModal";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CommitteeId } from "@/lib/data/committees";
import { CONFERENCE_COMMITTEES } from "@/lib/data/committees";
import { TACC_FIELDS } from "@/lib/data/fields";
import { YOUTH_GROUPS } from "@/lib/data/groups";
import {
  CAMEROON_REGIONS,
  CHURCH_AFFILIATION,
  CHURCH_ROLES,
  PROFESSIONS,
} from "@/lib/form-options";
import { REGISTRATION_FEE_FCFA, formatFcfa } from "@/lib/fees";
import type { RegistrationPayload } from "@/lib/registration-schema";

const IC = "tacc-field";
const LB = "tacc-field-label";

function toggleComm(prev: CommitteeId[], id: CommitteeId): CommitteeId[] {
  let next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
  if (next.length > 2) next = next.slice(-2);
  return next;
}

function toggleRole(arr: string[], v: string) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function BatchRegistration() {
  const { lang, t } = useLanguage();
  const [list, setList] = useState<RegistrationPayload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [lastRefs, setLastRefs] = useState<string[]>([]);

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [maritalStatus, setMaritalStatus] = useState<
    "" | RegistrationPayload["maritalStatus"]
  >("");
  const [regionOfOrigin, setRegionOfOrigin] = useState("");
  const [fieldRank, setFieldRank] = useState<number | "">("");
  const [groupNumber, setGroupNumber] = useState<number | "">("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [email, setEmail] = useState("");
  const [churchAffiliation, setChurchAffiliation] = useState<
    "" | RegistrationPayload["churchAffiliation"]
  >("");
  const [otherChurchDetails, setOtherChurchDetails] = useState("");
  const [churchRoles, setChurchRoles] = useState<string[]>([]);
  const [churchRoleOther, setChurchRoleOther] = useState("");
  const [profession, setProfession] = useState("");
  const [professionOther, setProfessionOther] = useState("");
  const [committees, setCommittees] = useState<CommitteeId[]>([]);
  const [participantCategory, setParticipantCategory] = useState<
    "" | NonNullable<RegistrationPayload["participantCategory"]>
  >("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [mediaConsent, setMediaConsent] = useState<"" | "yes" | "no">("");

  const selField = TACC_FIELDS.find((f) => f.rank === fieldRank);
  const selGroup = YOUTH_GROUPS.find((g) => g.number === groupNumber);

  function validateDraft(): string | null {
    if (!fullName.trim()) return "Name required";
    if (!dateOfBirth) return "Date of birth required";
    if (!gender) return "Gender required";
    if (!maritalStatus) return "Marital status required";
    if (!regionOfOrigin) return "Region required";
    if (fieldRank === "") return "Field required";
    if (groupNumber === "") return "Group required";
    if (!primaryPhone.trim()) return "Phone required";
    if (!churchAffiliation) return "Church affiliation required";
    if (churchAffiliation === "other_denomination" && !otherChurchDetails.trim())
      return "Denomination details required";
    if (!churchRoles.length) return "Select at least one church role";
    if (churchRoles.includes("other") && !churchRoleOther.trim())
      return "Describe ministry role";
    if (!profession) return "Profession required";
    if (profession === "other" && !professionOther.trim())
      return "Describe profession";
    if (committees.length === 0 || committees.length > 2)
      return "Pick 1–2 committees";
    if (!acceptTerms) return "Accept terms";
    if (!mediaConsent) return "Choose media consent";
    return null;
  }

  function addParticipant() {
    setError(null);
    const v = validateDraft();
    if (v) {
      setError(v);
      return;
    }
    if (!selField || !selGroup) return;

    const row: RegistrationPayload = {
      fullName: fullName.trim(),
      dateOfBirth,
      gender,
      maritalStatus,
      regionOfOrigin,
      field: { rank: selField.rank, name: selField.name },
      group: {
        number: selGroup.number,
        name: selGroup.name,
        memberCount: selGroup.memberCount,
      },
      primaryPhone: primaryPhone.trim(),
      email: email.trim() || undefined,
      churchAffiliation,
      otherChurchDetails: otherChurchDetails || undefined,
      churchRoles: churchRoles as RegistrationPayload["churchRoles"],
      churchRoleOther: churchRoleOther || undefined,
      profession,
      professionOther: professionOther || undefined,
      committees,
      acceptTerms: true as const,
      mediaConsent,
      participantCategory: participantCategory || undefined,
    } as RegistrationPayload;

    setList((p) => [...p, row]);
    setFullName("");
    setDateOfBirth("");
    setGender("");
    setParticipantCategory("");
  }

  async function submitBatch() {
    if (!list.length) {
      setError("Add at least one participant.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/register/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants: list }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Could not submit batch.");
        setSubmitting(false);
        return;
      }
      setLastRefs(data.registrationIds ?? []);
      setList([]);
      setPaymentOpen(true);
    } catch {
      setError("Network error");
    }
    setSubmitting(false);
  }

  const totalFcfa = list.length * REGISTRATION_FEE_FCFA;

  return (
    <div className="tacc-shell py-12 sm:py-16">
      <h1 className="tacc-page-title">{t("batch_title")}</h1>
      <p className="mt-2 text-slate-600">{t("batch_sub")}</p>
      <p className="tacc-badge mx-auto mt-4 w-fit">{t("batch_fee")}</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="tacc-card space-y-4 p-6 sm:p-8">
          <h2 className="text-base font-semibold text-[#0a1f5c]">{t("batch_add")}</h2>
          <p className="text-xs text-slate-600">{t("batch_add_sub")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={LB}>Full name</label>
              <input className={`${IC} mt-1`} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className={LB}>DOB</label>
              <input type="date" className={`${IC} mt-1`} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </div>
            <div>
              <label className={LB}>Category</label>
              <select
                className={`${IC} mt-1`}
                value={participantCategory}
                onChange={(e) => {
                  const v = e.target.value;
                  setParticipantCategory(
                    v === ""
                      ? ""
                      : (v as NonNullable<
                          RegistrationPayload["participantCategory"]
                        >),
                  );
                }}
              >
                <option value="">—</option>
                <option value="delegate">Delegate</option>
                <option value="volunteer">Volunteer</option>
                <option value="speaker">Speaker</option>
                <option value="international">International</option>
              </select>
            </div>
            <div>
              <label className={LB}>Gender</label>
              <select className={`${IC} mt-1`} value={gender} onChange={(e) => setGender(e.target.value as typeof gender)}>
                <option value="">—</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className={LB}>Marital</label>
              <select
                className={`${IC} mt-1`}
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value as typeof maritalStatus)}
              >
                <option value="">—</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={LB}>Region</label>
              <select className={`${IC} mt-1`} value={regionOfOrigin} onChange={(e) => setRegionOfOrigin(e.target.value)}>
                <option value="">—</option>
                {CAMEROON_REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LB}>Field</label>
              <select
                className={`${IC} mt-1`}
                value={fieldRank === "" ? "" : String(fieldRank)}
                onChange={(e) => setFieldRank(e.target.value === "" ? "" : Number(e.target.value))}
              >
                <option value="">—</option>
                {TACC_FIELDS.map((f) => (
                  <option key={f.rank} value={f.rank}>{f.rank}. {f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LB}>Group</label>
              <select
                className={`${IC} mt-1`}
                value={groupNumber === "" ? "" : String(groupNumber)}
                onChange={(e) => setGroupNumber(e.target.value === "" ? "" : Number(e.target.value))}
              >
                <option value="">—</option>
                {YOUTH_GROUPS.map((g) => (
                  <option key={g.number} value={g.number}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={LB}>Phone</label>
              <input className={`${IC} mt-1`} value={primaryPhone} onChange={(e) => setPrimaryPhone(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={LB}>Email (optional)</label>
              <input type="email" className={`${IC} mt-1`} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <span className={LB}>Church</span>
              {CHURCH_AFFILIATION.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={churchAffiliation === opt.value}
                    onChange={() => setChurchAffiliation(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {churchAffiliation === "other_denomination" && (
              <div className="sm:col-span-2">
                <label className={LB}>Church & denomination</label>
                <textarea className={`${IC} mt-1`} rows={2} value={otherChurchDetails} onChange={(e) => setOtherChurchDetails(e.target.value)} />
              </div>
            )}
            <div className="sm:col-span-2">
              <span className={LB}>Ministry roles</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {CHURCH_ROLES.map((role) => (
                  <label key={role} className="flex items-center gap-1 text-xs capitalize">
                    <input
                      type="checkbox"
                      checked={churchRoles.includes(role)}
                      onChange={() =>
                        setChurchRoles((p) => toggleRole(p, role))
                      }
                    />
                    {role.replace(/_/g, " ")}
                  </label>
                ))}
              </div>
              {churchRoles.includes("other") && (
                <input className={`${IC} mt-2`} placeholder="Other role" value={churchRoleOther} onChange={(e) => setChurchRoleOther(e.target.value)} />
              )}
            </div>
            <div className="sm:col-span-2">
              <label className={LB}>Profession</label>
              <select className={`${IC} mt-1`} value={profession} onChange={(e) => setProfession(e.target.value)}>
                <option value="">—</option>
                {PROFESSIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {profession === "other" && (
                <input className={`${IC} mt-2`} value={professionOther} onChange={(e) => setProfessionOther(e.target.value)} />
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-[#0a1f5c]">{t("q22")}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {CONFERENCE_COMMITTEES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCommittees((prev) => toggleComm(prev, c.id))}
                    className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                      committees.includes(c.id)
                        ? "border-[#c8980a] bg-amber-50/90 font-semibold text-[#0a1f5c]"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{c.icon}</span>{" "}
                    <span>{lang === "fr" ? c.fr : c.en}</span>
                  </button>
                ))}
              </div>
            </div>
            <label className="sm:col-span-2 flex items-start gap-2 text-sm">
              <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
              I confirm the NYC conduct agreement.
            </label>
            <div className="sm:col-span-2 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" checked={mediaConsent === "yes"} onChange={() => setMediaConsent("yes")} />
                Media consent
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={mediaConsent === "no"} onChange={() => setMediaConsent("no")} />
                No filming
              </label>
            </div>
          </div>
          <button type="button" className="tacc-btn-navy px-8 py-3" onClick={addParticipant}>
            {t("btn_add_batch")}
          </button>
        </div>

        <div className="tacc-card sticky top-24 h-fit space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#0a1f5c]">{t("batch_list")}</h3>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a1f5c] text-xs font-bold text-white">
              {list.length}
            </span>
          </div>
          {list.length === 0 ? (
            <p className="text-center text-sm text-slate-600">{t("batch_empty")}</p>
          ) : (
            <ul className="max-h-[50vh] space-y-2 overflow-y-auto text-sm">
              {list.map((p, idx) => (
                <li key={idx} className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                  <strong>{p.fullName}</strong>
                  <button
                    type="button"
                    className="float-right font-medium text-red-700 hover:text-red-900"
                    onClick={() => setList((x) => x.filter((_, i) => i !== idx))}
                  >
                    ✕
                  </button>
                  <div className="text-xs text-slate-500">{p.field.name}</div>
                </li>
              ))}
            </ul>
          )}
          {list.length > 0 && (
            <>
              <div className="rounded-xl bg-[#0a1f5c] p-4 text-center text-white shadow-md">
                <div className="text-2xl font-bold text-[#f0d078]">{formatFcfa(totalFcfa, lang)}</div>
                <div className="text-xs opacity-80">
                  {list.length} × {formatFcfa(REGISTRATION_FEE_FCFA, lang)}
                </div>
              </div>
              <button
                type="button"
                disabled={submitting}
                className="tacc-btn-navy w-full py-3 disabled:opacity-50"
                onClick={() => void submitBatch()}
              >
                {t("btn_submit_batch")}
              </button>
            </>
          )}
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amountFcfa={
          lastRefs.length * REGISTRATION_FEE_FCFA || REGISTRATION_FEE_FCFA
        }
        personCount={Math.max(1, lastRefs.length)}
        referenceLabel={
          lastRefs.length === 1
            ? lastRefs[0]
            : lastRefs.length > 0
              ? `${lastRefs.length} registrations (${lastRefs.slice(0, 3).join(", ")}${lastRefs.length > 3 ? ", …" : ""})`
              : "—"
        }
        externalId={
          lastRefs.length ? lastRefs.slice(0, 12).join("_").slice(0, 100) : undefined
        }
        email={email.trim() || undefined}
        payerName={fullName.trim() || undefined}
      />

      <div className="mt-10 text-center text-sm">
        <Link
          href="/register"
          className="font-medium text-[#0a1f5c] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0a1f5c]"
        >
          {t("nav_register")}
        </Link>
      </div>
    </div>
  );
}
