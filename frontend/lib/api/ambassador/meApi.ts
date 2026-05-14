import { apiGet, apiPatch } from "@/lib/api/apiClient";
import type {
  AmbassadorMe,
  AmbassadorDashboard,
  ActivityItem,
  WeeklyActivity,
  ReferredBusiness,
  Opportunity,
  OpportunityStatusUpdate,
  Mission,
  AmbassadorPublic,
  Referral,
  Commission,
} from "./types";

const BASE = "/api/ambassadors";

// ── /me ────────────────────────────────────────────────────────────────────

export function getMe(): Promise<AmbassadorMe> {
  return apiGet<AmbassadorMe>(`${BASE}/me`);
}

export function getDashboard(): Promise<AmbassadorDashboard> {
  return apiGet<AmbassadorDashboard>(`${BASE}/me/dashboard`);
}

export function getActivity(): Promise<ActivityItem[]> {
  return apiGet<ActivityItem[]>(`${BASE}/me/activity`);
}

export function getWeeklyActivity(): Promise<WeeklyActivity[]> {
  return apiGet<WeeklyActivity[]>(`${BASE}/me/weekly-activity`);
}

export function getReferredBusinesses(): Promise<ReferredBusiness[]> {
  return apiGet<ReferredBusiness[]>(`${BASE}/me/referred-businesses`);
}

// ── /me/opportunities ──────────────────────────────────────────────────────

export function getOpportunities(): Promise<Opportunity[]> {
  return apiGet<Opportunity[]>(`${BASE}/me/opportunities`);
}

export function updateOpportunityStatus(id: string, data: OpportunityStatusUpdate): Promise<Opportunity> {
  return apiPatch<Opportunity>(`${BASE}/me/opportunities/${id}/status`, data);
}

export function saveOpportunity(id: string): Promise<Opportunity> {
  return apiPatch<Opportunity>(`${BASE}/me/opportunities/${id}/save`);
}

// ── /me/missions ───────────────────────────────────────────────────────────

export function getMeMissions(): Promise<Mission[]> {
  return apiGet<Mission[]>(`${BASE}/me/missions`);
}

export function startMeMission(id: string): Promise<Mission> {
  return apiPatch<Mission>(`${BASE}/me/missions/${id}/start`);
}

export function completeMeMission(id: string): Promise<Mission> {
  return apiPatch<Mission>(`${BASE}/me/missions/${id}/complete`);
}

// ── /{id} ──────────────────────────────────────────────────────────────────

export function getAmbassadorById(id: string): Promise<AmbassadorPublic> {
  return apiGet<AmbassadorPublic>(`${BASE}/${id}`);
}

export function getAmbassadorReferrals(id: string): Promise<Referral[]> {
  return apiGet<Referral[]>(`${BASE}/${id}/referrals`);
}

export function getAmbassadorCommissions(id: string): Promise<Commission[]> {
  return apiGet<Commission[]>(`${BASE}/${id}/commissions`);
}
