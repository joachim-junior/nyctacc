export const REGISTRATION_FEE_FCFA = 1100;
export const REGISTRATION_FEE_USD = 2;

export function formatFcfa(amount: number, lang: "en" | "fr"): string {
  const s = new Intl.NumberFormat(lang === "fr" ? "fr-CM" : "en-US").format(amount);
  return `${s} FCFA`;
}
