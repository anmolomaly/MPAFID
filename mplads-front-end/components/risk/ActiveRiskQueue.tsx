"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  Flag,
  Lock,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

type RiskLevel = "High" | "Medium" | "Low";

interface RiskProject {
  id: string;
  state: string;
  district: string;
  project: string;
  amount: string;
  riskScore: number;
  riskLevel: RiskLevel;
  issue: string;
  lastUpdated: string;
  status: "Pending Review" | "Under Review" | "Flagged";
}

const riskProjects: RiskProject[] = [
  {
    id: "MPLADS-HP-014",
    state: "Himachal Pradesh",
    district: "Shimla",
    project: "Rural Road Improvement",
    amount: "₹18.5 Lakh",
    riskScore: 92,
    riskLevel: "High",
    issue: "Image mismatch detected",
    lastUpdated: "5 min ago",
    status: "Pending Review",
  },
  {
    id: "MPLADS-RJ-032",
    state: "Rajasthan",
    district: "Jaipur",
    project: "Community Infrastructure",
    amount: "₹24.2 Lakh",
    riskScore: 81,
    riskLevel: "High",
    issue: "Duplicate visual evidence",
    lastUpdated: "18 min ago",
    status: "Under Review",
  },
  {
    id: "MPLADS-WB-019",
    state: "West Bengal",
    district: "Kolkata",
    project: "Public Facility Development",
    amount: "₹16.8 Lakh",
    riskScore: 76,
    riskLevel: "High",
    issue: "Location evidence variance",
    lastUpdated: "34 min ago",
    status: "Pending Review",
  },
  {
    id: "MPLADS-PB-021",
    state: "Punjab",
    district: "Chandigarh",
    project: "Road & Drainage Works",
    amount: "₹12.4 Lakh",
    riskScore: 64,
    riskLevel: "Medium",
    issue: "Documentation variance",
    lastUpdated: "52 min ago",
    status: "Pending Review",
  },
  {
    id: "MPLADS-GJ-027",
    state: "Gujarat",
    district: "Ahmedabad",
    project: "Community Hall Construction",
    amount: "₹21.6 Lakh",
    riskScore: 58,
    riskLevel: "Medium",
    issue: "Verification required",
    lastUpdated: "1 hr ago",
    status: "Flagged",
  },
];

function getRiskStyles(level: RiskLevel) {
  switch (level) {
    case "High":
      return {
        badge: "border-[#F0D2D2] bg-[#FCECEC] text-[#A33A3A]",
        dot: "bg-[#B54747]",
        score: "text-[#A33A3A]",
        icon: "text-[#A33A3A]",
      };

    case "Medium":
      return {
        badge: "border-[#F1DEB8] bg-[#FFF6E5] text-[#9A6700]",
        dot: "bg-[#B7791F]",
        score: "text-[#9A6700]",
        icon: "text-[#9A6700]",
      };

    default:
      return {
        badge: "border-[#CFE5D7] bg-[#ECF7F0] text-[#39704E]",
        dot: "bg-[#4F8A65]",
        score: "text-[#39704E]",
        icon: "text-[#39704E]",
      };
  }
}

function getStatusStyles(status: RiskProject["status"]) {
  switch (status) {
    case "Under Review":
      return "border-[#D7E2EC] bg-[#F2F6FA] text-[#315D82]";

    case "Flagged":
      return "border-[#F1DEB8] bg-[#FFF6E5] text-[#9A6700]";

    default:
      return "border-[#E5EAF0] bg-[#F8FAFC] text-[#667085]";
  }
}

