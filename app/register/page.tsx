import type { Metadata } from "next";

import { RegistrationWizard } from "@/components/registration/RegistrationWizard";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Register a youth delegate for National Youth Conference 2026 (14–17 July, Yaoundé — TACC, The Apostolic Church Cameroon). Guided form and secure Fapshi payment.",
};

export default function RegisterPage() {
  return (
    <div className="tacc-shell py-12 sm:pb-24 sm:pt-14">
      <RegistrationWizard />
    </div>
  );
}
