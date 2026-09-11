"use client";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { useEffect, useRef } from "react";

import "leaflet/dist/leaflet.css";

type RiskLevel = "safe" | "medium" | "high";

interface Project {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  riskLevel: RiskLevel;
  riskScore: number;
  funds: string;
  anomaly: string;
}

/* =========================================================
   DEMONSTRATION PROJECT DATA
   Production API data can replace this later.
   ========================================================= */

const projects: Project[] = [
  {
    id: "MPLADS-HP-014",
    name: "Community Road Development",
    location: "Shimla, Himachal Pradesh",
    latitude: 31.1048,
    longitude: 77.1734,
    riskLevel: "high",
    riskScore: 92,
    funds: "₹18.5 Lakh",
    anomaly: "Image mismatch detected",
  },
  {
    id: "MPLADS-PB-021",
    name: "Public Infrastructure Project",
    location: "Chandigarh",
    latitude: 30.7333,
    longitude: 76.7794,
    riskLevel: "medium",
    riskScore: 64,
    funds: "₹12.8 Lakh",
    anomaly: "Documentation variance",
  },
  {
    id: "MPLADS-RJ-032",
    name: "Village Road Improvement",
    location: "Jaipur, Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
    riskLevel: "high",
    riskScore: 81,
    funds: "₹21.4 Lakh",
    anomaly: "Visual evidence requires review",
  },
  {
    id: "MPLADS-MP-018",
    name: "Community Hall Construction",
    location: "Bhopal, Madhya Pradesh",
    latitude: 23.2599,
    longitude: 77.4126,
    riskLevel: "safe",
    riskScore: 18,
    funds: "₹15.2 Lakh",
    anomaly: "No significant anomaly",
  },
  {
    id: "MPLADS-GJ-027",
    name: "Rural Road Development",
    location: "Ahmedabad, Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
    riskLevel: "medium",
    riskScore: 58,
    funds: "₹16.7 Lakh",
    anomaly: "Verification pending",
  },
  {
    id: "MPLADS-KA-041",
    name: "Public Facility Development",
    location: "Bengaluru, Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    riskLevel: "safe",
    riskScore: 14,
    funds: "₹19.1 Lakh",
    anomaly: "No significant anomaly",
  },
  {
    id: "MPLADS-WB-019",
    name: "Local Infrastructure Upgrade",
    location: "Kolkata, West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
    riskLevel: "high",
    riskScore: 76,
    funds: "₹17.9 Lakh",
    anomaly: "Project evidence variance",
  },
  {
    id: "MPLADS-TS-013",
    name: "Community Development Work",
    location: "Hyderabad, Telangana",
    latitude: 17.385,
    longitude: 78.4867,
    riskLevel: "safe",
    riskScore: 22,
    funds: "₹11.6 Lakh",
    anomaly: "No significant anomaly",
  },
  {
    id: "MPLADS-KL-024",
    name: "Public Road Improvement",
    location: "Kochi, Kerala",
    latitude: 9.9312,
    longitude: 76.2673,
    riskLevel: "medium",
    riskScore: 51,
    funds: "₹13.5 Lakh",
    anomaly: "Manual verification required",
  },
];

/* =========================================================
   RISK HELPERS
   ========================================================= */

function getRiskColor(riskLevel: RiskLevel) {
  switch (riskLevel) {
    case "high":
      return "#B54747";

    case "medium":
      return "#B7791F";

    case "safe":
      return "#3F7D58";

    default:
      return "#52606D";
  }
}

function getRiskLabel(riskLevel: RiskLevel) {
  switch (riskLevel) {
    case "high":
      return "High Risk";

    case "medium":
      return "Medium";

    case "safe":
      return "Safe";

    default:
      return "Unknown";
  }
}

