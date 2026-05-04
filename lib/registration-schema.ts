import { z } from "zod";
import { TACC_FIELDS } from "@/lib/data/fields";
import { YOUTH_GROUPS } from "@/lib/data/groups";

const ranks = new Set(TACC_FIELDS.map((f) => f.rank));
const groupNumbers = new Set(YOUTH_GROUPS.map((g) => g.number));

export const committeeValues = [
  "prayer",
  "worship",
  "evangelism",
  "hospitality",
  "media",
  "photo_video",
  "ushering",
  "teaching",
  "leadership",
  "charity",
  "health",
  "logistics",
  "finance",
  "youth_children",
  "none",
] as const;

const churchRoleValues = [
  "member",
  "deacon",
  "elder",
  "choir",
  "praise_worship",
  "cell_leader",
  "sunday_school",
  "youth_leader",
  "evangelist",
  "pastor",
  "prayer_team",
  "usher",
  "media",
  "womens_ministry",
  "mens_fellowship",
  "no_function",
  "other",
] as const;

export const RegistrationPayloadSchema = z
  .object({
    fullName: z.string().min(2),
    dateOfBirth: z.string().min(8),
    ageGroup: z.string().optional(),
    gender: z.enum(["male", "female"]),
    maritalStatus: z.enum(["single", "married", "widowed", "divorced"]),
    regionOfOrigin: z.string().min(1),
    townCity: z.string().optional(),
    fullAddress: z.string().optional(),
    field: z.object({
      rank: z.number().int().min(1).max(99),
      name: z.string().min(1),
    }),
    primaryPhone: z.string().min(6),
    alternativePhone: z.string().optional(),
    email: z
      .preprocess(
        (v) => (v === "" || v === undefined ? undefined : v),
        z.string().email().optional(),
      ),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    group: z.object({
      number: z.number().int().min(1).max(999),
      name: z.string().min(1),
      memberCount: z.number().int().min(0).optional(),
    }),
    churchAffiliation: z.enum(["tacc", "other_denomination", "not_member"]),
    taccAssemblyDetails: z.string().optional(),
    otherChurchDetails: z.string().optional(),
    churchRoles: z.array(z.enum(churchRoleValues)).min(1),
    churchRoleOther: z.string().optional(),
    yearsInAssembly: z.string().optional(),
    educationLevel: z.string().optional(),
    profession: z.string().min(1),
    professionOther: z.string().optional(),
    committees: z.array(z.enum(committeeValues)).max(2),
    skillsContribution: z.string().optional(),
    accommodation: z.enum(["yes", "no", "unsure"]).optional(),
    dietary: z.array(z.string()).optional(),
    dietaryOther: z.string().optional(),
    prayerRequest: z.string().optional(),
    believingGodFor: z.string().optional(),
    leadershipTraining: z.enum(["yes", "maybe_topic", "not_now"]).optional(),
    acceptTerms: z.literal(true),
    mediaConsent: z.enum(["yes", "no"]),
  })
  .superRefine((data, ctx) => {
    if (!ranks.has(data.field.rank)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid field rank",
        path: ["field", "rank"],
      });
    }
    const expected = TACC_FIELDS.find((f) => f.rank === data.field.rank);
    if (expected && expected.name !== data.field.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Field label does not match rank",
        path: ["field", "name"],
      });
    }
    if (!groupNumbers.has(data.group.number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid group",
        path: ["group", "number"],
      });
    }
    const g = YOUTH_GROUPS.find((x) => x.number === data.group.number);
    if (g && g.name !== data.group.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Group label does not match number",
        path: ["group", "name"],
      });
    }

    const hasOtherDenom = data.churchAffiliation === "other_denomination";
    if (
      hasOtherDenom &&
      !(data.otherChurchDetails?.trim().length ?? 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tell us about your church and denomination",
        path: ["otherChurchDetails"],
      });
    }

    const hasNonePref = data.committees.includes("none");
    const specific = data.committees.filter((c) => c !== "none");
    if (hasNonePref && specific.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "\"No preference\" cannot be combined with another option",
        path: ["committees"],
      });
    }
    if (!hasNonePref && specific.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pick one or two departments (or \"No preference\")",
        path: ["committees"],
      });
    }
    if (!hasNonePref && specific.length > 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pick at most two departments",
        path: ["committees"],
      });
    }

    if (data.churchRoles.includes("other") && !(data.churchRoleOther?.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Describe your ministry role",
        path: ["churchRoleOther"],
      });
    }
    if (data.profession === "other" && !(data.professionOther?.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Describe your profession",
        path: ["professionOther"],
      });
    }
  });

export type RegistrationPayload = z.infer<typeof RegistrationPayloadSchema>;
