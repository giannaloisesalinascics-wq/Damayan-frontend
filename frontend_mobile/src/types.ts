export type PortalRole = "admin" | "dispatcher" | "site_manager" | "citizen";

export type AppRole = "admin" | "dispatcher" | "line_manager" | "citizen";

export interface AuthUser {
  id: string;
  authUserId?: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  role: AppRole;
}

export interface AuthSession {
  accessToken: string;
  expiresIn?: string;
  user: AuthUser;
}

export interface DashboardOverview {
  scope: "admin" | "site-manager";
  generatedAt: string;
  inventory: {
    totalItems: number;
    lowStockItems: number;
    totalCategories: number;
    itemCount: number;
  };
  capacity: {
    totalCenters: number;
    totalCapacity: number;
    totalOccupancy: number;
    availableSlots: number;
    fullCenters: number;
    highUtilizationCenters: number;
  };
  checkIns: {
    totalCheckedIn: number;
    totalCheckedOut: number;
    total: number;
  };
  organizations: {
    totalOrganizations: number;
    verifiedOrganizations: number;
    organizationTypes: number;
  };
  disasterEvents: {
    totalEvents: number;
    activeEvents: number;
    severeEvents: number;
  };
  incidentReports: {
    totalReports: number;
    pendingReports: number;
    highSeverityReports: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
}

export interface CapacityCenter {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  utilizationRate: number;
  status: string;
}

export interface DisasterEvent {
  id: string;
  name: string;
  type: string;
  severityLevel: string;
  province: string;
  affectedAreas: string[];
  status: string;
}

export interface CheckInRecord {
  id: string;
  evacueeNumber: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  zone: string;
  location: string;
  status: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  content: string;
  severity: string;
  location: string;
  status: string;
  disasterId: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  verified: boolean;
}

export type AppRoute =
  | "role-selector"
  | "admin-login"
  | "admin-dashboard"
  | "dispatcher-login"
  | "dispatcher-before"
  | "dispatcher-during"
  | "site-manager-login"
  | "site-manager-signup"
  | "site-manager-before"
  | "site-manager-during"
  | "site-manager-dashboard"
  | "citizen-login"
  | "citizen-signup"
  | "citizen-dashboard"
  | "citizen-before"
  | "citizen-before-self"
  | "citizen-before-household"
  | "citizen-before-household-members"
  | "citizen-during"
  | "citizen-after";