function getRiskBackground(riskLevel: RiskLevel) {
  switch (riskLevel) {
    case "high":
      return "#FAEEEE";

    case "medium":
      return "#FBF4E8";

    case "safe":
      return "#EEF6F0";

    default:
      return "#F5F7F9";
  }
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function ProjectMap() {
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);

  /* =======================================================
     LEAFLET CLEANUP
     Prevents map container reuse errors during development.
     ======================================================= */

  useEffect(() => {
    return () => {
      const container = mapWrapperRef.current;

      if (container) {
        const leafletContainer = container.querySelector(
          ".leaflet-container"
        ) as HTMLElement | null;

        if (leafletContainer) {
          const internalElement = leafletContainer as HTMLElement & {
            _leaflet_id?: number;
          };

          delete internalElement._leaflet_id;
        }
      }
    };
  }, []);

  const safeCount = projects.filter(
    (project) => project.riskLevel === "safe"
  ).length;

  const mediumCount = projects.filter(
    (project) => project.riskLevel === "medium"
  ).length;

  const highCount = projects.filter(
    (project) => project.riskLevel === "high"
  ).length;

  return (
    <section
      ref={mapWrapperRef}
      className="overflow-hidden rounded-lg border border-[#D9E1E8] bg-white shadow-sm"
    >
      {/* ===================================================
          MAP HEADER
          =================================================== */}

      <div className="flex flex-col gap-4 border-b border-[#D9E1E8] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#3F7D58]" />

            <h3 className="text-sm font-semibold text-[#1F2933]">
              Project Risk Map
            </h3>
          </div>

          <p className="mt-1 text-[11px] text-[#7B8794]">
            Geospatial distribution of monitored MPLADS projects
            across India
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-[#D9E1E8] bg-[#F8FAFB] px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3F7D58]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#52606D]">
              Monitoring Active
            </span>
          </div>

          <div className="rounded-md border border-[#D9E1E8] bg-white px-3 py-2">
            <span className="text-[10px] font-medium text-[#52606D]">
              India
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================
          MAP
          =================================================== */}

      <div className="relative h-[420px] w-full">
        <MapContainer
          center={[22.5, 79]}
          zoom={4.7}
          minZoom={4}
          maxZoom={8}
          scrollWheelZoom={true}
          zoomControl={false}
          className="h-full w-full"
        >
          {/* LIGHT CARTO BASEMAP */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <ZoomControl position="bottomright" />

          {/* PROJECT MARKERS */}

          {projects.map((project) => {
            const riskColor = getRiskColor(
              project.riskLevel
            );

            return (
              <CircleMarker
                key={project.id}
                center={[
                  project.latitude,
                  project.longitude,
                ]}
                radius={
                  project.riskLevel === "high"
                    ? 9
                    : project.riskLevel === "medium"
                      ? 8
                      : 7
                }
                pathOptions={{
                  color: "#ffffff",
                  weight: 2,
                  fillColor: riskColor,
                  fillOpacity: 0.9,
                }}
              >
                <Popup>
                  <div
                    style={{
                      minWidth: "230px",
                      fontFamily: "Arial, Helvetica, sans-serif",
                    }}
                  >
                    {/* Popup Header */}

                    <div
                      style={{
                        borderBottom:
                          "1px solid #DFE5EA",
                        paddingBottom: "9px",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#7B8794",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        MPLADS Project
                      </div>

                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#1F2933",
                        }}
                      >
                        {project.id}
                      </div>
                    </div>

                    {/* Project Name */}

                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#1F2933",
                        marginBottom: "5px",
                      }}
                    >
                      {project.name}
                    </div>

                    {/* Location */}

                    <div
                      style={{
                        fontSize: "11px",
                        color: "#52606D",
                        marginBottom: "12px",
                      }}
                    >
                      {project.location}
                    </div>

                    {/* Risk */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: "5px",
                        backgroundColor:
                          getRiskBackground(
                            project.riskLevel
                          ),
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#52606D",
                        }}
                      >
                        Risk Classification
                      </span>

                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: riskColor,
                        }}
                      >
                        {getRiskLabel(
                          project.riskLevel
                        )}
                      </span>
                    </div>

                    {/* Risk Score */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px 0",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#7B8794",
                        }}
                      >
                        Risk Score
                      </span>

                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#1F2933",
                        }}
                      >
                        {project.riskScore}/100
                      </span>
                    </div>

                    {/* Funds */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px 0",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#7B8794",
                        }}
                      >
                        Project Funds
                      </span>

                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#1F2933",
                        }}
                      >
                        {project.funds}
                      </span>
                    </div>

                    {/* Anomaly */}

                    <div
                      style={{
                        marginTop: "8px",
                        paddingTop: "9px",
                        borderTop:
                          "1px solid #DFE5EA",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "#7B8794",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Monitoring Finding
                      </div>

                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "10px",
                          color:
                            project.riskLevel ===
                            "safe"
                              ? "#3F7D58"
                              : project.riskLevel ===
                                  "medium"
                                ? "#B7791F"
                                : "#B54747",
                        }}
                      >
                        {project.anomaly}
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* =================================================
            RISK LEGEND
            ================================================= */}

        <div className="absolute left-3 top-3 z-[500] w-[175px] rounded-md border border-[#D9E1E8] bg-white/95 p-3 shadow-sm backdrop-blur-sm">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#52606D]">
            Risk Classification
          </p>

          <div className="mt-3 space-y-2">
            {/* Safe */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#3F7D58]" />

                <span className="text-[10px] text-[#52606D]">
                  Safe
                </span>
              </div>

              <span className="text-[10px] font-medium text-[#7B8794]">
                {safeCount}
              </span>
            </div>

            {/* Medium */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#B7791F]" />

                <span className="text-[10px] text-[#52606D]">
                  Medium
                </span>
              </div>

              <span className="text-[10px] font-medium text-[#7B8794]">
                {mediumCount}
              </span>
            </div>

            {/* High */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#B54747]" />

                <span className="text-[10px] text-[#52606D]">
                  High Risk
                </span>
              </div>

              <span className="text-[10px] font-medium text-[#7B8794]">
                {highCount}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            LIVE MONITORING
            ================================================= */}

        <div className="absolute right-3 top-3 z-[500] rounded-md border border-[#D9E1E8] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3F7D58]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#52606D]">
              Live Monitoring
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================
          MAP SUMMARY
          =================================================== */}

      <div className="grid grid-cols-2 divide-x divide-[#DFE5EA] border-t border-[#D9E1E8] bg-[#F8FAFB] sm:grid-cols-4">
        <div className="px-4 py-3 sm:px-5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
            Projects
          </p>

          <p className="mt-1 text-sm font-semibold text-[#1F2933]">
            {projects.length}
          </p>
        </div>

        <div className="px-4 py-3 sm:px-5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
            Safe
          </p>

          <p className="mt-1 text-sm font-semibold text-[#3F7D58]">
            {safeCount}
          </p>
        </div>

        <div className="px-4 py-3 sm:px-5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
            Review
          </p>

          <p className="mt-1 text-sm font-semibold text-[#B7791F]">
            {mediumCount}
          </p>
        </div>

        <div className="px-4 py-3 sm:px-5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#7B8794]">
            High Risk
          </p>

          <p className="mt-1 text-sm font-semibold text-[#B54747]">
            {highCount}
          </p>
        </div>
      </div>

      {/* ===================================================
          FOOTER
          =================================================== */}

      <div className="border-t border-[#DFE5EA] bg-white px-4 py-3 sm:px-5">
        <p className="text-[9px] leading-4 text-[#7B8794]">
          Demonstration project locations and risk
          classifications. Production geospatial data will be
          connected to the MPLADS e-SAKSHI monitoring source.
        </p>
      </div>
    </section>
  );
}