export default function ActiveRiskQueue() {
  const [selectedProject, setSelectedProject] =
    useState<RiskProject | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"All" | RiskLevel>("All");
  const [actionMessage, setActionMessage] = useState("");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return riskProjects.filter((project) => {
      const matchesSearch =
        !query ||
        project.id.toLowerCase().includes(query) ||
        project.state.toLowerCase().includes(query) ||
        project.district.toLowerCase().includes(query) ||
        project.project.toLowerCase().includes(query) ||
        project.issue.toLowerCase().includes(query);

      const matchesRisk =
        riskFilter === "All" || project.riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [searchQuery, riskFilter]);

  const handleAction = (action: string) => {
    if (!selectedProject) return;

    setActionMessage(
      `${action} recorded for ${selectedProject.id}.`
    );
  };

  const highRiskCount = riskProjects.filter(
    (project) => project.riskLevel === "High"
  ).length;

  const mediumRiskCount = riskProjects.filter(
    (project) => project.riskLevel === "Medium"
  ).length;

  return (
    <div className="overflow-hidden rounded-lg border border-[#D9E1E8] bg-white shadow-sm">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="border-b border-[#E5EAF0] px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert
                size={17}
                className="text-[#315D82]"
              />

              <p className="text-sm font-semibold text-[#172B4D]">
                Auditor Review Queue
              </p>
            </div>

            <p className="mt-1 text-[11px] text-[#667085]">
              Projects requiring review based on automated risk
              indicators.
            </p>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-[#F0D2D2] bg-[#FDF3F3] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B54747]" />

              <span className="text-[10px] font-medium text-[#A33A3A]">
                {highRiskCount} High Risk
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-md border border-[#F1DEB8] bg-[#FFF9ED] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B7791F]" />

              <span className="text-[10px] font-medium text-[#9A6700]">
                {mediumRiskCount} Medium Risk
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-md border border-[#E1E8EF] bg-[#F8FAFC] px-3 py-2">
              <Clock3
                size={12}
                className="text-[#667085]"
              />

              <span className="text-[10px] font-medium text-[#667085]">
                Live Queue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTER BAR
      ====================================================== */}
      <div className="border-b border-[#E5EAF0] bg-[#FAFBFC] px-5 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search project, district or issue..."
              className="h-9 w-full rounded-md border border-[#D9E1E8] bg-white pl-9 pr-3 text-xs text-[#344054] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#9EB6CB] focus:ring-2 focus:ring-[#EEF4FA]"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1 rounded-md border border-[#D9E1E8] bg-white p-1">
            {(["All", "High", "Medium"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setRiskFilter(filter)}
                className={`rounded px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  riskFilter === filter
                    ? "bg-[#EEF4FA] text-[#174A7C]"
                    : "text-[#667085] hover:bg-[#F7F9FB]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP TABLE
      ====================================================== */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-[#E5EAF0] bg-[#F8FAFC]">
              <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                Project
              </th>

              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                Location
              </th>

              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                Risk
              </th>

              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                Issue Detected
              </th>

              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                Status
              </th>

              <th className="px-5 py-3 text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((project) => {
              const riskStyles = getRiskStyles(project.riskLevel);

              return (
                <tr
                  key={project.id}
                  className="border-b border-[#EEF2F5] transition-colors last:border-b-0 hover:bg-[#FBFCFD]"
                >
                  {/* Project */}
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProject(project);
                        setActionMessage("");
                      }}
                      className="text-left"
                    >
                      <p className="text-xs font-semibold text-[#174A7C] hover:underline">
                        {project.id}
                      </p>

                      <p className="mt-1 max-w-[190px] text-[11px] font-medium text-[#344054]">
                        {project.project}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#98A2B3]">
                        Updated {project.lastUpdated}
                      </p>
                    </button>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-4">
                    <p className="text-[11px] font-medium text-[#344054]">
                      {project.district}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#667085]">
                      {project.state}
                    </p>
                  </td>

                  {/* Risk */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-md border text-[11px] font-bold ${riskStyles.badge}`}
                      >
                        {project.riskScore}
                      </span>

                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-semibold ${riskStyles.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${riskStyles.dot}`}
                          />

                          {project.riskLevel}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Issue */}
                  <td className="px-4 py-4">
                    <div className="flex max-w-[180px] items-start gap-2">
                      <AlertTriangle
                        size={13}
                        className={`mt-0.5 shrink-0 ${riskStyles.icon}`}
                      />

                      <span className="text-[10px] leading-4 text-[#475467]">
                        {project.issue}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4">
                    <p className="text-[11px] font-semibold text-[#344054]">
                      {project.amount}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-medium ${getStatusStyles(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProject(project);
                        setActionMessage("");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#D9E1E8] bg-white px-3 py-2 text-[10px] font-medium text-[#315D82] transition-colors hover:bg-[#F2F6FA]"
                    >
                      <Eye size={13} />
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MOBILE CARDS
      ====================================================== */}
      <div className="divide-y divide-[#EEF2F5] lg:hidden">
        {filteredProjects.map((project) => {
          const riskStyles = getRiskStyles(project.riskLevel);

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                setSelectedProject(project);
                setActionMessage("");
              }}
              className="block w-full px-4 py-4 text-left transition-colors hover:bg-[#FBFCFD]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#174A7C]">
                    {project.id}
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-[#344054]">
                    {project.project}
                  </p>

                  <p className="mt-1 text-[9px] text-[#667085]">
                    {project.district}, {project.state}
                  </p>
                </div>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold ${riskStyles.badge}`}
                >
                  {project.riskScore}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-semibold ${riskStyles.badge}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${riskStyles.dot}`}
                  />

                  {project.riskLevel} Risk
                </span>

                <span
                  className={`rounded-full border px-2 py-1 text-[9px] font-medium ${getStatusStyles(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={13}
                    className={riskStyles.icon}
                  />

                  <span className="text-[10px] text-[#667085]">
                    {project.issue}
                  </span>
                </div>

                <span className="text-[10px] font-semibold text-[#344054]">
                  {project.amount}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="px-5 py-12 text-center">
          <Search
            size={22}
            className="mx-auto text-[#98A2B3]"
          />

          <p className="mt-3 text-sm font-semibold text-[#344054]">
            No projects found
          </p>

          <p className="mt-1 text-[11px] text-[#667085]">
            Try changing the search term or risk filter.
          </p>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <div className="border-t border-[#E5EAF0] bg-[#FAFBFC] px-5 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] text-[#98A2B3]">
            Showing {filteredProjects.length} of {riskProjects.length}{" "}
            active risk cases
          </p>

          <p className="text-[9px] text-[#98A2B3]">
            Automated risk assessment · Auditor action required
          </p>
        </div>
      </div>

      {/* =====================================================
          REVIEW MODAL
      ====================================================== */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#172B4D]/25 p-4 backdrop-blur-[1px]"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-lg border border-[#D9E1E8] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-[#E5EAF0] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#667085]">
                    Auditor Case Review
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-[#172B4D]">
                    {selectedProject.id}
                  </h3>

                  <p className="mt-1 text-[11px] text-[#667085]">
                    {selectedProject.project}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="rounded-md p-1.5 text-[#667085] hover:bg-[#F2F4F7]"
                  aria-label="Close review"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5">
              {/* Risk Summary */}
              <div className="rounded-md border border-[#E1E8EF] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-[#667085]">
                      Risk Assessment
                    </p>

                    <p
                      className={`mt-1 text-3xl font-bold ${getRiskStyles(
                        selectedProject.riskLevel
                      ).score}`}
                    >
                      {selectedProject.riskScore}
                    </p>

                    <p className="text-[9px] text-[#98A2B3]">
                      Risk score out of 100
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${getRiskStyles(
                      selectedProject.riskLevel
                    ).badge}`}
                  >
                    {selectedProject.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 overflow-hidden rounded-md border border-[#E1E8EF]">
                <div className="border-b border-[#E5EAF0] bg-[#F8FAFC] px-4 py-2.5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                    Case Information
                  </p>
                </div>

                <div className="divide-y divide-[#EEF2F5]">
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-[10px] text-[#667085]">
                      Location
                    </span>

                    <span className="text-right text-[10px] font-medium text-[#344054]">
                      {selectedProject.district},{" "}
                      {selectedProject.state}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-[10px] text-[#667085]">
                      Project Amount
                    </span>

                    <span className="text-[10px] font-semibold text-[#344054]">
                      {selectedProject.amount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-[10px] text-[#667085]">
                      Detected Issue
                    </span>

                    <span className="max-w-[230px] text-right text-[10px] font-medium text-[#A33A3A]">
                      {selectedProject.issue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-[10px] text-[#667085]">
                      Current Status
                    </span>

                    <span
                      className={`rounded-full border px-2 py-1 text-[9px] font-medium ${getStatusStyles(
                        selectedProject.status
                      )}`}
                    >
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Message */}
              {actionMessage && (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-[#CFE5D7] bg-[#F4FAF6] px-3 py-3">
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-[#39704E]"
                  />

                  <p className="text-[10px] leading-4 text-[#39704E]">
                    {actionMessage}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleAction("Approval")}
                  className="flex items-center justify-center gap-2 rounded-md border border-[#CFE5D7] bg-[#F4FAF6] px-3 py-2.5 text-[10px] font-semibold text-[#39704E] transition-colors hover:bg-[#ECF7F0]"
                >
                  <CheckCircle2 size={14} />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => handleAction("Review flag")}
                  className="flex items-center justify-center gap-2 rounded-md border border-[#D7E2EC] bg-[#F2F6FA] px-3 py-2.5 text-[10px] font-semibold text-[#315D82] transition-colors hover:bg-[#EAF1F7]"
                >
                  <Flag size={14} />
                  Flag for Review
                </button>

                <button
                  type="button"
                  onClick={() => handleAction("Payment freeze")}
                  className="flex items-center justify-center gap-2 rounded-md border border-[#F0D2D2] bg-[#FDF3F3] px-3 py-2.5 text-[10px] font-semibold text-[#A33A3A] transition-colors hover:bg-[#FCECEC]"
                >
                  <Lock size={14} />
                  Freeze Payment
                </button>
              </div>

              <p className="mt-4 text-[9px] leading-4 text-[#98A2B3]">
                Demonstration controls only. In the production system,
                these actions will be connected to the auditor workflow
                and backend authorization services.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}