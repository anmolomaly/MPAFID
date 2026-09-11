"use client";

import dynamic from "next/dynamic";

import KpiGrid from "@/components/dashboard/KpiGrid";
import ImageForensicsPanel from "@/components/risk/ImageForensicsPanel";
import ActiveRiskQueue from "@/components/risk/ActiveRiskQueue";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

const ProjectMap = dynamic(
  () => import("@/components/map/ProjectMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-[#D9E1E8] bg-white">
        <div className="text-center">
          <div className="mx-auto mb-3 h-7 w-7 animate-pulse rounded-full border-2 border-[#D9E1E8] border-t-[#315D82]" />

          <p className="text-sm text-[#475467]">
            Loading project map...
          </p>

          <p className="mt-1 text-xs text-[#98A2B3]">
            Initialising geospatial monitoring
          </p>
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F4F6F8] text-[#172B4D]">
      <DashboardSidebar />

      <section className="min-w-0 lg:ml-64">
        <DashboardHeader />

        <div className="px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-24">
          {/* =====================================================
              PAGE INTRODUCTION
          ====================================================== */}
          <section
            id="overview"
            className="scroll-mt-24"
          >
            <div className="mb-6 border-b border-[#D9E1E8] pb-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
                    National Monitoring Command
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#172B4D] sm:text-[28px]">
                    MPAFID Command Dashboard
                  </h2>

                  <p className="mt-1 text-sm text-[#667085]">
                    MPLADS e-SAKSHI Monitoring System
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-md border border-[#CFE5D7] bg-[#F4FAF6] px-3 py-2 sm:self-auto">
                  <span className="h-2 w-2 rounded-full bg-[#4F8A65]" />

                  <span className="text-[10px] font-semibold text-[#39704E]">
                    Monitoring System Operational
                  </span>
                </div>
              </div>
            </div>

            <KpiGrid />
          </section>

          {/* =====================================================
              PROJECT MONITORING
          ====================================================== */}
          <section
            id="project-monitoring"
            className="mt-10 scroll-mt-24"
          >
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Geospatial Monitoring
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[#172B4D]">
                Project Monitoring
              </h2>

              <p className="mt-1 max-w-3xl text-sm leading-5 text-[#667085]">
                Monitor the geographic distribution, verification status,
                and risk classification of MPLADS projects across India.
              </p>
            </div>

            <ProjectMap />
          </section>

          {/* =====================================================
              ACTIVE RISK QUEUE
          ====================================================== */}
          <section
            id="risk-queue"
            className="mt-10 scroll-mt-24"
          >
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Auditor Review
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[#172B4D]">
                Active Risk Queue
              </h2>

              <p className="mt-1 max-w-3xl text-sm leading-5 text-[#667085]">
                Review projects that require auditor attention based on
                risk indicators, verification results, and detected
                anomalies.
              </p>
            </div>

            <ActiveRiskQueue />
          </section>

          {/* =====================================================
              IMAGE FORENSICS
          ====================================================== */}
          <section
            id="image-forensics"
            className="mt-10 scroll-mt-24"
          >
            <ImageForensicsPanel />
          </section>

          {/* =====================================================
              FRAUD ANALYTICS
          ====================================================== */}
          <section
            id="fraud-analytics"
            className="mt-10 scroll-mt-24"
          >
            <AnalyticsSection />
          </section>

          {/* =====================================================
              SYSTEM SETTINGS
          ====================================================== */}
          <section
            id="settings"
            className="mt-10 scroll-mt-24"
          >
            <div className="rounded-lg border border-[#D9E1E8] bg-white shadow-sm">
              <div className="border-b border-[#E5EAF0] px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  System Configuration
                </p>

                <h2 className="mt-1 text-lg font-semibold text-[#172B4D]">
                  System Settings
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Dashboard configuration and monitoring controls.
                </p>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-md border border-[#E1E8EF] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold text-[#344054]">
                    Monitoring Engine
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#667085]">
                    Automated project monitoring and risk detection
                    services.
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#4F8A65]" />

                    <span className="text-[10px] font-semibold text-[#39704E]">
                      Operational
                    </span>
                  </div>
                </div>

                <div className="rounded-md border border-[#E1E8EF] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold text-[#344054]">
                    Image Analysis
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#667085]">
                    Visual evidence analysis and image mismatch
                    detection.
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#4F8A65]" />

                    <span className="text-[10px] font-semibold text-[#39704E]">
                      Online
                    </span>
                  </div>
                </div>

                <div className="rounded-md border border-[#E1E8EF] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold text-[#344054]">
                    Data Processing
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#667085]">
                    Project records and verification data processing
                    pipeline.
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#4F8A65]" />

                    <span className="text-[10px] font-semibold text-[#39704E]">
                      Operational
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5EAF0] bg-[#FAFBFC] px-5 py-3">
                <p className="text-[9px] leading-4 text-[#98A2B3]">
                  Demonstration interface. Production monitoring
                  services and configuration controls will be connected
                  to the backend system.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              FOOTER
          ====================================================== */}
          <footer className="mt-10 border-t border-[#D9E1E8] pt-5">
            <div className="flex flex-col gap-2 text-[9px] text-[#98A2B3] sm:flex-row sm:items-center sm:justify-between">
              <p>
                MPAFID Command Dashboard · MPLADS e-SAKSHI Monitoring
                System
              </p>

              <p>
                Demonstration frontend · Production API integration
                pending
              </p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}