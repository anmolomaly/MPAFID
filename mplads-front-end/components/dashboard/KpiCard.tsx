"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";

import type { DashboardKPI } from "@/types/dashboard";

interface KpiCardProps {
  kpi: DashboardKPI;
}

function getKpiIcon(label: string) {
  switch (label) {
    case "System Status":
      return Activity;
    case "Alerts Filed":
      return AlertTriangle;
    case "Revenue Protected":
      return IndianRupee;
    case "Verified Projects":
      return CheckCircle2;
    default:
      return Activity;
  }
}

function getKpiDetails(label: string) {
  switch (label) {
    case "System Status":
      return {
        title: "System Status",
        heading: "Monitoring services operational",
        details:
          "The MPAFID monitoring engine is currently active and processing project verification, risk analysis, and anomaly detection workflows.",
        items: [
          ["Monitoring Engine", "Operational"],
          ["Project Verification", "Active"],
          ["Risk Detection", "Active"],
          ["Image Analysis", "Online"],
        ],
      };

    case "Alerts Filed":
      return {
        title: "Alerts Filed",
        heading: "24 projects require auditor attention",
        details:
          "These alerts represent projects identified by the monitoring system for further review based on risk indicators and anomaly detection.",
        items: [
          ["High Risk", "9"],
          ["Medium Risk", "3"],
          ["Review Required", "24"],
          ["Priority Cases", "5"],
        ],
      };

    case "Revenue Protected":
      return {
        title: "Revenue Protected",
        heading: "₹4.82 Cr currently protected",
        details:
          "This represents the estimated value of funds currently protected through project verification and fraud-risk monitoring.",
        items: [
          ["Protected Funds", "₹4.82 Cr"],
          ["Active Cases", "24"],
          ["High Risk Exposure", "₹1.46 Cr"],
          ["Verification Coverage", "94.7%"],
        ],
      };

    case "Verified Projects":
      return {
        title: "Verified Projects",
        heading: "94.7% projects passing verification",
        details:
          "Project verification combines project records, risk indicators, and visual evidence to identify projects requiring additional auditor review.",
        items: [
          ["Verified Rate", "94.7%"],
          ["Projects Monitored", "1,248"],
          ["Verified Projects", "1,182"],
          ["Manual Review", "66"],
        ],
      };

    default:
      return {
        title: label,
        heading: "Dashboard information",
        details: "Additional dashboard information is available.",
        items: [],
      };
  }
}

export default function KpiCard({ kpi }: KpiCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const Icon = getKpiIcon(kpi.label);
  const isSystemStatus = kpi.label === "System Status";
  const isAlerts = kpi.label === "Alerts Filed";
  const isVerified = kpi.label === "Verified Projects";

  const details = getKpiDetails(kpi.label);

  return (
    <>
      {/* KPI CARD */}
      <button
        type="button"
        onClick={() => setDetailsOpen(true)}
        className="group w-full text-left"
      >
        <article className="h-full rounded-lg border border-[#D9E1E8] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#C5D2DE] hover:bg-[#FBFCFD] hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            {/* Icon */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${
                isSystemStatus
                  ? "border-[#CFE5D7] bg-[#F1F8F3]"
                  : isAlerts
                    ? "border-[#F0D2D2] bg-[#FDF3F3]"
                    : "border-[#D7E2EC] bg-[#F2F6FA]"
              }`}
            >
              <Icon
                size={19}
                className={
                  isSystemStatus
                    ? "text-[#39704E]"
                    : isAlerts
                      ? "text-[#A33A3A]"
                      : "text-[#315D82]"
                }
              />
            </div>

            {/* Trend */}
            {kpi.trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  isAlerts ? "text-[#A33A3A]" : "text-[#39704E]"
                }`}
              >
                <TrendingUp size={13} />
                <span>{kpi.trend}</span>
              </div>
            )}
          </div>

          {/* Label */}
          <p className="mt-4 text-xs font-medium text-[#667085]">
            {kpi.label}
          </p>

          {/* Main Value */}
          <div className="mt-1">
            <p
              className={`text-2xl font-semibold tracking-tight ${
                isSystemStatus
                  ? "text-[#39704E]"
                  : isAlerts
                    ? "text-[#A33A3A]"
                    : isVerified
                      ? "text-[#315D82]"
                      : "text-[#172B4D]"
              }`}
            >
              {kpi.value}
            </p>
          </div>

          {/* Description */}
          <p className="mt-2 text-[11px] leading-relaxed text-[#667085]">
            {kpi.description}
          </p>

          {/* Hover Hint */}
          <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.12em] text-[#98A2B3] opacity-0 transition-opacity group-hover:opacity-100">
            View details →
          </p>
        </article>
      </button>

      {/* DETAILS MODAL */}
      {detailsOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#172B4D]/25 p-4 backdrop-blur-[1px]"
          onClick={() => setDetailsOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-lg border border-[#D9E1E8] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E5EAF0] px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  MPAFID Monitoring
                </p>

                <h3 className="mt-1 text-base font-semibold text-[#172B4D]">
                  {details.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-[#344054]"
                aria-label="Close details"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5">
              {/* Status Summary */}
              <div className="rounded-md border border-[#E1E8EF] bg-[#F7F9FB] p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${
                      isSystemStatus
                        ? "bg-[#ECF7F0]"
                        : isAlerts
                          ? "bg-[#FCECEC]"
                          : "bg-[#EEF4FA]"
                    }`}
                  >
                    <Icon
                      size={19}
                      className={
                        isSystemStatus
                          ? "text-[#39704E]"
                          : isAlerts
                            ? "text-[#A33A3A]"
                            : "text-[#315D82]"
                      }
                    />
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">
                      Current status
                    </p>

                    <p className="text-base font-semibold text-[#172B4D]">
                      {details.heading}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-[#667085]">
                  {details.details}
                </p>
              </div>

              {/* Detail Rows */}
              {details.items.length > 0 && (
                <div className="mt-4 overflow-hidden rounded-md border border-[#E1E8EF]">
                  {details.items.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-[#EEF2F5] px-4 py-3 last:border-b-0"
                    >
                      <span className="text-xs text-[#667085]">
                        {label}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          value === "Operational" ||
                          value === "Active" ||
                          value === "Online"
                            ? "text-[#39704E]"
                            : "text-[#344054]"
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Demo Notice */}
              <div className="mt-4 rounded-md border border-[#E5EAF0] bg-[#FAFBFC] px-3 py-2.5">
                <p className="text-[9px] leading-4 text-[#98A2B3]">
                  Demonstration dashboard data. Production values will
                  be connected to the MPLADS e-SAKSHI monitoring data
                  source.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E5EAF0] bg-[#FAFBFC] px-5 py-3">
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="w-full rounded-md border border-[#D9E1E8] bg-white px-4 py-2 text-xs font-medium text-[#475467] transition-colors hover:bg-[#F2F4F7]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}