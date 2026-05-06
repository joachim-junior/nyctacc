export const CONFERENCE_COMMITTEES = [
  { id: "prayer", en: "Prayer and Intercession", fr: "Prière et Intercession", icon: "🙏" },
  { id: "music", en: "Music and Choir", fr: "Musique et Chorale", icon: "🎵" },
  {
    id: "evangelism",
    en: "Evangelism and Outreach",
    fr: "Évangélisation et Sortie",
    icon: "📢",
  },
  { id: "hospitality", en: "Hospitality", fr: "Hospitalité", icon: "🤝" },
  { id: "protocol", en: "Protocol", fr: "Protocole", icon: "🎗️" },
  {
    id: "media",
    en: "Media and Communication",
    fr: "Médias et Communication",
    icon: "📡",
  },
  { id: "security", en: "Security", fr: "Sécurité", icon: "🛡️" },
  { id: "secretariat", en: "Secretariat", fr: "Secrétariat", icon: "📝" },
  {
    id: "organization",
    en: "Organization Committee",
    fr: "Comité d'Organisation",
    icon: "⚙️",
  },
  { id: "health", en: "Health and Welfare", fr: "Santé et Bien-être", icon: "⚕️" },
  { id: "arts", en: "Arts and Drama", fr: "Arts et Spectacle", icon: "🎭" },
  {
    id: "logistics",
    en: "Logistics and Transport",
    fr: "Logistique et Transport",
    icon: "🚌",
  },
  {
    id: "finance",
    en: "Finance and Administration",
    fr: "Finance et Administration",
    icon: "💼",
  },
  { id: "kitchen", en: "Kitchen", fr: "Cuisine", icon: "🍽️" },
  {
    id: "interpretation",
    en: "Interpretation",
    fr: "Interprétation",
    icon: "🌐",
  },
  { id: "pr", en: "Public Relations", fr: "Relations Publiques", icon: "📣" },
] as const;

export type CommitteeId = (typeof CONFERENCE_COMMITTEES)[number]["id"];

/** Zod-compatible tuple — must match ids above */
export const COMMITTEE_ID_ENUM = [
  "prayer",
  "music",
  "evangelism",
  "hospitality",
  "protocol",
  "media",
  "security",
  "secretariat",
  "organization",
  "health",
  "arts",
  "logistics",
  "finance",
  "kitchen",
  "interpretation",
  "pr",
] as const;
