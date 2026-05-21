// ─── Types ────────────────────────────────────────────────────────────────────
export type NavPage = "dashboard" | "resource-map" | "rescue-monitoring" | "incidents" | "resources" | "ask-volunteers" | "profile";
export type UnitStatus = "Available" | "On Route" | "On Scene" | "Offline";
export type UnitType = "FIELD" | "MEDIC" | "LOGISTICS";
export type IncidentPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type IncidentStatus = "New" | "Waiting" | "Dispatched" | "In Progress" | "Resolved" | "Invalid";
export type SituationType = "Under Control" | "Escalating" | "Critical";
export type TeamStatus = "Ready" | "Deployed" | "Standby" | "Offline";

export function shortenId(id: string) {
  if (!id) return "";
  if (id.startsWith("INC-")) return id;
  if (id.length >= 24) return `INC-${id.substring(id.length - 6).toUpperCase()}`;
  if (id.includes("-")) return `INC-${id.split("-")[0].toUpperCase()}`;
  return `INC-${id.substring(0, 6).toUpperCase()}`;
}

export interface DispatcherProfile {
  id: string; name: string; username: string; email: string; phone: string;
  badge: string; rank: string; cluster: string; station: string;
  initials: string; joinedDate: string; totalDispatches: number; resolvedToday: number;
}

export interface Unit {
  id: string; type: UnitType; name: string; station: string;
  status: UnitStatus; lat: number; lng: number;
  personnel: number; distance: string; eta: string;
  teamLeader: string; contact: string; plateNumber: string; lastActive: string;
}

export interface Incident {
  id: string; type: string; category: UnitType | "Other";
  disasterId?: string;
  reporter: string; reporterPhone: string;
  address: string; barangay: string; city: string; location: string;
  lat: number; lng: number;
  timeReported: string; dateReported: string;
  priority: IncidentPriority; status: IncidentStatus;
  situationType: SituationType;
  assignedUnits: string[];
  description: string; notes: string;
  timeActive: number;
  invalidReason?: string; dispatchedAt?: string; resolvedAt?: string;
}

export interface Team {
  id: string; name: string; type: UnitType;
  members: number; vehicles: number;
  station: string; contact: string; leader: string;
  status: TeamStatus; equipment: string[]; coverage: string;
}

// ─── Mock Dispatcher ──────────────────────────────────────────────────────────
export const MOCK_DISPATCHER: DispatcherProfile = {
  id: "DSP-001", name: "Daniel Santos", username: "d.santos",
  email: "d.santos@ndrrmc.gov.ph", phone: "+63 917 345 6789",
  badge: "DS-3042", rank: "Senior Dispatcher",
  cluster: "Metro Cluster 3", station: "Sampaloc Command Center",
  initials: "DS", joinedDate: "March 14, 2021",
  totalDispatches: 1_284, resolvedToday: 7,
};

// ─── Mock Units ───────────────────────────────────────────────────────────────
export const MOCK_UNITS: Unit[] = [];

