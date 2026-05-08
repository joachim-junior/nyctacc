/** Instant shell while `/stats` loads (before client dashboard hydrates). */
export default function StatsLoading() {
  return (
    <div className="tacc-shell flex min-h-[50vh] flex-col items-center justify-center gap-5 py-20">
      <div
        className="h-11 w-11 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#0a1f5c]"
        aria-hidden
      />
      <p className="text-[15px] font-medium text-slate-600">Loading statistics…</p>
    </div>
  );
}
