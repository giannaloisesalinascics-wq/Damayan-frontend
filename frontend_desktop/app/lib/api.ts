import type {
  AppRole,
  AuthSession,
  CapacityCenter,
  CheckInRecord,
  DashboardOverview,
  DisasterEvent,
  IncidentReport,
  InventoryItem,
  Organization,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3001/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(init.headers ?? {});

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    const normalizedToken = token.replace(/^Bearer\s+/i, "").trim();
    headers.set("Authorization", `Bearer ${normalizedToken}`);
  }

  let response: Response;
  try {
    console.log(`[Api] Requesting ${path}`, { method: init.method || 'GET' });
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError(
      `Cannot connect to backend API at ${API_BASE_URL}. Start backend services and try again.`,
      0,
    );
  }

  const text = await response.text();
  console.log(`[Api] Response for ${path}: status=${response.status}`);
  
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error(`[Api] Failed to parse JSON response from ${path}:`, text);
    payload = { message: text || "Invalid server response" };
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? (Array.isArray(payload.message) ? payload.message.join(", ") : String(payload.message))
        : `Request failed with status ${response.status}`;
    
    if (response.status >= 500) {
      console.error(`[Api] Error ${response.status}: ${message}`);
    } else {
      console.warn(`[Api] Warning ${response.status}: ${message}`);
    }
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export async function login(payload: {
  email: string;
  password: string;
  rememberMe?: boolean;
  requiredRole?: AppRole;
}) {
  return request<{
    access_token: string;
    expiresIn?: string;
    user: AuthSession["user"];
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signup(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  registrationType?: string;
  birthDate?: string;
  gender?: string;
  bloodType?: string;
  medicalConditions?: string;
  familyMembers?: any[];
}) {
  return request<{
    access_token: string;
    user: AuthSession["user"];
  }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload: {
  contact: string;
  method?: "email" | "sms";
}) {
  return request<{
    message: string;
    maskedContact: string;
    debugVerificationCode?: string;
  }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: {
  contact: string;
  code: string;
  newPassword: string;
}) {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getProfile(token: string) {
  return request<{ user: AuthSession["user"] }>("/auth/me", {}, token);
}

export async function getDashboard(
  scope: "admin" | "site-manager",
  token: string,
) {
  const prefix = scope === "admin" ? "/admin" : "/site-manager";
  return request<DashboardOverview>(`${prefix}/dashboard`, {}, token);
}

export async function getInventory(
  scope: "admin" | "site-manager",
  token: string,
) {
  const prefix = scope === "admin" ? "/admin" : "/site-manager";
  return request<InventoryItem[]>(`${prefix}/inventory`, {}, token);
}

export async function getCapacity(token: string) {
  return request<CapacityCenter[]>("/site-manager/capacity", {}, token);
}

export async function getDisasterEvents(
  scope: "admin" | "site-manager",
  token: string,
) {
  const prefix = scope === "admin" ? "/admin" : "/site-manager";
  return request<DisasterEvent[]>(`${prefix}/disaster-events`, {}, token);
}

export async function getOrganizations(token: string) {
  return request<Organization[]>("/admin/organizations", {}, token);
}

export async function getRecentCheckIns(token: string, limit = 8) {
  return request<CheckInRecord[]>(`/site-manager/check-ins/recent?limit=${limit}`, {}, token);
}

export async function getIncidentReports(token: string) {
  return request<IncidentReport[]>("/site-manager/incident-reports", {}, token);
}

export async function getDispatcherIncidents(token: string) {
  return request<IncidentReport[]>("/dispatcher/incident-reports", {}, token);
}

export async function createManualCheckIn(
  token: string,
  payload: {
    evacueeNumber: string;
    firstName?: string;
    lastName?: string;
    zone?: string;
    location?: string;
  },
) {
  return request<CheckInRecord>("/site-manager/check-ins/manual", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function updateIncidentReport(
  token: string,
  id: string,
  payload: Partial<{
    disasterId: string;
    reportedBy: string;
    title: string;
    content: string;
    severity: string;
    location: string;
    status: string;
  }>,
) {
  // Use dispatcher prefix for dispatcher operations
  return request<IncidentReport>(`/dispatcher/incident-reports/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token);
}

export async function createIncidentReport(
  token: string,
  payload: {
    disasterId: string;
    reportedBy: string;
    title: string;
    content: string;
    severity: string;
    location: string;
  },
) {
  return request<IncidentReport>("/site-manager/incident-reports", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function getCitizenProfile(token: string) {
  return request<any>("/citizen/profile", {
    method: "GET",
  }, token);
}

export async function registerCitizen(token: string, payload: {
  fullName: string;
  birthDate: string;
  gender: string;
  bloodType: string;
  medicalConditions: string;
  registrationType: "Individual" | "Household";
  qrCodeId: string;
}) {
  return request<any>("/citizen/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function addFamilyMember(token: string, payload: {
  qrCodeId: string;
  headFullName: string;
  familyMemberName: string;
  relationship: string;
  age: number;
  accessibilityNeeds: string;
  familyMemberCount: number;
}) {
  return request<any>("/citizen/family", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function addAnimal(token: string, payload: {
  name: string;
  species: string;
  needsCage: boolean;
  qrCodeId?: string;
}) {
  return request<any>("/citizen/animal", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function clearFamilyMembers(token: string, qrCodeId: string) {
  return request<any>(`/citizen/family/${qrCodeId}`, {
    method: "DELETE",
  }, token);
}

export async function clearAnimals(token: string) {
  return request<any>("/citizen/animal", {
    method: "DELETE",
  }, token);
}

export async function getFamilyMembers(token: string) {
  return request<any[]>("/citizen/family", {
    method: "GET",
  }, token);
}

export async function getAnimals(token: string) {
  return request<any[]>("/citizen/animals", {
    method: "GET",
  }, token);
}

export async function submitIncidentReport(token: string, payload: {
  title: string;
  content: string;
  severity: string;
  location: string;
  attachmentKeys?: string[];
  disasterId?: string;
}) {
  return request<any>("/citizen/incident-report", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}