"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const verificationData = [
  { month: "Apr", verified: 62 },
  { month: "May", verified: 68 },
  { month: "Jun", verified: 65 },
  { month: "Jul", verified: 74 },
  { month: "Aug", verified: 81 },
  { month: "Sep", verified: 87 },
];

const riskData = [
  { name: "High Risk", value: 12 },
  { name: "Medium Risk", value: 28 },
  { name: "Low Risk", value: 60 },
];

const riskColors = ["#B54747", "#B7791F", "#3F7D58"];

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #D9E1E8",
  borderRadius: "6px",
  boxShadow: "0 4px 12px rgba(31, 41, 51, 0.08)",
  fontSize: "11px",
};

export default function AnalyticsSection() {
  return (
    <section className="mt-8">
      {/* =====================================================
          SECTION HEADER
          ===================================================== */}

      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7B8794]">
          Monitoring Intelligence
        </p>

        <h2 className="mt-1 text-lg font-semibold text-[#123B5D]">
          Fraud Analytics
        </h2>

        <p className="mt-1 text-sm text-[#52606D]">
          Overview of project verification activity and risk
          classification trends.
        </p>
      </div>

      {/* =====================================================
          CHART GRID
          ===================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        {/* =================================================
            VERIFICATION TREND
            ================================================= */}

        <div className="rounded-lg border border-[#D9E1E8] bg-white shadow-sm">
          <div className="border-b border-[#D9E1E8] px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#1F2933]">
                  Project Verification Trend
                </p>

                <p className="mt-1 text-[10px] text-[#7B8794]">
                  Monthly percentage of projects successfully
                  verified
                </p>
              </div>

              <div className="rounded-md border border-[#C9D8E3] bg-[#EEF4F8] px-2.5 py-1.5">
                <span className="text-[9px] font-semibold text-[#2F6B8A]">
                  +25% since Apr
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="h-[280px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={verificationData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="#E5E9ED"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: "#7B8794",
                      fontSize: 10,
                    }}
                    axisLine={{
                      stroke: "#D9E1E8",
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fill: "#7B8794",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{
                      fill: "#F5F7F9",
                    }}
                    formatter={(value) => [
                      `${value}%`,
                      "Verified",
                    ]}
                  />

                  <Bar
                    dataKey="verified"
                    name="Verified"
                    fill="#2F6B8A"
                    radius={[3, 3, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 border-t border-[#DFE5EA] pt-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
                  Current
                </p>

                <p className="mt-1 text-sm font-semibold text-[#123B5D]">
                  87%
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
                  Previous
                </p>

                <p className="mt-1 text-sm font-semibold text-[#52606D]">
                  81%
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
                  Change
                </p>

                <p className="mt-1 text-sm font-semibold text-[#3F7D58]">
                  +6%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RISK DISTRIBUTION
            ================================================= */}

        <div className="rounded-lg border border-[#D9E1E8] bg-white shadow-sm">
          <div className="border-b border-[#D9E1E8] px-4 py-4 sm:px-5">
            <p className="text-sm font-semibold text-[#1F2933]">
              Risk Distribution
            </p>

            <p className="mt-1 text-[10px] text-[#7B8794]">
              Current classification of monitored projects
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <div className="h-[230px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  >
                    {riskData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={riskColors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [
                      `${value}%`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}

            <div className="space-y-3 border-t border-[#DFE5EA] pt-4">
              {riskData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          riskColors[index],
                      }}
                    />

                    <span className="text-[11px] text-[#52606D]">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#1F2933]">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ANALYTICS SUMMARY
          ===================================================== */}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* High Risk */}

        <div className="rounded-lg border border-[#E7CACA] bg-[#FAEEEE] p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8F3636]">
            High Risk Projects
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#B54747]">
            12%
          </p>

          <p className="mt-1 text-[10px] leading-4 text-[#6F4545]">
            Projects requiring immediate auditor review or
            additional verification.
          </p>
        </div>

        {/* Medium Risk */}

        <div className="rounded-lg border border-[#E8D8B8] bg-[#FBF4E8] p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A641B]">
            Medium Risk Projects
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#B7791F]">
            28%
          </p>

          <p className="mt-1 text-[10px] leading-4 text-[#6F5A35]">
            Projects requiring documentation review or
            additional evidence.
          </p>
        </div>

        {/* Verified */}

        <div className="rounded-lg border border-[#BFD8C8] bg-[#EEF6F0] p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#3F7D58]">
            Low Risk / Verified
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#3F7D58]">
            60%
          </p>

          <p className="mt-1 text-[10px] leading-4 text-[#536F5C]">
            Projects currently passing the primary monitoring
            and verification checks.
          </p>
        </div>
      </div>

      {/* =====================================================
          INSIGHTS
          ===================================================== */}

      <div className="mt-4 rounded-lg border border-[#D9E1E8] bg-white shadow-sm">
        <div className="border-b border-[#D9E1E8] px-4 py-4 sm:px-5">
          <p className="text-sm font-semibold text-[#1F2933]">
            Monitoring Insights
          </p>

          <p className="mt-1 text-[10px] text-[#7B8794]">
            Summary of current dashboard indicators
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[#DFE5EA] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-4 sm:p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7B8794]">
              Verification
            </p>

            <p className="mt-2 text-xs font-medium leading-5 text-[#52606D]">
              Verification performance has improved steadily
              across the monitoring period.
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7B8794]">
              Risk Monitoring
            </p>

            <p className="mt-2 text-xs font-medium leading-5 text-[#52606D]">
              High-risk cases remain a priority for manual
              auditor investigation.
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7B8794]">
              Evidence Review
            </p>

            <p className="mt-2 text-xs font-medium leading-5 text-[#52606D]">
              Visual evidence analysis can help identify
              projects requiring additional verification.
            </p>
          </div>
        </div>

        <div className="border-t border-[#DFE5EA] bg-[#F8FAFB] px-4 py-3 sm:px-5">
          <p className="text-[9px] leading-4 text-[#7B8794]">
            Demonstration analytics data. Production metrics
            will be connected to the authorized MPLADS
            monitoring data source.
          </p>
        </div>
      </div>
    </section>
  );
}