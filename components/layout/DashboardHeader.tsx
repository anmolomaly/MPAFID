"use client";

import {
  Bell,
  ChevronDown,
  CircleCheck,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

const regions = [
  "All India",
  "North India",
  "South India",
  "East India",
  "West India",
  "Central India",
];

const notifications = [
  {
    id: 1,
    title: "High-risk project detected",
    message: "MPLADS-HP-014 requires immediate review.",
    time: "5 min ago",
    type: "high",
  },
  {
    id: 2,
    title: "Image mismatch detected",
    message: "Visual evidence requires auditor verification.",
    time: "18 min ago",
    type: "high",
  },
  {
    id: 3,
    title: "Verification completed",
    message: "MPLADS-MP-018 passed automated verification.",
    time: "42 min ago",
    type: "safe",
  },
  {
    id: 4,
    title: "Risk score updated",
    message: "Three projects received updated risk scores.",
    time: "1 hr ago",
    type: "medium",
  },
  {
    id: 5,
    title: "System check completed",
    message: "All monitoring services are operational.",
    time: "2 hrs ago",
    type: "safe",
  },
];

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState("All India");

  const closeAll = () => {
    setRegionOpen(false);
    setNotificationOpen(false);
    setStatusOpen(false);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setRegionOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[1000] border-b border-[#D9E1E8] bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:pl-[272px]">
          {/* Left Section */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#D9E1E8] bg-[#F7F9FB] text-[#344054] transition-colors hover:bg-[#EEF3F7] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>

            <div className="hidden min-w-0 sm:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#667085]">
                Government Monitoring Portal
              </p>

              <p className="truncate text-sm font-semibold text-[#172B4D]">
                MPLADS e-SAKSHI
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Region Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  setRegionOpen((value) => !value);
                }}
                className="flex h-9 items-center gap-2 rounded-md border border-[#D9E1E8] bg-white px-3 text-xs font-medium text-[#344054] transition-colors hover:bg-[#F7F9FB]"
              >
                <span className="hidden sm:inline">Region:</span>
                <span className="text-[#172B4D]">{selectedRegion}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    regionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {regionOpen && (
                <div className="absolute right-0 top-11 z-[1100] w-48 overflow-hidden rounded-md border border-[#D9E1E8] bg-white shadow-lg">
                  <div className="border-b border-[#E5EAF0] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#667085]">
                      Select Region
                    </p>
                  </div>

                  <div className="p-1">
                    {regions.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => handleRegionSelect(region)}
                        className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs transition-colors ${
                          selectedRegion === region
                            ? "bg-[#EEF4FA] font-medium text-[#174A7C]"
                            : "text-[#475467] hover:bg-[#F7F9FB]"
                        }`}
                      >
                        <span>{region}</span>

                        {selectedRegion === region && (
                          <CircleCheck size={14} className="text-[#174A7C]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  setNotificationOpen((value) => !value);
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#D9E1E8] bg-white text-[#475467] transition-colors hover:bg-[#F7F9FB]"
                aria-label="Notifications"
              >
                <Bell size={17} />

                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#B54747]" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-11 z-[1100] w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-[#D9E1E8] bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#E5EAF0] px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#172B4D]">
                        Notifications
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#667085]">
                        Recent monitoring activity
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FCECEC] px-2 py-1 text-[9px] font-semibold text-[#A33A3A]">
                      5 alerts
                    </span>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.map((notification) => {
                      const typeStyles =
                        notification.type === "high"
                          ? "bg-[#FCECEC] text-[#A33A3A]"
                          : notification.type === "medium"
                            ? "bg-[#FFF6E5] text-[#9A6700]"
                            : "bg-[#ECF7F0] text-[#39704E]";

                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => setNotificationOpen(false)}
                          className="flex w-full gap-3 border-b border-[#EEF2F5] px-4 py-3 text-left transition-colors hover:bg-[#F8FAFC]"
                        >
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${typeStyles}`}
                          >
                            {notification.type === "safe" ? (
                              <CircleCheck size={14} />
                            ) : (
                              <Bell size={13} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#344054]">
                              {notification.title}
                            </p>

                            <p className="mt-1 text-[11px] leading-4 text-[#667085]">
                              {notification.message}
                            </p>

                            <p className="mt-1.5 text-[9px] text-[#98A2B3]">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#E5EAF0] bg-[#F8FAFC] px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => setNotificationOpen(false)}
                      className="text-[10px] font-medium text-[#174A7C] hover:underline"
                    >
                      Mark all notifications as reviewed
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* System Status */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  setStatusOpen((value) => !value);
                }}
                className="flex h-9 items-center gap-2 rounded-md border border-[#CFE5D7] bg-[#F4FAF6] px-3 text-xs font-medium text-[#39704E] transition-colors hover:bg-[#ECF7F0]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4F8A65] opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4F8A65]" />
                </span>

                <span className="hidden sm:inline">System</span>
                <span className="font-semibold">Operational</span>

                <ChevronDown
                  size={13}
                  className={`transition-transform ${
                    statusOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {statusOpen && (
                <div className="absolute right-0 top-11 z-[1100] w-72 overflow-hidden rounded-md border border-[#D9E1E8] bg-white shadow-lg">
                  <div className="border-b border-[#E5EAF0] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#667085]">
                      System Status
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#4F8A65]" />
                      <p className="text-sm font-semibold text-[#172B4D]">
                        All systems operational
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-[#EEF2F5]">
                    {[
                      ["Monitoring Engine", "Operational"],
                      ["Risk Detection", "Active"],
                      ["Image Analysis", "Online"],
                      ["Data Processing", "Operational"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between px-4 py-2.5"
                      >
                        <span className="text-[11px] text-[#667085]">
                          {label}
                        </span>

                        <span className="text-[10px] font-semibold text-[#39704E]">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#E5EAF0] bg-[#F8FAFC] px-4 py-2.5">
                    <p className="text-[9px] leading-4 text-[#98A2B3]">
                      Last system check completed successfully.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-[1050] bg-black/20 lg:hidden"
        />
      )}

      {/* Mobile Header Helper */}
      {mobileMenuOpen && (
        <div className="fixed left-0 top-0 z-[1200] flex h-16 w-full items-center justify-between border-b border-[#D9E1E8] bg-white px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EEF4FA] text-[#174A7C]">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#172B4D]">
                MPAFID
              </p>
              <p className="text-[9px] text-[#667085]">
                Command Dashboard
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#D9E1E8] bg-[#F7F9FB] text-[#475467]"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Close dropdowns when clicking elsewhere */}
      {(regionOpen || notificationOpen || statusOpen) && (
        <button
          type="button"
          aria-label="Close open menu"
          onClick={closeAll}
          className="fixed inset-0 z-[900] cursor-default bg-transparent"
        />
      )}
    </>
  );
}