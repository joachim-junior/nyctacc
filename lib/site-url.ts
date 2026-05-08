/** Canonical site URL for Open Graph absolute URLs — set NEXT_PUBLIC_APP_URL in production (e.g. https://your-app.vercel.app). */
export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) {
    try {
      return new URL(raw.endsWith("/") ? raw.slice(0, -1) : raw);
    } catch {
      /* fall through */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return new URL(`https://${host}`);
  }
  return new URL("http://localhost:3000");
}
