import { apiGet, apiPost } from "@/lib/api/apiClient";
import type {
  Commission,
  CommissionsSummary,
  CommissionDisputePayload,
  CommissionDisputeResult,
} from "./types";

const BASE = "/api/ambassadors/commissions";

export function getCommissions(): Promise<Commission[]> {
  return apiGet<Commission[]>(BASE);
}

export function getCommissionsSummary(): Promise<CommissionsSummary> {
  return apiGet<CommissionsSummary>(`${BASE}/summary`);
}

export function getCommission(commissionId: string): Promise<Commission> {
  return apiGet<Commission>(`${BASE}/${commissionId}`);
}

export function disputeCommission(commissionId: string, data: CommissionDisputePayload): Promise<CommissionDisputeResult> {
  return apiPost<CommissionDisputeResult>(`${BASE}/${commissionId}/dispute`, data);
}
