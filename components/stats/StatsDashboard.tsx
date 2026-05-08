"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { useLanguage } from "@/contexts/LanguageContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
);

type StatsResponse = {
  totals: {
    registrations: number;
    registrationsPaid: number;
    registrationsPending: number;
    uniqueFields: number;
    uniqueGroups: number;
    totalTaccFields: number;
    totalYouthGroups: number;
    revenueRegistrationPaidFcfa: number;
    revenueRegistrationAllFcfa: number;
    donationsFcfa: number;
    fundsTotalFcfa: number;
  };
  charts: {
    byField: { label: string; count: number }[];
    byRegion: { label: string; count: number }[];
    byCommittee: { label: string; count: number }[];
    byGender: { label: string; count: number }[];
    overTime: { label: string; count: number }[];
    paymentStatus: { label: string; count: number }[];
  };
};

const barOpts = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 } },
  },
};

export function StatsDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stats");
      const j = await res.json();
      if (res.ok) setData(j as StatsResponse);
      else setData(null);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="tacc-shell flex min-h-[50vh] flex-col items-center justify-center gap-5 py-20">
        <div
          className="h-11 w-11 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#0a1f5c]"
          aria-hidden
        />
        <p className="text-[15px] font-medium text-slate-600">{t("stats_loading")}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tacc-shell max-w-lg py-24 text-center">
        <p className="text-sm leading-relaxed text-slate-600">{t("stats_error")}</p>
        <button
          type="button"
          className="tacc-btn-navy mt-8 px-8 py-3"
          onClick={() => void load()}
        >
          {t("stats_retry")}
        </button>
      </div>
    );
  }

  const { totals, charts } = data;

  return (
    <div className="tacc-shell py-12 sm:py-16">
      <h1 className="tacc-page-title">{t("stats_title")}</h1>
      <p className="mt-2 max-w-xl text-[15px] text-slate-600">{t("stats_sub")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi label={t("kpi_reg")} value={String(totals.registrations)} sub="all submissions" />
        <Kpi
          label={t("kpi_fields")}
          value={`${totals.uniqueFields} / ${totals.totalTaccFields}`}
          sub="distinct fields"
        />
        <Kpi
          label={t("kpi_groups")}
          value={`${totals.uniqueGroups} / ${totals.totalYouthGroups}`}
          sub="distinct groups"
        />
        <Kpi
          label={t("kpi_rev")}
          value={totals.revenueRegistrationPaidFcfa.toLocaleString()}
          sub={`pending ${totals.registrationsPending}`}
        />
        <Kpi label={t("kpi_don")} value={totals.donationsFcfa.toLocaleString()} sub="FCFA" />
        <Kpi label={t("kpi_total")} value={totals.fundsTotalFcfa.toLocaleString()} sub="FCFA" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ChartCard title={t("ch_by_field")}>
          <Bar
            options={barOpts}
            data={{
              labels: charts.byField.map((x) => x.label.slice(0, 24)),
              datasets: [
                {
                  label: "Count",
                  data: charts.byField.map((x) => x.count),
                  backgroundColor: "rgba(10,31,92,0.75)",
                },
              ],
            }}
          />
        </ChartCard>
        <ChartCard title={t("ch_by_region")}>
          <Bar
            options={barOpts}
            data={{
              labels: charts.byRegion.map((x) => x.label),
              datasets: [
                {
                  label: "Count",
                  data: charts.byRegion.map((x) => x.count),
                  backgroundColor: "rgba(200,152,10,0.85)",
                },
              ],
            }}
          />
        </ChartCard>
        <ChartCard title={t("ch_by_committee")}>
          <Bar
            options={barOpts}
            data={{
              labels: charts.byCommittee.map((x) => x.label),
              datasets: [
                {
                  label: "Count",
                  data: charts.byCommittee.map((x) => x.count),
                  backgroundColor: "rgba(204,31,31,0.65)",
                },
              ],
            }}
          />
        </ChartCard>
        <ChartCard title={t("ch_gender")}>
          <Doughnut
            data={{
              labels: charts.byGender.map((x) => x.label),
              datasets: [
                {
                  data: charts.byGender.map((x) => x.count),
                  backgroundColor: [
                    "rgba(10,31,92,0.8)",
                    "rgba(200,152,10,0.85)",
                  ],
                },
              ],
            }}
          />
        </ChartCard>
        <ChartCard title={t("ch_over_time")} className="lg:col-span-2">
          <Line
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } },
              },
            }}
            data={{
              labels: charts.overTime.map((x) => x.label),
              datasets: [
                {
                  label: "Registrations",
                  data: charts.overTime.map((x) => x.count),
                  borderColor: "#0a1f5c",
                  backgroundColor: "rgba(10,31,92,0.15)",
                  fill: true,
                  tension: 0.35,
                },
              ],
            }}
          />
        </ChartCard>
        <ChartCard title={t("ch_payment")}>
          <Doughnut
            data={{
              labels: charts.paymentStatus.map((x) => x.label),
              datasets: [
                {
                  data: charts.paymentStatus.map((x) => x.count),
                  backgroundColor: [
                    "rgba(200,152,10,0.9)",
                    "rgba(46,139,87,0.85)",
                  ],
                },
              ],
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="tacc-card border-l-[3px] border-[#c8980a] p-6">
      <div className="font-[family-name:var(--font-playfair)] text-3xl font-bold tabular-nums text-[#0a1f5c]">
        {value}
      </div>
      <div className="mt-2 text-[13px] font-semibold text-[#0a1f5c]">{label}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`tacc-card p-6 ${className}`}>
      <h3 className="mb-5 text-center text-[13px] font-bold uppercase tracking-wide text-[#0a1f5c]">
        {title}
      </h3>
      <div className="h-[260px]">{children}</div>
    </div>
  );
}
