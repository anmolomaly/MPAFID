// Represents the risk level assigned to an MPLADS project.
export type RiskLevel = "safe" | "medium" | "high";

// Represents the type of fraud or anomaly detected.
export type FraudType =
  | "Ghost Asset"
  | "Image Fraud"
  | "Cartel Detection";

// Represents the current status of an audit alert.
export type AlertStatus = "pending" | "reviewed" | "frozen";

// Represents a project displayed on the dashboard map.
export interface Project {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  riskScore: number;
  riskLevel: RiskLevel;
  fraudType?: FraudType;
  status: AlertStatus;
  fundAmount: number;
}

// Represents an item in the active risk queue.
export interface RiskAlert {
  id: string;
  projectId: string;
  projectName: string;
  riskScore: number;
  fraudType: FraudType;
  district: string;
  state: string;
  status: AlertStatus;
}

// Represents a KPI displayed at the top of the command dashboard.
export interface DashboardKPI {
  label: string;
  value: string;
  description: string;
  trend?: string;
}

// Represents an image used by the forensic comparison panel.
export interface ForensicImage {
  uploadedImage: string;
  matchedImage: string;
  confidence: number;
  projectId: string;
}

// Represents one point in the fraud trend chart.
export interface FraudTrendPoint {
  month: string;
  alerts: number;
  confirmed: number;
}

// Represents the distribution of projects by risk level.
export interface RiskDistribution {
  name: string;
  value: number;
}