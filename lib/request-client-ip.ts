/**
 * Best-effort public client IP from trusted edge headers (Vercel sets
 * `x-forwarded-for` to the visitor; see Vercel Request headers docs).
 * Used when proxying to payment providers that validate the payer/origin IP.
 */
export function getTrustedClientIp(request: Request): string | undefined {
  const raw =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip");
  if (!raw?.trim()) return undefined;
  const first = raw.split(",")[0]?.trim();
  if (!first || first === "unknown") return undefined;
  return normalizeClientIp(first);
}

function normalizeClientIp(ip: string): string {
  const base = ip.split("%")[0].trim();
  const lower = base.toLowerCase();
  if (lower.startsWith("::ffff:")) return base.slice(7);
  return base;
}
