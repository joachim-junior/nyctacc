"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PaymentModal } from "@/components/payment/PaymentModal";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CommitteeId } from "@/lib/data/committees";
import { CONFERENCE_COMMITTEES } from "@/lib/data/committees";
import { TACC_FIELDS } from "@/lib/data/fields";
import { YOUTH_GROUPS } from "@/lib/data/groups";
import {
  AGE_GROUPS,
  CAMEROON_REGIONS,
  CHURCH_AFFILIATION,
  CHURCH_ROLES,
  EDUCATION_LEVELS,
  PROFESSIONS,
  YEARS_IN_ASSEMBLY,
} from "@/lib/form-options";
import { REGISTRATION_FEE_FCFA } from "@/lib/fees";
import type { TranslationKey } from "@/lib/i18n/translations";
import type { RegistrationPayload } from "@/lib/registration-schema";

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

const labelClass = "tacc-field-label";
const inputClass = "tacc-field";

function FieldSet({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="tacc-card p-6 sm:p-8">
      <header className="mb-6 border-b border-slate-100 pb-5">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold tracking-tight text-[#0a1f5c] sm:text-xl">
          {legend}
        </h3>
        {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
export function RegistrationWizard() {
  const { lang, t } = useLanguage();
  const STEP_KEYS = [
    "wizard_step_you",
    "wizard_step_contact",
    "wizard_step_church",
    "wizard_step_pro",
    "wizard_step_spirit",
    "wizard_step_review",
  ] as const satisfies readonly TranslationKey[];
  const [step, setStep] = useState<StepIndex>(0);
  const [submitting, setSubmitting] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [maritalStatus, setMaritalStatus] = useState<
    "" | "single" | "married" | "widowed" | "divorced"
  >("");
  const [regionOfOrigin, setRegionOfOrigin] = useState("");
  const [townCity, setTownCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [fieldRank, setFieldRank] = useState<number | "">("");

  const [primaryPhone, setPrimaryPhone] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [groupNumber, setGroupNumber] = useState<number | "">("");

  const [churchAffiliation, setChurchAffiliation] = useState<
    "" | "tacc" | "other_denomination" | "not_member"
  >("");
  const [taccAssemblyDetails, setTaccAssemblyDetails] = useState("");
  const [otherChurchDetails, setOtherChurchDetails] = useState("");
  const [churchRoles, setChurchRoles] = useState<string[]>([]);
  const [churchRoleOther, setChurchRoleOther] = useState("");
  const [yearsInAssembly, setYearsInAssembly] = useState("");

  const [educationLevel, setEducationLevel] = useState("");
  const [profession, setProfession] = useState("");
  const [professionOther, setProfessionOther] = useState("");
  const [committees, setCommittees] = useState<CommitteeId[]>([]);
  const [skillsContribution, setSkillsContribution] = useState("");
  const [accommodation, setAccommodation] = useState<
    "" | "yes" | "no" | "unsure"
  >("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [dietaryOther, setDietaryOther] = useState("");

  const [prayerRequest, setPrayerRequest] = useState("");
  const [believingGodFor, setBelievingGodFor] = useState("");
  const [leadershipTraining, setLeadershipTraining] = useState<
    "" | "yes" | "maybe_topic" | "not_now"
  >("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [mediaConsent, setMediaConsent] = useState<"" | "yes" | "no">("");
  const [participantCategory, setParticipantCategory] = useState<
    "" | NonNullable<RegistrationPayload["participantCategory"]>
  >("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const selectedField = useMemo(
    () => TACC_FIELDS.find((f) => f.rank === fieldRank),
    [fieldRank],
  );
  const selectedGroup = useMemo(
    () => YOUTH_GROUPS.find((g) => g.number === groupNumber),
    [groupNumber],
  );

  function toggleRole(value: string) {
    setChurchRoles((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value],
    );
  }

  function toggleDiet(value: string) {
    setDietary((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value],
    );
  }

  function toggleCommittee(id: CommitteeId) {
    setCommittees((prev) => {
      let next = prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id];
      if (next.length > 2) next = next.slice(-2);
      return next;
    });
  }

  function stepErrors(s: StepIndex): string[] {
    const errs: string[] = [];
    if (s === 0) {
      if (!fullName.trim()) errs.push("Full name is required");
      if (!dateOfBirth) errs.push("Date of birth is required");
      if (!gender) errs.push("Select gender");
      if (!maritalStatus) errs.push("Select marital status");
      if (!regionOfOrigin) errs.push("Select region of origin");
      if (fieldRank === "") errs.push("Select your TACC field");
    }
    if (s === 1) {
      if (!primaryPhone.trim()) errs.push("Primary phone is required");
      if (groupNumber === "") errs.push("Select your youth group");
    }
    if (s === 2) {
      if (!churchAffiliation) errs.push("Select church affiliation");
      if (churchAffiliation === "other_denomination" && !otherChurchDetails.trim()) {
        errs.push("Tell us about your denomination");
      }
      if (!churchRoles.length) errs.push("Pick at least one church role");
      if (churchRoles.includes("other") && !churchRoleOther.trim()) {
        errs.push("Describe the “other” role");
      }
    }
    if (s === 3) {
      if (!profession) errs.push("Select profession");
      if (profession === "other" && !professionOther.trim()) {
        errs.push("Describe your profession");
      }
      if (committees.length === 0 || committees.length > 2) {
        errs.push("Pick one or two committees");
      }
      if (new Set(committees).size !== committees.length) {
        errs.push("Duplicate committees selected");
      }
    }
    if (s === 4) {
      if (!acceptTerms) errs.push("Confirm the participant agreement");
      if (!mediaConsent) errs.push("Choose a media consent option");
    }
    return errs;
  }

  function goNext() {
    const errs = stepErrors(step);
    if (errs.length) {
      setError(errs[0]);
      return;
    }
    setError(null);
    setStep((v) => (v < 5 ? ((v + 1) as StepIndex) : v));
  }

  function goBack() {
    setError(null);
    setStep((v) => (v > 0 ? ((v - 1) as StepIndex) : v));
  }

  async function handleSubmit() {
    for (let s = 0; s <= 4; s++) {
      const errs = stepErrors(s as StepIndex);
      if (errs.length) {
        setError(errs[0]);
        setStep(s as StepIndex);
        return;
      }
    }
    if (!selectedField || !selectedGroup) {
      setError("Field and group selection are incomplete");
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      dateOfBirth,
      ageGroup: ageGroup || undefined,
      gender,
      maritalStatus,
      regionOfOrigin,
      townCity: townCity || undefined,
      fullAddress: fullAddress || undefined,
      field: { rank: selectedField.rank, name: selectedField.name },
      primaryPhone: primaryPhone.trim(),
      alternativePhone: alternativePhone.trim() || undefined,
      email: email.trim() || undefined,
      emergencyContactName: emergencyContactName || undefined,
      emergencyContactPhone: emergencyContactPhone || undefined,
      group: {
        number: selectedGroup.number,
        name: selectedGroup.name,
        memberCount: selectedGroup.memberCount,
      },
      churchAffiliation,
      taccAssemblyDetails: taccAssemblyDetails || undefined,
      otherChurchDetails: otherChurchDetails || undefined,
      churchRoles: churchRoles as RegistrationPayload["churchRoles"],
      churchRoleOther: churchRoleOther || undefined,
      yearsInAssembly: yearsInAssembly || undefined,
      educationLevel: educationLevel || undefined,
      profession,
      professionOther: professionOther || undefined,
      committees,
      participantCategory: participantCategory || undefined,
      skillsContribution: skillsContribution || undefined,
      accommodation: accommodation || undefined,
      dietary: dietary.length ? dietary : undefined,
      dietaryOther: dietaryOther || undefined,
      prayerRequest: prayerRequest || undefined,
      believingGodFor: believingGodFor || undefined,
      leadershipTraining: leadershipTraining || undefined,
      acceptTerms: true as const,
      mediaConsent,
    } as RegistrationPayload;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not submit. Please check your answers.",
        );
        setSubmitting(false);
        return;
      }
      setResultId(data.registrationId as string);
      setPaymentOpen(true);
    } catch {
      setError("Network error. Try again shortly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (resultId) {
    return (
      <>
        <PaymentModal
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          amountFcfa={REGISTRATION_FEE_FCFA}
          personCount={1}
          referenceLabel={resultId}
          email={email.trim() || undefined}
          payerName={fullName.trim() || undefined}
        />
        <div className="tacc-card mx-auto max-w-lg border-t-4 border-[#c8980a] p-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            {t("success_title")}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#0a1f5c]">
            {t("success_sub")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{t("success_msg")}</p>
          <p className="mt-6 rounded-xl border border-amber-100 bg-amber-50/80 py-4 font-mono text-lg font-semibold tracking-wide text-[#0a1f5c]">
            {resultId}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/participants" className="tacc-btn-navy px-8">
              {t("btn_view_list")}
            </Link>
            <Link href="/" className="tacc-btn-ghost px-8">
              {t("btn_done")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 lg:max-w-[52rem]">
      <header className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#c8980a]">
          TACC NYC · 2026
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-[1.65rem] font-semibold tracking-tight text-[#0a1f5c] sm:text-3xl md:text-[2.125rem]">
          {t("reg_title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600">
          {t("reg_sub")}
        </p>
        <p className="tacc-badge mx-auto mt-8">{t("reg_fee")}</p>
      </header>

      <section className="tacc-card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Step {step + 1} / {STEP_KEYS.length}
            </p>
            <p className="mt-1 text-lg font-semibold text-[#0a1f5c]">{t(STEP_KEYS[step])}</p>
          </div>
          <ol className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            {STEP_KEYS.map((_, i) => (
              <li key={i} className="flex items-center gap-2">
                <span
                  className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-full text-[13px] font-bold tabular-nums transition ${
                    i < step
                      ? "bg-[#0a1f5c] text-white shadow-sm"
                      : i === step
                        ? "border-2 border-[#c8980a] bg-white text-[#0a1f5c] shadow-inner"
                        : "border border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
                {i < STEP_KEYS.length - 1 ? (
                  <span
                    aria-hidden
                    className={`hidden h-0.5 w-6 sm:inline-block ${
                      i < step ? "bg-[#0a1f5c]" : "bg-slate-200"
                    }`}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {error ? (
        <div className="tacc-alert" role="alert">
          {error}
        </div>
      ) : null}

      {step === 0 && (
        <div className="space-y-6">
          <FieldSet legend="Personal information">
            <div>
              <label className={labelClass} htmlFor="fullName">
                Full name (surname first)
              </label>
              <input
                id="fullName"
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="dob">
                  Date of birth
                </label>
                <input
                  id="dob"
                  type="date"
                  className={inputClass}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="age">
                  Age group (optional)
                </label>
                <select
                  id="age"
                  className={inputClass}
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                >
                  <option value="">Select</option>
                  {AGE_GROUPS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className={labelClass}>Gender</span>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  {(["male", "female"] as const).map((g) => (
                    <label key={g} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === g}
                        onChange={() => setGender(g)}
                        className="text-[#0a1f5c]"
                      />
                      {g === "male" ? "Male" : "Female"}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="marital">
                  Marital status
                </label>
                <select
                  id="marital"
                  className={inputClass}
                  value={maritalStatus}
                  onChange={(e) =>
                    setMaritalStatus(
                      e.target.value as typeof maritalStatus,
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="divorced">Divorced</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="region">
                Region of origin
              </label>
              <select
                id="region"
                className={inputClass}
                value={regionOfOrigin}
                onChange={(e) => setRegionOfOrigin(e.target.value)}
              >
                <option value="">Select</option>
                {CAMEROON_REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="town">
                Town / city (optional)
              </label>
              <input
                id="town"
                className={inputClass}
                value={townCity}
                onChange={(e) => setTownCity(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="addr">
                Full address (optional)
              </label>
              <textarea
                id="addr"
                rows={3}
                className={inputClass}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="pcat">
                {t("th_cat")} ({lang === "fr" ? "facultatif" : "optional"})
              </label>
              <select
                id="pcat"
                className={inputClass}
                value={participantCategory}
                onChange={(e) =>
                  setParticipantCategory(
                    e.target.value === ""
                      ? ""
                      : (e.target.value as NonNullable<
                          RegistrationPayload["participantCategory"]
                        >),
                  )
                }
              >
                <option value="">—</option>
                <option value="delegate">Delegate</option>
                <option value="volunteer">Volunteer</option>
                <option value="speaker">Speaker</option>
                <option value="international">International</option>
              </select>
            </div>
          </FieldSet>

          <FieldSet
            legend="Your TACC field"
            hint="Choose the field you belong to. Order follows the national ranking supplied by TACC."
          >
            <div>
              <label className={labelClass} htmlFor="field">
                Field
              </label>
              <select
                id="field"
                className={inputClass}
                value={fieldRank === "" ? "" : String(fieldRank)}
                onChange={(e) =>
                  setFieldRank(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              >
                <option value="">Select field…</option>
                {TACC_FIELDS.map((f) => (
                  <option key={f.rank} value={f.rank}>
                    {f.rank}. {f.name}
                  </option>
                ))}
              </select>
            </div>
          </FieldSet>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <FieldSet legend="Contact details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="phone">
                  Primary phone (WhatsApp if possible)
                </label>
                <input
                  id="phone"
                  className={inputClass}
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="altphone">
                  Alternative phone (optional)
                </label>
                <input
                  id="altphone"
                  className={inputClass}
                  value={alternativePhone}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="email">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="ecname">
                Emergency contact name (optional)
              </label>
              <input
                id="ecname"
                className={inputClass}
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="ecphone">
                Emergency contact phone (optional)
              </label>
              <input
                id="ecphone"
                className={inputClass}
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
              />
            </div>
          </FieldSet>

          <FieldSet
            legend="Your youth group"
            hint="Select the group you belong to. Member counts are estimates for planning."
          >
            <div>
              <label className={labelClass} htmlFor="group">
                Group
              </label>
              <select
                id="group"
                className={inputClass}
                value={groupNumber === "" ? "" : String(groupNumber)}
                onChange={(e) =>
                  setGroupNumber(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              >
                <option value="">Select group…</option>
                {YOUTH_GROUPS.map((g) => (
                  <option key={g.number} value={g.number}>
                    {g.name} (~{g.memberCount} youths)
                  </option>
                ))}
              </select>
            </div>
          </FieldSet>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <FieldSet legend="Church affiliation">
            <span className={labelClass}>Current status</span>
            <div className="mt-3 space-y-2 text-sm">
              {CHURCH_AFFILIATION.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:border-slate-300 hover:bg-slate-50 ${
                    churchAffiliation === opt.value
                      ? "border-[#0a1f5c] bg-slate-50 ring-4 ring-[#0a1f5c]/[0.06]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="church"
                    checked={churchAffiliation === opt.value}
                    onChange={() => setChurchAffiliation(opt.value)}
                    className="mt-0.5"
                  />
                  <span className="text-slate-800">{opt.label}</span>
                </label>
              ))}
            </div>
            {churchAffiliation === "tacc" && (
              <div>
                <label className={labelClass} htmlFor="assembly">
                  Assembly name & location (optional)
                </label>
                <textarea
                  id="assembly"
                  rows={2}
                  className={inputClass}
                  value={taccAssemblyDetails}
                  onChange={(e) => setTaccAssemblyDetails(e.target.value)}
                  placeholder="e.g. Living Faith Assembly, Bastos"
                />
              </div>
            )}
            {churchAffiliation === "other_denomination" && (
              <div>
                <label className={labelClass} htmlFor="otherch">
                  Church & denomination
                </label>
                <textarea
                  id="otherch"
                  rows={2}
                  className={inputClass}
                  value={otherChurchDetails}
                  onChange={(e) => setOtherChurchDetails(e.target.value)}
                />
              </div>
            )}
          </FieldSet>

          <FieldSet
            legend="Ministry roles"
            hint="Tick every role that applies today."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {CHURCH_ROLES.map((role) => (
                <label
                  key={role}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm capitalize transition hover:border-slate-300 ${
                    churchRoles.includes(role)
                      ? "border-[#0a1f5c]/30 bg-slate-50"
                      : "border-transparent bg-slate-50/70"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={churchRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                  {role.replace(/_/g, " ")}
                </label>
              ))}
            </div>
            {churchRoles.includes("other") && (
              <div>
                <label className={labelClass} htmlFor="roleother">
                  Describe “other”
                </label>
                <input
                  id="roleother"
                  className={inputClass}
                  value={churchRoleOther}
                  onChange={(e) => setChurchRoleOther(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className={labelClass} htmlFor="years">
                Years in present assembly (optional)
              </label>
              <select
                id="years"
                className={inputClass}
                value={yearsInAssembly}
                onChange={(e) => setYearsInAssembly(e.target.value)}
              >
                <option value="">Select</option>
                {YEARS_IN_ASSEMBLY.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldSet>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <FieldSet legend="Education & profession">
            <div>
              <label className={labelClass} htmlFor="edu">
                Highest education (optional)
              </label>
              <select
                id="edu"
                className={inputClass}
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
              >
                <option value="">Select</option>
                {EDUCATION_LEVELS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="prof">
                Profession
              </label>
              <select
                id="prof"
                className={inputClass}
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              >
                <option value="">Select</option>
                {PROFESSIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {profession === "other" && (
              <div>
                <label className={labelClass} htmlFor="profother">
                  Describe your profession
                </label>
                <input
                  id="profother"
                  className={inputClass}
                  value={professionOther}
                  onChange={(e) => setProfessionOther(e.target.value)}
                />
              </div>
            )}
          </FieldSet>

          <FieldSet legend="Conference service" hint={t("q22")}>
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-900">{t("comm_warn")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CONFERENCE_COMMITTEES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCommittee(c.id)}
                  className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                    committees.includes(c.id)
                      ? "border-[#c8980a] bg-amber-50/90 font-semibold text-[#0a1f5c] shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{lang === "fr" ? c.fr : c.en}</span>
                </button>
              ))}
            </div>
            <div>
              <label className={labelClass} htmlFor="skills">
                Skills you can contribute (optional)
              </label>
              <textarea
                id="skills"
                rows={3}
                className={inputClass}
                value={skillsContribution}
                onChange={(e) => setSkillsContribution(e.target.value)}
              />
            </div>
            <div>
              <span className={labelClass}>Accommodation need</span>
              <div className="mt-2 space-y-2 text-sm">
                {(
                  [
                    ["yes", "Yes, I need accommodation"],
                    ["no", "No, I have my own"],
                    ["unsure", "Not sure yet"],
                  ] as const
                ).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="acc"
                      checked={accommodation === val}
                      onChange={() => setAccommodation(val)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <span className={labelClass}>Dietary notes (optional)</span>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 text-sm">
                {[
                  ["none", "No restrictions"],
                  ["vegetarian", "Vegetarian"],
                  ["medical", "Medical need (describe below)"],
                  ["other", "Other (describe below)"],
                ].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dietary.includes(val)}
                      onChange={() => toggleDiet(val)}
                    />
                    {label}
                  </label>
                ))}
              </div>
              {(dietary.includes("medical") || dietary.includes("other")) && (
                <textarea
                  rows={2}
                  className={`${inputClass} mt-2`}
                  placeholder="Details for kitchen & welfare teams"
                  value={dietaryOther}
                  onChange={(e) => setDietaryOther(e.target.value)}
                />
              )}
            </div>
          </FieldSet>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <FieldSet legend="Prayer & expectations">
            <div>
              <label className={labelClass} htmlFor="prayer">
                Private prayer request (optional, treated confidentially)
              </label>
              <textarea
                id="prayer"
                rows={4}
                className={inputClass}
                value={prayerRequest}
                onChange={(e) => setPrayerRequest(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="believe">
                What are you trusting God for? (optional)
              </label>
              <textarea
                id="believe"
                rows={3}
                className={inputClass}
                value={believingGodFor}
                onChange={(e) => setBelievingGodFor(e.target.value)}
              />
            </div>
            <div>
              <span className={labelClass}>
                Open to leadership / discipleship sessions?
              </span>
              <div className="mt-2 space-y-2 text-sm">
                {(
                  [
                    ["yes", "Yes, absolutely"],
                    ["maybe_topic", "Yes, topic depending"],
                    ["not_now", "Not right now"],
                  ] as const
                ).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="lead"
                      checked={leadershipTraining === val}
                      onChange={() => setLeadershipTraining(val)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </FieldSet>

          <FieldSet legend="Agreements">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
              />
              <span>
                I confirm my answers are truthful and agree to honour the NYC
                code of conduct and the direction of conference leadership.
              </span>
            </label>
            <div className="mt-4">
              <span className={labelClass}>Media consent</span>
              <p className="mb-2 text-xs text-slate-500">
                Official photography / video for TACC NYC channels.
              </p>
              <div className="space-y-2 text-sm">
                {(
                  [
                    ["yes", "Yes, you may include me"],
                    ["no", "No, please keep me off camera"],
                  ] as const
                ).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="media"
                      checked={mediaConsent === val}
                      onChange={() => setMediaConsent(val)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </FieldSet>
        </div>
      )}

      {step === 5 && (
        <div className="tacc-card p-8">
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#0a1f5c]">
            Review
          </h3>
          <dl className="mt-8 grid gap-5 text-sm sm:grid-cols-2">
            <div className="border-b border-slate-100 pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</dt>
              <dd className="mt-1 font-medium text-slate-900">{fullName}</dd>
            </div>
            <div className="border-b border-slate-100 pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Field</dt>
              <dd className="mt-1 font-medium text-slate-900">{selectedField?.name}</dd>
            </div>
            <div className="border-b border-slate-100 pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Group</dt>
              <dd className="mt-1 font-medium text-slate-900">{selectedGroup?.name}</dd>
            </div>
            <div className="border-b border-slate-100 pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</dt>
              <dd className="mt-1 font-medium text-slate-900">{primaryPhone}</dd>
            </div>
            <div className="border-b border-slate-100 pb-4 sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Church</dt>
              <dd className="mt-1 font-medium capitalize text-slate-900">
                {churchAffiliation.replace(/_/g, " ")}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-slate-600">
            Need to tweak something? Use Back to walk through the earlier sections.
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 || submitting}
          className="tacc-btn-ghost disabled:pointer-events-none disabled:opacity-40 sm:min-w-[7rem]"
        >
          Back
        </button>
        {step < 5 ? (
          <button
            type="button"
            onClick={goNext}
            className="tacc-btn-navy px-10 sm:min-w-[10rem]"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="tacc-btn-gold px-10 font-bold disabled:cursor-wait disabled:opacity-60 sm:min-w-[12rem]"
          >
            {submitting ? "Submitting…" : "Submit registration"}
          </button>
        )}
      </div>
    </div>
  );
}
