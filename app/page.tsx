import { Hero, RegistrationWizard } from "@/components/registration/RegistrationWizard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--tacc-canvas)] pb-16 pt-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <Hero />
        <header className="space-y-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--tacc-primary)]">
            Participant registration
          </p>
          <h2 className="text-3xl font-bold text-[var(--tacc-ink)]">
            NYC 2026 — secure your spot
          </h2>
          <p className="max-w-3xl text-[var(--tacc-muted)]">
            Complete every step with care. Section one captures your national
            field; section two records the youth group that disciples you week
            to week.
          </p>
        </header>
        <RegistrationWizard />
      </div>
    </div>
  );
}
