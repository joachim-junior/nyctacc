"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { TACC_FIELDS } from "@/lib/data/fields";
import { YOUTH_GROUPS } from "@/lib/data/groups";
import {
  AGE_GROUPS,
  CAMEROON_REGIONS,
  CHURCH_AFFILIATION,
  CHURCH_ROLES,
  COMMITTEES,
  EDUCATION_LEVELS,
  PROFESSIONS,
  YEARS_IN_ASSEMBLY,
} from "@/lib/form-options";
import type { RegistrationPayload } from "@/lib/registration-schema";
import { committeeValues } from "@/lib/registration-schema";

const STEPS = [
  "You & your field",
  "Contact & group",
  "Church life",
  "Study, work & conference",
  "Prayer & consent",
  "Review",
] as const;

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

const labelClass =
  "mb-1 block text-sm font-medium text-[var(--tacc-ink)]";
const inputClass =
  "w-full rounded-lg border border-[var(--tacc-border)] bg-white px-3 py-2 text-sm text-[var(--tacc-ink)] shadow-sm outline-none transition focus:border-[var(--tacc-primary)] focus:ring-2 focus:ring-[var(--tacc-primary)]/20";
const sectionTitle = "text-lg font-semibold text-[var(--tacc-ink)]";

function FieldSet({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3 rounded-2xl border border-[var(--tacc-border)] bg-white/80 p-4 shadow-sm">
      <legend className={`${sectionTitle} px-1`}>{legend}</legend>
      {children}
    </fieldset>
  );
}

export function RegistrationWizard() {
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
  const [committees, setCommittees] = useState<string[]>([]);
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

  function toggleCommittee(value: (typeof committeeValues)[number]) {
    setCommittees((prev) => {
      const withoutNone = prev.filter((c) => c !== "none");
      if (value === "none") {
        return prev.includes("none") ? [] : ["none"];
      }
      let next = withoutNone.includes(value)
        ? withoutNone.filter((c) => c !== value)
        : [...withoutNone, value];
      if (next.length > 2) {
        next = next.slice(-2);
      }
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
      const hasNone = committees.includes("none");
      const specific = committees.filter((c) => c !== "none");
      if (!hasNone && specific.length === 0) {
        errs.push(
          'Pick one or two committees, or tick "No preference"',
        );
      }
      if (hasNone && specific.length) {
        errs.push('"No preference" cannot mix with another choice');
      }
      if (!hasNone && specific.length > 2) {
        errs.push("Pick at most two committees");
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
      email: email.trim(),
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
      committees: committees.filter(Boolean) as RegistrationPayload["committees"],
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
    } catch {
      setError("Network error. Try again shortly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (resultId) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-[var(--tacc-border)] bg-white p-8 text-center shadow-lg">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--tacc-muted)]">
          Registration captured
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--tacc-ink)]">
          Thank you — you’re on the list
        </h2>
        <p className="mt-4 text-[var(--tacc-muted)]">
          Reference for payment and enquiries:
        </p>
        <p className="mt-2 rounded-xl bg-[var(--tacc-cream)] py-4 text-xl font-semibold tracking-wide text-[var(--tacc-primary)]">
          {resultId}
        </p>
        <p className="mt-6 text-sm text-[var(--tacc-muted)]">
          Payment via Fapshi will be connected on the next milestone. Until
          then, organisers can reconcile every submission in Atlas using this
          ID.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--tacc-border)] bg-white/90 px-4 py-3 shadow-sm">
        <span className="text-sm font-medium text-[var(--tacc-muted)]">
          Step {step + 1} of {STEPS.length}
        </span>
        <span className="text-sm font-semibold text-[var(--tacc-ink)]">
          {STEPS[step]}
        </span>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

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
                        className="text-[var(--tacc-primary)]"
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
          </FieldSet>

          <FieldSet legend="Your TACC field">
            <p className="text-sm text-[var(--tacc-muted)]">
              Choose the field you belong to. Order follows the national
              ranking supplied by TACC.
            </p>
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

          <FieldSet legend="Your youth group">
            <p className="text-sm text-[var(--tacc-muted)]">
              Select the group you belong to. Member counts are estimates for
              planning.
            </p>
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
            <div className="mt-2 space-y-2 text-sm">
              {CHURCH_AFFILIATION.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-start gap-2 rounded-lg border border-transparent px-2 py-1 hover:bg-[var(--tacc-cream)]"
                >
                  <input
                    type="radio"
                    name="church"
                    checked={churchAffiliation === opt.value}
                    onChange={() => setChurchAffiliation(opt.value)}
                    className="mt-1"
                  />
                  <span>{opt.label}</span>
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

          <FieldSet legend="Ministry roles">
            <p className="text-sm text-[var(--tacc-muted)]">
              Tick every role that applies today.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {CHURCH_ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 text-sm capitalize"
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

          <FieldSet legend="Conference service">
            <p className="text-sm text-[var(--tacc-muted)]">
              Pick one or two departments, or tick “No preference”.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {COMMITTEES.map((c) => (
                <label
                  key={c.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={committees.includes(c.value)}
                    onChange={() =>
                      toggleCommittee(
                        c.value as (typeof committeeValues)[number],
                      )
                    }
                  />
                  {c.label}
                </label>
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
              <p className="mb-2 text-xs text-[var(--tacc-muted)]">
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
        <div className="space-y-4 rounded-2xl border border-[var(--tacc-border)] bg-white/90 p-6 shadow-sm">
          <h3 className={sectionTitle}>Review</h3>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--tacc-muted)]">Name</dt>
              <dd className="font-medium">{fullName}</dd>
            </div>
            <div>
              <dt className="text-[var(--tacc-muted)]">Field</dt>
              <dd className="font-medium">{selectedField?.name}</dd>
            </div>
            <div>
              <dt className="text-[var(--tacc-muted)]">Group</dt>
              <dd className="font-medium">{selectedGroup?.name}</dd>
            </div>
            <div>
              <dt className="text-[var(--tacc-muted)]">Phone</dt>
              <dd className="font-medium">{primaryPhone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[var(--tacc-muted)]">Church</dt>
              <dd className="font-medium capitalize">
                {churchAffiliation.replace(/_/g, " ")}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-[var(--tacc-muted)]">
            Need to tweak something? Use Back to walk through the earlier
            sections.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--tacc-border)] pt-4">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 || submitting}
          className="rounded-full border border-[var(--tacc-border)] px-5 py-2 text-sm font-medium text-[var(--tacc-ink)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        {step < 5 ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-full bg-[var(--tacc-primary)] px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-full bg-[var(--tacc-accent)] px-6 py-2 text-sm font-semibold text-[var(--tacc-ink)] shadow-md transition hover:opacity-95 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit registration"}
          </button>
        )}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-[var(--tacc-border)] bg-black shadow-2xl">
      <Image
        src="/hero.jpeg"
        alt="TACC National Youth Conference"
        width={1600}
        height={900}
        className="h-[min(420px,55vh)] w-full object-cover opacity-90"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--tacc-gold)]">
            The Apostolic Church Cameroon
          </p>
          <h1 className="mt-2 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            National Youth Conference 2026
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/85">
            Yaoundé • July 2026 — gather with thousands of young disciples for
            worship, formation, and mission.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
          <Image
            src="/logo.jpeg"
            alt="TACC logo"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--tacc-gold)]"
          />
          <div className="text-xs text-white/90">
            <p className="font-semibold">Register online</p>
            <p className="text-white/70">tacc.nationalyouth@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
