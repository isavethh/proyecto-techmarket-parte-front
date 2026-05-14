import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiClient";
import type {
  Referral,
  CreateReferralPayload,
  UpdateReferralPayload,
  ReferralStatusUpdate,
  ReferralActivityItem,
  ReferralNote,
  CreateReferralNotePayload,
  ReferralFileUploadResponse,
} from "./types";

const BASE = "/api/ambassadors/referrals";

export function getReferrals(): Promise<Referral[]> {
  return apiGet<Referral[]>(BASE);
}

export function createReferral(data: CreateReferralPayload): Promise<Referral> {
  return apiPost<Referral>(BASE, data);
}

export function getReferral(referralId: string): Promise<Referral> {
  return apiGet<Referral>(`${BASE}/${referralId}`);
}

export function updateReferral(referralId: string, data: UpdateReferralPayload): Promise<Referral> {
  return apiPut<Referral>(`${BASE}/${referralId}`, data);
}

export function updateReferralStatus(referralId: string, data: ReferralStatusUpdate): Promise<Referral> {
  return apiPatch<Referral>(`${BASE}/${referralId}/status`, data);
}

export function deleteReferral(referralId: string): Promise<void> {
  return apiDelete<void>(`${BASE}/${referralId}`);
}

export function getReferralActivity(referralId: string): Promise<ReferralActivityItem[]> {
  return apiGet<ReferralActivityItem[]>(`${BASE}/${referralId}/activity`);
}

export function createReferralNote(referralId: string, data: CreateReferralNotePayload): Promise<ReferralNote> {
  return apiPost<ReferralNote>(`${BASE}/${referralId}/notes`, data);
}

export function getReferralNotes(referralId: string): Promise<ReferralNote[]> {
  return apiGet<ReferralNote[]>(`${BASE}/${referralId}/notes`);
}

export function uploadReferralFile(referralId: string, file: File): Promise<ReferralFileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return apiPost<ReferralFileUploadResponse>(`${BASE}/${referralId}/files`, formData);
}
