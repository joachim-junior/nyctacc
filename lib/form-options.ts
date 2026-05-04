export const AGE_GROUPS = [
  { value: "under_15", label: "Under 15" },
  { value: "15_17", label: "15 – 17" },
  { value: "18_24", label: "18 – 24" },
  { value: "25_30", label: "25 – 30" },
  { value: "31_35", label: "31 – 35" },
  { value: "36_40", label: "36 – 40" },
  { value: "over_40", label: "Over 40" },
] as const;

export const CAMEROON_REGIONS = [
  { value: "adamawa", label: "Adamawa / Adamaoua" },
  { value: "centre", label: "Centre" },
  { value: "east", label: "East / Est" },
  { value: "far_north", label: "Far North / Extrême-Nord" },
  { value: "littoral", label: "Littoral" },
  { value: "north", label: "North / Nord" },
  { value: "north_west", label: "North West / Nord-Ouest" },
  { value: "south", label: "South / Sud" },
  { value: "south_west", label: "South West / Sud-Ouest" },
  { value: "west", label: "West / Ouest" },
  { value: "diaspora", label: "Diaspora / Other" },
] as const;

export const CHURCH_AFFILIATION = [
  { value: "tacc", label: "TACC assembly" },
  { value: "other_denomination", label: "Other Christian denomination" },
  { value: "not_member", label: "Not yet a church member" },
] as const;

export const CHURCH_ROLES = [
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

export const YEARS_IN_ASSEMBLY = [
  { value: "lt_1", label: "Less than 1 year" },
  { value: "1_3", label: "1 – 3 years" },
  { value: "4_7", label: "4 – 7 years" },
  { value: "8_15", label: "8 – 15 years" },
  { value: "15_plus", label: "15+ years" },
] as const;

export const EDUCATION_LEVELS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary (BEPC / O Level)" },
  { value: "high_school", label: "High school / Bac (A Level)" },
  { value: "bachelor", label: "University — Bachelor's" },
  { value: "master", label: "University — Master's" },
  { value: "phd", label: "University — PhD" },
  { value: "vocational", label: "Vocational / Technical" },
  { value: "none", label: "None" },
] as const;

export const PROFESSIONS = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher / Educator" },
  { value: "health", label: "Health worker" },
  { value: "engineer", label: "Engineer" },
  { value: "lawyer", label: "Lawyer / Jurist" },
  { value: "accountant", label: "Accountant" },
  { value: "business", label: "Business" },
  { value: "farmer", label: "Farmer" },
  { value: "civil_servant", label: "Civil servant" },
  { value: "journalist", label: "Journalist / Media" },
  { value: "pastor_worker", label: "Pastor / Church worker" },
  { value: "it", label: "IT & Technology" },
  { value: "arts", label: "Arts & Creative" },
  { value: "driver", label: "Driver / Transport" },
  { value: "artisan", label: "Artisan / Skilled trade" },
  { value: "unemployed", label: "Unemployed" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
] as const;

export const COMMITTEES = [
  { value: "prayer", label: "Prayer & Intercession" },
  { value: "worship", label: "Worship & Praise" },
  { value: "evangelism", label: "Evangelism & Outreach" },
  { value: "hospitality", label: "Hospitality & Protocol" },
  { value: "media", label: "Media & Communication" },
  { value: "photo_video", label: "Photography & Videography" },
  { value: "ushering", label: "Ushering & Security" },
  { value: "teaching", label: "Teaching & Discipleship" },
  { value: "leadership", label: "Leadership development" },
  { value: "charity", label: "Charity & Social action" },
  { value: "health", label: "Health & Welfare" },
  { value: "logistics", label: "Logistics & Operations" },
  { value: "finance", label: "Finance & Administration" },
  { value: "youth_children", label: "Youth & Children" },
  { value: "none", label: "No preference" },
] as const;
