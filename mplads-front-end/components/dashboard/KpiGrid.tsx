import { dashboardKPIs } from "@/data/projects";

import KpiCard from "./KpiCard";

export default function KpiGrid() {
  return (
    <section
      aria-label="System performance indicators"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {dashboardKPIs.map((kpi) => (
        <KpiCard
          key={kpi.label}
          kpi={kpi}
        />
      ))}
    </section>
  );
}