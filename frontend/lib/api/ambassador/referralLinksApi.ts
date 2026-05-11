import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiClient";
import type {
  ReferralLink,
  CreateReferralLinkPayload,
  UpdateReferralLinkPayload,
  ReferralLinkStatusUpdate,
  ReferralLinkQr,
  ReferralCode,
} from "./types";

const BASE = "/api/ambassadors/referral-links";

export function getReferralLinks(): Promise<ReferralLink[]> {
  return apiGet<ReferralLink[]>(BASE);
}

export function createReferralLink(data: CreateReferralLinkPayload): Promise<ReferralLink> {
  return apiPost<ReferralLink>(BASE, data);
}

export function getReferralLink(linkId: string): Promise<ReferralLink> {
  return apiGet<ReferralLink>(`${BASE}/${linkId}`);
}

export function updateReferralLink(linkId: string, data: UpdateReferralLinkPayload): Promise<ReferralLink> {
  return apiPut<ReferralLink>(`${BASE}/${linkId}`, data);
}

export function updateReferralLinkStatus(linkId: string, data: ReferralLinkStatusUpdate): Promise<ReferralLink> {
  return apiPatch<ReferralLink>(`${BASE}/${linkId}/status`, data);
}

export function deleteReferralLink(linkId: string): Promise<void> {
  return apiDelete<void>(`${BASE}/${linkId}`);
}

export function getReferralLinkQr(linkId: string): Promise<ReferralLinkQr> {
  return apiGet<ReferralLinkQr>(`${BASE}/${linkId}/qr`);
}

export function getReferralCodes(): Promise<ReferralCode[]> {
  return apiGet<ReferralCode[]>("/api/ambassadors/referral-codes");
}
