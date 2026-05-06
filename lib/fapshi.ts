/** Fapshi helpers — credentials must never touch the browser. See https://docs.fapshi.com */

const LIVE_BASE = "https://live.fapshi.com";
const SANDBOX_BASE = "https://sandbox.fapshi.com";

export type FapshiEnvConfig = {
  apiUser: string;
  apiKey: string;
  baseUrl: string;
};

/** Returns null if integration is disabled (missing env). */
export function getFapshiEnvConfig(): FapshiEnvConfig | null {
  const apiUser = process.env.FAPSHI_API_USER?.trim();
  const apiKey = process.env.FAPSHI_API_KEY?.trim();
  if (!apiUser || !apiKey) return null;

  const mode = process.env.FAPSHI_MODE?.toLowerCase();
  const explicit = process.env.FAPSHI_BASE_URL?.trim();
  const baseUrl =
    explicit ||
    (mode === "sandbox" || mode === "test" ? SANDBOX_BASE : LIVE_BASE);

  return { apiUser, apiKey, baseUrl };
}

/** Fapshi `externalId` / `userId`: [a-zA-Z0-9_-]{1,100} */
export function sanitizeExternalId(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  const s = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 100);
  return s.length ? s : undefined;
}

/** Cameroon mobile: 9 digits, leading 6 (MTN / Orange prefixes). Strips +237 / 237. */
export function normalizeCmPhoneForFapshi(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (!d.length) return null;
  let n = d;
  if (n.startsWith("237") && n.length >= 12) n = n.slice(3);
  if (n.length > 9) n = n.slice(-9);
  if (n.length === 9 && /^6[0-9]{8}$/.test(n)) return n;
  return null;
}

export const FAPSHI_MEDIUM = {
  mtn: "mobile money",
  orange: "orange money",
} as const;

export type FapshiWallet = keyof typeof FAPSHI_MEDIUM;