// ─── Mock Incidents ───────────────────────────────────────────────────────────
export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-0145", type: "Structure Fire", category: "FIELD",
    reporter: "Brgy. Watch Team", reporterPhone: "+63 917 111 0001",
    address: "1113 Aurora Blvd, cor. Gilmore Ave", barangay: "Brgy. Dona Imelda", city: "Quezon City", location: "Aurora Blvd",
    lat: 14.6072, lng: 121.0038, timeReported: "9:41 AM", dateReported: "2026-04-14",
    priority: "HIGH", status: "New", situationType: "Critical", assignedUnits: [],
    description: "3-storey residential building on fire. Ground floor fully engulfed. Neighbors report hearing explosions. 2 persons possibly trapped on 2nd floor.",
    notes: "", timeActive: 1,
  },
  {
    id: "INC-0146", type: "Structure Fire", category: "FIELD",
    reporter: "Anonymous Caller", reporterPhone: "+63 917 111 0002",
    address: "45 Pnoval St., near Bustillos", barangay: "Brgy. 390", city: "Sampaloc, Manila", location: "Pnoval St.",
    lat: 14.6105, lng: 120.9982, timeReported: "9:42 AM", dateReported: "2026-04-14",
    priority: "HIGH", status: "Waiting", situationType: "Critical", assignedUnits: [],
    description: "Commercial building fire. Heavy smoke visible from 2 blocks away. Fire spreading to adjacent structure.",
    notes: "", timeActive: 1,
  },
  {
    id: "INC-0147", type: "Flash Flood", category: "Other",
    reporter: "PAGASA Monitor", reporterPhone: "+63 2 8527 1541",
    address: "Dapitan St., cor. España Blvd.", barangay: "Brgy. 485", city: "Sampaloc, Manila", location: "Dapitan St.",
    lat: 14.6130, lng: 120.9943, timeReported: "9:43 AM", dateReported: "2026-04-14",
    priority: "MEDIUM", status: "Waiting", situationType: "Escalating", assignedUnits: [],
    description: "Flood water reaching knee-level. Canal overflow due to heavy rainfall. 3 families requesting evacuation assistance.",
    notes: "", timeActive: 2,
  },
  {
    id: "INC-0148", type: "Medical Emergency", category: "MEDIC",
    reporter: "Maria Santos", reporterPhone: "+63 917 111 0004",
    address: "872 Lacson Avenue, Sampaloc", barangay: "Brgy. 522", city: "Sampaloc, Manila", location: "Lacson Avenue",
    lat: 14.6053, lng: 120.9901, timeReported: "9:44 AM", dateReported: "2026-04-14",
    priority: "MEDIUM", status: "Dispatched", situationType: "Under Control", assignedUnits: ["AMB-03"],
    description: "Elderly male, 72 y/o, fell from stairs. Suspected femur fracture. Conscious but in severe pain.",
    notes: "Patient is diabetic. Family waiting downstairs.", timeActive: 3,
    dispatchedAt: "9:45 AM",
  },
  {
    id: "INC-0149", type: "Road Accident", category: "LOGISTICS",
    reporter: "Bystander", reporterPhone: "+63 917 111 0005",
    address: "Cayco St. near Jhocson College", barangay: "Brgy. 412", city: "Sampaloc, Manila", location: "Cayco St.",
    lat: 14.6015, lng: 121.0018, timeReported: "9:35 AM", dateReported: "2026-04-14",
    priority: "MEDIUM", status: "In Progress", situationType: "Escalating", assignedUnits: ["AMB-03", "POL-04"],
    description: "2-vehicle collision. Motorcycle vs. SUV. Motorcyclist unresponsive. SUV driver injured. Traffic severely disrupted.",
    notes: "Road closure needed. Fuel leak from SUV.", timeActive: 10,
    dispatchedAt: "9:37 AM",
  },
  {
    id: "INC-0150", type: "Road Accident", category: "LOGISTICS",
    reporter: "Juan dela Cruz", reporterPhone: "+63 917 111 0006",
    address: "Aurora Blvd. near Katipunan LRT", barangay: "Brgy. Loyola Heights", city: "Quezon City", location: "Aurora Blvd.",
    lat: 14.5985, lng: 121.0082, timeReported: "9:28 AM", dateReported: "2026-04-14",
    priority: "LOW", status: "In Progress", situationType: "Under Control", assignedUnits: ["AMB-01", "AMB-05", "POL-01"],
    description: "Multi-vehicle collision involving a bus and 2 cars. 4 injured, none critical. Scene managed by initial responders.",
    notes: "LRT unaffected. MMDA on site.", timeActive: 13,
    dispatchedAt: "9:30 AM",
  },
  {
    id: "INC-0151", type: "Medical Emergency", category: "MEDIC",
    reporter: "Barangay Health Center", reporterPhone: "+63 917 111 0007",
    address: "Brgy. San Felipe, San Felipe Neri", barangay: "Brgy. San Felipe Neri", city: "Mandaluyong", location: "Brgy. San Felipe",
    lat: 14.6150, lng: 121.0070, timeReported: "9:21 AM", dateReported: "2026-04-14",
    priority: "LOW", status: "In Progress", situationType: "Critical", assignedUnits: ["AMB-07"],
    description: "Suspected cardiac arrest, 58 y/o male. CPR administered by barangay health worker. AED on site.",
    notes: "Patient has history of heart disease.", timeActive: 20,
    dispatchedAt: "9:23 AM",
  },
  {
    id: "INC-0138", type: "Structure Fire", category: "FIELD",
    reporter: "Tondo Fire Station", reporterPhone: "+63 912 000 0001",
    address: "Flores St., Tondo", barangay: "Brgy. 105", city: "Tondo, Manila", location: "Flores St.",
    lat: 14.6187, lng: 120.9660, timeReported: "7:15 AM", dateReported: "2026-04-14",
    priority: "HIGH", status: "Resolved", situationType: "Under Control", assignedUnits: ["FIRE-01", "FIRE-03", "POL-09"],
    description: "Residential structure fire. Fully contained. 12 families displaced.",
    notes: "Coordinated with BFP QC for additional tankers.", timeActive: 65,
    dispatchedAt: "7:18 AM", resolvedAt: "8:23 AM",
  },
  {
    id: "INC-0139", type: "Medical Emergency", category: "MEDIC",
    reporter: "Barangay Tanod", reporterPhone: "+63 917 222 0001",
    address: "167 Dagupan St., Tondo", barangay: "Brgy. 124", city: "Tondo, Manila", location: "Dagupan St.",
    lat: 14.6210, lng: 120.9640, timeReported: "7:40 AM", dateReported: "2026-04-14",
    priority: "MEDIUM", status: "Resolved", situationType: "Under Control", assignedUnits: ["AMB-01"],
    description: "Child, 8 y/o, with severe asthma attack. Transported to Ospital ng Tondo.",
    notes: "Parents notified. Child stable.", timeActive: 30,
    dispatchedAt: "7:43 AM", resolvedAt: "8:13 AM",
  },
];

