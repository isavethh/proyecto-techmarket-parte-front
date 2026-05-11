import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiClient";
import type {
  Lead,
  CreateLeadPayload,
  UpdateLeadPayload,
  LeadStatusUpdate,
  LeadConversionResult,
} from "./types";

const BASE = "/api/ambassadors/leads";

export function getLeads(): Promise<Lead[]> {
  return apiGet<Lead[]>(BASE);
}

export function createLead(data: CreateLeadPayload): Promise<Lead> {
  return apiPost<Lead>(BASE, data);
}

export function getLead(leadId: string): Promise<Lead> {
  return apiGet<Lead>(`${BASE}/${leadId}`);
}

export function updateLead(leadId: string, data: UpdateLeadPayload): Promise<Lead> {
  return apiPut<Lead>(`${BASE}/${leadId}`, data);
}

export function updateLeadStatus(leadId: string, data: LeadStatusUpdate): Promise<Lead> {
  return apiPatch<Lead>(`${BASE}/${leadId}/status`, data);
}

export function convertLead(leadId: string): Promise<LeadConversionResult> {
  return apiPost<LeadConversionResult>(`${BASE}/${leadId}/convert`);
}

export function deleteLead(leadId: string): Promise<void> {
  return apiDelete<void>(`${BASE}/${leadId}`);
}
