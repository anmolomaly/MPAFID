"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  Image as ImageIcon,
  Lock,
  ScanSearch,
  ShieldAlert,
  X,
} from "lucide-react";
import { useState } from "react";

const referenceImage =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Road_construction_India.jpg";

const submittedImage =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Road_construction_under_process.jpg";

export default function ImageForensicsPanel() {
  const [selectedView, setSelectedView] = useState<
    "reference" | "submitted"
  >("submitted");

  const [actionMessage, setActionMessage] =
    useState("");

  const handleAction = (action: string) => {
    setActionMessage(
      `${action} action recorded for MPLADS-HP-014.`
    );
  };

  return (
    <section className="overflow-hidden rounded-lg border border-[#D9E1E8] bg-white shadow-sm">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex flex-col gap-4 border-b border-[#D9E1E8] bg-white px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ScanSearch
              size={17}
              className="text-[#2F6B8A]"
            />

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7B8794]">
                AI-Assisted Verification
              </p>

              <h2 className="mt-1 text-base font-semibold text-[#1F2933]">
                Image Forensics
              </h2>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-[#7B8794]">
            Compare submitted project imagery with reference
            evidence for visual verification.
          </p>
        </div>

        {/* Status */}

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-2 rounded-md border border-[#E7CACA] bg-[#FAEEEE] px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B54747]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#B54747]">
              Review Required
            </span>
          </div>

          <div className="rounded-md border border-[#E8D8B8] bg-[#FBF4E8] px-3 py-2">
            <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#B7791F]">
              Visual Anomaly
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          PROJECT SUMMARY
          ===================================================== */}

      <div className="grid grid-cols-2 divide-x divide-[#DFE5EA] border-b border-[#D9E1E8] bg-[#F8FAFB] sm:grid-cols-4">
        <div className="px-4 py-4 sm:px-5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
            Project ID
          </p>

          <p className="mt-1 text-xs font-semibold text-[#1F2933]">
            MPLADS-HP-014
          </p>
        </div>

        <div className="px-4 py-4 sm:px-5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
            Risk Score
          </p>

          <p className="mt-1 text-sm font-semibold text-[#B54747]">
            92
          </p>
        </div>

        <div className="px-4 py-4 sm:px-5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
            Fraud Type
          </p>

          <p className="mt-1 text-xs font-semibold text-[#1F2933]">
            Image Mismatch
          </p>
        </div>

        <div className="px-4 py-4 sm:px-5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
            AI Confidence
          </p>

          <p className="mt-1 text-sm font-semibold text-[#B54747]">
            94.2%
          </p>
        </div>
      </div>

      {/* =====================================================
          IMAGE COMPARISON
          ===================================================== */}

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7B8794]">
              Visual Evidence Comparison
            </p>

            <p className="mt-1 text-[11px] text-[#52606D]">
              Reference evidence vs submitted project image
            </p>
          </div>

          <div className="hidden items-center gap-1 rounded-md border border-[#D9E1E8] bg-[#F8FAFB] p-1 sm:flex">
            <button
              type="button"
              onClick={() =>
                setSelectedView("reference")
              }
              className={`rounded px-2.5 py-1.5 text-[9px] font-medium transition-colors ${
                selectedView === "reference"
                  ? "bg-white text-[#123B5D] shadow-sm"
                  : "text-[#7B8794] hover:text-[#52606D]"
              }`}
            >
              Reference
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedView("submitted")
              }
              className={`rounded px-2.5 py-1.5 text-[9px] font-medium transition-colors ${
                selectedView === "submitted"
                  ? "bg-white text-[#123B5D] shadow-sm"
                  : "text-[#7B8794] hover:text-[#52606D]"
              }`}
            >
              Submitted
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* =================================================
              REFERENCE IMAGE
              ================================================= */}

          <div
            className={`overflow-hidden rounded-md border ${
              selectedView === "reference"
                ? "border-[#2F6B8A]"
                : "border-[#D9E1E8]"
            } bg-[#F8FAFB]`}
          >
            <div className="flex items-center justify-between border-b border-[#D9E1E8] bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <ImageIcon
                  size={14}
                  className="text-[#2F6B8A]"
                />

                <span className="text-[10px] font-semibold text-[#1F2933]">
                  Reference Image
                </span>
              </div>

              <span className="rounded bg-[#EEF4F8] px-2 py-1 text-[8px] font-medium uppercase tracking-[0.08em] text-[#2F6B8A]">
                Verified Source
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedView("reference")
              }
              className="block w-full cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden bg-[#E8EDF1]">
                <img
                  src={referenceImage}
                  alt="Reference road construction evidence"
                  className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.01]"
                />

                <div className="absolute bottom-2 left-2 rounded bg-white/95 px-2 py-1 shadow-sm">
                  <span className="text-[8px] font-medium text-[#52606D]">
                    Reference evidence
                  </span>
                </div>
              </div>
            </button>

            <div className="border-t border-[#D9E1E8] px-3 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={13}
                  className="text-[#3F7D58]"
                />

                <span className="text-[10px] text-[#52606D]">
                  Reference image available for comparison
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              SUBMITTED IMAGE
              ================================================= */}

          <div
            className={`overflow-hidden rounded-md border ${
              selectedView === "submitted"
                ? "border-[#B54747]"
                : "border-[#D9E1E8]"
            } bg-[#F8FAFB]`}
          >
            <div className="flex items-center justify-between border-b border-[#D9E1E8] bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <ImageIcon
                  size={14}
                  className="text-[#B54747]"
                />

                <span className="text-[10px] font-semibold text-[#1F2933]">
                  Submitted Image
                </span>
              </div>

              <span className="rounded bg-[#FAEEEE] px-2 py-1 text-[8px] font-medium uppercase tracking-[0.08em] text-[#B54747]">
                Review Required
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedView("submitted")
              }
              className="block w-full cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden bg-[#E8EDF1]">
                <img
                  src={submittedImage}
                  alt="Submitted project construction evidence"
                  className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.01]"
                />

                <div className="absolute bottom-2 left-2 rounded bg-white/95 px-2 py-1 shadow-sm">
                  <span className="text-[8px] font-medium text-[#52606D]">
                    Submitted evidence
                  </span>
                </div>
              </div>
            </button>

            <div className="border-t border-[#D9E1E8] px-3 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  size={13}
                  className="text-[#B54747]"
                />

                <span className="text-[10px] text-[#52606D]">
                  Visual difference detected by verification
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FORENSIC RESULT
            ================================================= */}

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
          {/* Finding */}

          <div className="rounded-md border border-[#E7CACA] bg-[#FAEEEE] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white">
                <ShieldAlert
                  size={16}
                  className="text-[#B54747]"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#8F3636]">
                  Potential Image Mismatch Detected
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#6F4545]">
                  Automated visual comparison indicates
                  differences between the submitted image and
                  the available reference evidence. Manual
                  auditor verification is recommended before
                  project approval.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded border border-[#E7CACA] bg-white px-2 py-1 text-[8px] font-medium text-[#8F3636]">
                    Scene Mismatch
                  </span>

                  <span className="rounded border border-[#E7CACA] bg-white px-2 py-1 text-[8px] font-medium text-[#8F3636]">
                    Structure Variance
                  </span>

                  <span className="rounded border border-[#E7CACA] bg-white px-2 py-1 text-[8px] font-medium text-[#8F3636]">
                    Manual Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Confidence */}

          <div className="rounded-md border border-[#D9E1E8] bg-[#F8FAFB] p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7B8794]">
              AI Confidence
            </p>

            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-semibold text-[#B54747]">
                94.2%
              </p>

              <span className="mb-1 text-[9px] text-[#7B8794]">
                High confidence
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E3E8EC]">
              <div
                className="h-full rounded-full bg-[#B54747]"
                style={{ width: "94.2%" }}
              />
            </div>

            <p className="mt-2 text-[9px] leading-4 text-[#7B8794]">
              Demonstration confidence value for the
              dashboard interface.
            </p>
          </div>
        </div>

        {/* =================================================
            AUDITOR ACTIONS
            ================================================= */}

        <div className="mt-5 border-t border-[#D9E1E8] pt-4">
          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7B8794]">
            Auditor Actions
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {/* Approve */}

            <button
              type="button"
              onClick={() => handleAction("Approve")}
              className="flex items-center justify-center gap-2 rounded-md border border-[#BFD8C8] bg-[#EEF6F0] px-4 py-2.5 text-xs font-medium text-[#3F7D58] transition-colors hover:bg-[#E4F1E7]"
            >
              <CheckCircle2 size={15} />

              Approve
            </button>

            {/* Flag */}

            <button
              type="button"
              onClick={() => handleAction("Flag")}
              className="flex items-center justify-center gap-2 rounded-md border border-[#E8D8B8] bg-[#FBF4E8] px-4 py-2.5 text-xs font-medium text-[#B7791F] transition-colors hover:bg-[#F8EEDC]"
            >
              <Flag size={15} />

              Flag for Review
            </button>

            {/* Freeze */}

            <button
              type="button"
              onClick={() =>
                handleAction("Freeze Payment")
              }
              className="flex items-center justify-center gap-2 rounded-md border border-[#E7CACA] bg-[#FAEEEE] px-4 py-2.5 text-xs font-medium text-[#B54747] transition-colors hover:bg-[#F6E4E4]"
            >
              <Lock size={15} />

              Freeze Payment
            </button>
          </div>

          {/* Confirmation */}

          {actionMessage && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-[#C9D8E3] bg-[#EEF4F8] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={14}
                  className="text-[#3F7D58]"
                />

                <p className="text-[10px] text-[#52606D]">
                  {actionMessage}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActionMessage("")}
                className="text-[#7B8794] hover:text-[#1F2933]"
                aria-label="Dismiss confirmation"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div className="border-t border-[#D9E1E8] bg-[#F8FAFB] px-4 py-3 sm:px-5">
        <p className="text-[9px] leading-4 text-[#7B8794]">
          Demonstration image-forensics data. Production
          image analysis results will be connected to the
          authorized AI verification service.
        </p>
      </div>
    </section>
  );
}