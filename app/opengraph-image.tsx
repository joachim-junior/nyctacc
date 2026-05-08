import { shareCardImageResponse } from "@/lib/og/share-card";

export const alt = "National Youth Conference 2026 — The Apostolic Church Cameroon, Yaoundé";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return shareCardImageResponse();
}
