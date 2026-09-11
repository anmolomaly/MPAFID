import {
  DashboardKPI,
  ForensicImage,
  FraudTrendPoint,
  Project,
  RiskAlert,
  RiskDistribution,
} from "@/types/dashboard";

/*
 * Dummy MPLADS project data.
 *
 * These projects represent different districts and risk levels.
 * In a real application, this information would come from the
 * e-SAKSHI backend/API.
 */
export const projects: Project[] = [
  {
    id: "MP-HP-001",
    name: "Community Health Centre",
    district: "Solan",
    state: "Himachal Pradesh",
    latitude: 30.9045,
    longitude: 77.0967,
    riskScore: 12,
    riskLevel: "safe",
    status: "reviewed",
    fundAmount: 2500000,
  },

  {
    id: "MP-HP-002",
    name: "Government Senior Secondary School",
    district: "Shimla",
    state: "Himachal Pradesh",
    latitude: 31.1048,
    longitude: 77.1734,
    riskScore: 28,
    riskLevel: "safe",
    status: "reviewed",
    fundAmount: 1800000,
  },

  {
    id: "MP-PB-003",
    name: "Rural Drinking Water Project",
    district: "Ludhiana",
    state: "Punjab",
    latitude: 30.901,
    longitude: 75.8573,
    riskScore: 61,
    riskLevel: "medium",
    fraudType: "Image Fraud",
    status: "pending",
    fundAmount: 3200000,
  },

  {
    id: "MP-RJ-004",
    name: "Village Road Development",
    district: "Jaipur",
    state: "Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
    riskScore: 87,
    riskLevel: "high",
    fraudType: "Ghost Asset",
    status: "frozen",
    fundAmount: 4500000,
  },

  {
    id: "MP-UP-005",
    name: "Public Community Hall",
    district: "Lucknow",
    state: "Uttar Pradesh",
    latitude: 26.8467,
    longitude: 80.9462,
    riskScore: 74,
    riskLevel: "high",
    fraudType: "Cartel Detection",
    status: "pending",
    fundAmount: 2800000,
  },

  {
    id: "MP-MH-006",
    name: "Primary School Renovation",
    district: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    riskScore: 19,
    riskLevel: "safe",
    status: "reviewed",
    fundAmount: 1500000,
  },

  {
    id: "MP-KA-007",
    name: "Urban Drainage Improvement",
    district: "Bengaluru",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    riskScore: 55,
    riskLevel: "medium",
    fraudType: "Image Fraud",
    status: "pending",
    fundAmount: 3600000,
  },

  {
    id: "MP-BR-008",
    name: "Rural Road Connectivity",
    district: "Patna",
    state: "Bihar",
    latitude: 25.5941,
    longitude: 85.1376,
    riskScore: 91,
    riskLevel: "high",
    fraudType: "Ghost Asset",
    status: "frozen",
    fundAmount: 5200000,
  },

  {
    id: "MP-GJ-009",
    name: "Village Solar Lighting",
    district: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
    riskScore: 43,
    riskLevel: "medium",
    status: "pending",
    fundAmount: 2100000,
  },

  {
    id: "MP-TN-010",
    name: "Government School Infrastructure",
    district: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    riskScore: 16,
    riskLevel: "safe",
    status: "reviewed",
    fundAmount: 1900000,
  },
];

/*
 * Active alerts shown in the Risk Queue.
 *
 * These are derived from projects that require auditor attention.
 */
export const riskAlerts: RiskAlert[] = [
  {
    id: "ALERT-001",
    projectId: "MP-BR-008",
    projectName: "Rural Road Connectivity",
    riskScore: 91,
    fraudType: "Ghost Asset",
    district: "Patna",
    state: "Bihar",
    status: "frozen",
  },

  {
    id: "ALERT-002",
    projectId: "MP-RJ-004",
    projectName: "Village Road Development",
    riskScore: 87,
    fraudType: "Ghost Asset",
    district: "Jaipur",
    state: "Rajasthan",
    status: "frozen",
  },

  {
    id: "ALERT-003",
    projectId: "MP-UP-005",
    projectName: "Public Community Hall",
    riskScore: 74,
    fraudType: "Cartel Detection",
    district: "Lucknow",
    state: "Uttar Pradesh",
    status: "pending",
  },

  {
    id: "ALERT-004",
    projectId: "MP-PB-003",
    projectName: "Rural Drinking Water Project",
    riskScore: 61,
    fraudType: "Image Fraud",
    district: "Ludhiana",
    state: "Punjab",
    status: "pending",
  },

  {
    id: "ALERT-005",
    projectId: "MP-KA-007",
    projectName: "Urban Drainage Improvement",
    riskScore: 55,
    fraudType: "Image Fraud",
    district: "Bengaluru",
    state: "Karnataka",
    status: "pending",
  },
];

/*
 * KPI values displayed at the top of the dashboard.
 */
export const dashboardKPIs: DashboardKPI[] = [
  {
    label: "System Status",
    value: "Active",
    description: "Monitoring services operational",
  },

  {
    label: "Alerts Filed",
    value: "24",
    description: "Cases requiring auditor review",
    trend: "+8.4%",
  },

  {
    label: "Revenue Protected",
    value: "₹4.82 Cr",
    description: "Funds currently protected",
    trend: "+12.6%",
  },

  {
    label: "Verified Projects",
    value: "94.7%",
    description: "Projects passing verification",
    trend: "+2.1%",
  },
];

/*
 * Monthly fraud monitoring data.
 *
 * Used later by the Fraud Trends chart.
 */
export const fraudTrendData: FraudTrendPoint[] = [
  {
    month: "Apr",
    alerts: 8,
    confirmed: 3,
  },

  {
    month: "May",
    alerts: 12,
    confirmed: 5,
  },

  {
    month: "Jun",
    alerts: 16,
    confirmed: 7,
  },

  {
    month: "Jul",
    alerts: 21,
    confirmed: 9,
  },

  {
    month: "Aug",
    alerts: 18,
    confirmed: 8,
  },

  {
    month: "Sep",
    alerts: 24,
    confirmed: 11,
  },
];

/*
 * Distribution of projects according to their risk level.
 */
export const riskDistributionData: RiskDistribution[] = [
  {
    name: "Safe",
    value: 64,
  },

  {
    name: "Medium Risk",
    value: 23,
  },

  {
    name: "High Risk",
    value: 13,
  },
];

/*
 * Dummy image-forensic result.
 *
 * The images are temporary placeholders.
 * Later, we can replace these with realistic project images
 * or locally stored sample images.
 */
export const forensicComparison: ForensicImage = {
  uploadedImage: "/forensics/uploaded-project.jpg",
  matchedImage: "/forensics/matched-project.jpg",
  confidence: 96.4,
  projectId: "MP-PB-003",
};