// ─── Mock Teams ───────────────────────────────────────────────────────────────
export const MOCK_TEAMS: Team[] = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function priorityClass(p: IncidentPriority) {
  return { CRITICAL: "dp-badge-red", HIGH: "dp-badge-red", MEDIUM: "dp-badge-amber", LOW: "dp-badge-green" }[p];
}

export function statusClass(s: IncidentStatus) {
  return { New: "dp-badge-red", Waiting: "dp-badge-amber", Dispatched: "dp-badge-blue", "In Progress": "dp-badge-purple", Resolved: "dp-badge-green", Invalid: "dp-badge-grey" }[s];
}

export function situationClass(s: SituationType) {
  return { "Under Control": "dp-badge-green", Escalating: "dp-badge-amber", Critical: "dp-badge-red" }[s];
}

export function situationColor(s: SituationType) {
  return { "Under Control": "#2e7d32", Escalating: "#c77700", Critical: "#c62828" }[s];
}

export function unitStatusColor(s: UnitStatus) {
  return { Available: "#2e7d32", "On Route": "#1565c0", "On Scene": "#c62828", Offline: "#9e9e9e" }[s];
}

export function unitTypeColor(t: UnitType) {
  return { FIELD: "#2e7d32", MEDIC: "#1565c0", LOGISTICS: "#c77700" }[t];
}

export function priorityColor(p: IncidentPriority) {
  return { CRITICAL: "#c62828", HIGH: "#c2440a", MEDIUM: "#c77700", LOW: "#2e7d32" }[p];
}

export const UNIT_TYPE_LABEL: Record<UnitType, string> = {
  FIELD: "Field Volunteer",
  MEDIC: "Medic Volunteer",
  LOGISTICS: "Logistics Volunteer",
};

export const CATEGORY_LABEL: Record<string, string> = {
  FIELD: "Field Volunteer",
  MEDIC: "Medic Volunteer",
  LOGISTICS: "Logistics Volunteer",
  Other: "Volunteer",
};
export const UNIT_TYPE_ICON: Record<UnitType, string> = { FIELD: "FIELD", MEDIC: "MEDIC", LOGISTICS: "LOG" };
export const CATEGORY_ICON: Record<string, string> = { FIELD: "FIELD", MEDIC: "MEDIC", LOGISTICS: "LOG", Other: "ALERT" };

