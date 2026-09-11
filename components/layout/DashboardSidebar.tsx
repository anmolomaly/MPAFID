"use client";

import {
  BarChart3,
  Bell,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  LayoutDashboard,
  Map,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    label: "Dashboard Overview",
    href: "#overview",
    icon: LayoutDashboard,
  },
  {
    label: "Project Monitoring",
    href: "#project-monitoring",
    icon: Map,
  },
  {
    label: "Active Risk Queue",
    href: "#risk-queue",
    icon: Bell,
  },
  {
    label: "Image Forensics",
    href: "#image-forensics",
    icon: FileSearch,
  },
  {
    label: "Fraud Analytics",
    href: "#fraud-analytics",
    icon: BarChart3,
  },
];

export default function DashboardSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard Overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (label: string, href: string) => {
    setActiveItem(label);
    setMobileOpen(false);

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navigation = (
    <nav className="flex-1 overflow-y-auto px-3 py-5">
      <p className="px-2 pb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#98A2B3]">
        Monitoring
      </p>

      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavigation(item.label, item.href)}
              className={`group flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-all ${
                isActive
                  ? "border-[#C9D9E8] bg-[#EEF4FA] text-[#174A7C] shadow-sm"
                  : "border-transparent text-[#475467] hover:border-[#E5EAF0] hover:bg-[#F7F9FB]"
              }`}
            >
              <Icon
                size={17}
                className={
                  isActive
                    ? "text-[#174A7C]"
                    : "text-[#667085] group-hover:text-[#344054]"
                }
              />

              <span className="flex-1 text-xs font-medium">
                {item.label}
              </span>

              {isActive && (
                <ChevronRight
                  size={14}
                  className="text-[#174A7C]"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <p className="px-2 pb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#98A2B3]">
          Auditor Tools
        </p>

        <div className="overflow-hidden rounded-md border border-[#E1E8EF] bg-[#FAFBFC]">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#EEF4FA] text-[#174A7C]">
              <ClipboardCheck size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#344054]">
                Verification Engine
              </p>

              <p className="mt-0.5 text-[9px] text-[#667085]">
                Automated monitoring active
              </p>
            </div>
          </div>

          <div className="border-t border-[#E5EAF0] px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-[#667085]">
                Processing status
              </span>

              <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#39704E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F8A65]" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const settings = (
    <div className="border-t border-[#E5EAF0] p-3">
      <button
        type="button"
        onClick={() => handleNavigation("System Settings", "#settings")}
        className="flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-left text-[#475467] transition-colors hover:border-[#E5EAF0] hover:bg-[#F7F9FB]"
      >
        <Settings size={17} className="text-[#667085]" />

        <span className="flex-1 text-xs font-medium">
          System Settings
        </span>

        <ChevronRight size={14} className="text-[#98A2B3]" />
      </button>

      <div className="mt-2 px-3 pb-1">
        <p className="text-[8px] leading-4 text-[#98A2B3]">
          MPAFID Monitoring System
        </p>

        <p className="text-[8px] text-[#98A2B3]">
          Government monitoring interface
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="fixed inset-y-0 left-0 z-[900] hidden w-64 border-r border-[#D9E1E8] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#E5EAF0] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#C9D9E8] bg-[#EEF4FA] text-[#174A7C]">
              <ShieldCheck size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#667085]">
                Government Portal
              </p>

              <h1 className="mt-0.5 truncate text-sm font-bold text-[#172B4D]">
                MPAFID
              </h1>

              <p className="truncate text-[10px] text-[#667085]">
                Command Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="mx-4 mt-4 rounded-md border border-[#E1E8EF] bg-[#F7F9FB] px-3 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#667085]">
            Monitoring System
          </p>

          <p className="mt-1 text-[11px] font-medium text-[#344054]">
            MPLADS e-SAKSHI
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F8A65]" />

            <span className="text-[9px] font-medium text-[#39704E]">
              System Operational
            </span>
          </div>
        </div>

        {navigation}

        {settings}
      </aside>

      {/* =====================================================
          MOBILE MENU BUTTON
      ====================================================== */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-[1000] flex h-11 w-11 items-center justify-center rounded-full border border-[#D9E1E8] bg-white text-[#315D82] shadow-lg lg:hidden"
        aria-label="Open dashboard navigation"
      >
        <LayoutDashboard size={19} />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[1200] bg-[#172B4D]/20 backdrop-blur-[1px] lg:hidden"
          aria-label="Close navigation"
        />
      )}

      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-[1300] flex w-[285px] flex-col border-r border-[#D9E1E8] bg-white shadow-2xl transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E5EAF0] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#C9D9E8] bg-[#EEF4FA] text-[#174A7C]">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] text-[#667085]">
                Government Portal
              </p>

              <p className="text-sm font-bold text-[#172B4D]">
                MPAFID
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#D9E1E8] bg-[#F7F9FB] text-[#475467] hover:bg-[#EEF2F6]"
            aria-label="Close navigation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mx-4 mt-4 rounded-md border border-[#CFE5D7] bg-[#F4FAF6] px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4F8A65]" />

            <p className="text-[10px] font-semibold text-[#39704E]">
              System Operational
            </p>
          </div>

          <p className="mt-1 text-[9px] text-[#667085]">
            MPLADS e-SAKSHI Monitoring System
          </p>
        </div>

        {navigation}

        {settings}
      </aside>
    </>
  );
}