// ─── Backend Mapping Functions ────────────────────────────────────────────────
// These are used to convert backend API responses to frontend data structures
import { IncidentReport, Organization } from "../lib/types";

export function mapBackendToFrontendIncident(report: IncidentReport): Incident {
  const priorityMap: Record<string, IncidentPriority> = {
    low: "LOW",
    moderate: "MEDIUM",
    high: "HIGH",
    critical: "CRITICAL",
  };

  const statusMap: Record<string, IncidentStatus> = {
    pending: "New",
    reviewed: "Waiting",
    actioned: "Dispatched",
    closed: "Resolved",
  };
  const incidentType = report.title.toLowerCase();
  const category: Incident["category"] =
    /(medical|injur|health|patient|cardiac|fracture)/.test(incidentType) ? "MEDIC" :
    /(relief|supply|food|transport|evacuat|distribution)/.test(incidentType) ? "LOGISTICS" :
    /(fire|flood|rescue|collapse|damage)/.test(incidentType) ? "FIELD" :
    "Other";

  return {
    id: report.id,
    disasterId: report.disasterId,
    type: report.title,
    category,
    reporter: "Citizen Report",
    reporterPhone: "Verified",
    address: report.location,
    barangay: "",
    city: "",
    location: report.location,
    lat: 14.6042,
    lng: 120.9822,
    timeReported: new Date(report.createdAt).toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    dateReported: new Date(report.createdAt).toLocaleDateString("en-PH"),
    priority: priorityMap[report.severity?.toLowerCase() || "moderate"] || "MEDIUM",
    status: statusMap[report.status?.toLowerCase() || "pending"] || "New",
    situationType: "Under Control",
    assignedUnits: [],
    description: report.content,
    notes: "",
    timeActive: 0,
  };
}

function classifyVolunteerType(org: Organization): UnitType {
  const haystack = `${org.name} ${org.type}`.toLowerCase();
  if (/(medic|medical|health|clinic|hospital|nurse|doctor|rescue)/.test(haystack)) return "MEDIC";
  if (/(logistics|supply|warehouse|transport|delivery|food|relief|private)/.test(haystack)) return "LOGISTICS";
  return "FIELD";
}

export function mapOrganizationToVolunteer(org: Organization, index: number): Unit {
  const type = classifyVolunteerType(org);
  const latOffset = ((index % 5) - 2) * 0.004;
  const lngOffset = (Math.floor(index / 5) - 1) * 0.004;

  return {
    id: org.id,
    type,
    name: org.name,
    station: (org as any).address || "Bayanihub volunteer network",
    status: org.verified ? "Available" : "Offline",
    lat: 14.604 + latOffset,
    lng: 120.997 + lngOffset,
    personnel: 1,
    distance: "From hub",
    eta: "On request",
    teamLeader: UNIT_TYPE_LABEL[type],
    contact: org.contactPhone || org.contactEmail || "Bayanihub",
    plateNumber: "Volunteer",
    lastActive: org.verified ? "Synced from backend" : "Needs verification",
  };
}

export function volunteersToTeams(volunteers: Unit[]): Team[] {
  return (["FIELD", "MEDIC", "LOGISTICS"] as UnitType[])
    .map((type) => {
      const group = volunteers.filter((u) => u.type === type);
      return {
        id: `TEAM-${type}`,
        name: `${UNIT_TYPE_LABEL[type]} Pool`,
        type,
        members: group.length,
        vehicles: 0,
        station: "Bayanihub volunteer network",
        contact: group.map((u) => u.contact).find(Boolean) || "Bayanihub",
        leader: group[0]?.teamLeader || UNIT_TYPE_LABEL[type],
        status: group.some((u) => u.status === "Available") ? "Ready" : "Standby",
        equipment: group.slice(0, 4).map((u) => u.name),
        coverage: "Assigned from verified Bayanihub organizations",
      } as Team;
    })
    .filter((team) => team.members > 0);
}


