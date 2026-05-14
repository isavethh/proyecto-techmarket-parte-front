import { apiGet, apiPost, apiDelete } from "@/lib/api/apiClient";
import type {
  Wallet,
  WithdrawPayload,
  WithdrawResult,
  Payout,
  PayoutMethod,
  CreatePayoutMethodPayload,
  EarningsCommissions,
  EarningsCommissionsSummary,
  EarningsWallet,
  EarningsPayouts,
} from "./types";

const BASE = "/api/ambassadors";

// ── Wallet ─────────────────────────────────────────────────────────────────

export function getWallet(): Promise<Wallet> {
  return apiGet<Wallet>(`${BASE}/wallet`);
}

export function withdrawFromWallet(data: WithdrawPayload): Promise<WithdrawResult> {
  return apiPost<WithdrawResult>(`${BASE}/wallet/withdraw`, data);
}

// ── Payouts ────────────────────────────────────────────────────────────────

export function getPayouts(): Promise<Payout[]> {
  return apiGet<Payout[]>(`${BASE}/payouts`);
}

// ── Payout Methods ─────────────────────────────────────────────────────────

export function getPayoutMethods(): Promise<PayoutMethod[]> {
  return apiGet<PayoutMethod[]>(`${BASE}/payout-methods`);
}

export function createPayoutMethod(data: CreatePayoutMethodPayload): Promise<PayoutMethod> {
  return apiPost<PayoutMethod>(`${BASE}/payout-methods`, data);
}

export function deletePayoutMethod(methodId: string): Promise<void> {
  return apiDelete<void>(`${BASE}/payout-methods/${methodId}`);
}

// ── Earnings ───────────────────────────────────────────────────────────────

export function getEarningsCommissions(): Promise<EarningsCommissions> {
  return apiGet<EarningsCommissions>(`${BASE}/earnings/commissions`);
}

export function getEarningsCommissionsSummary(): Promise<EarningsCommissionsSummary> {
  return apiGet<EarningsCommissionsSummary>(`${BASE}/earnings/commissions/summary`);
}

export function getEarningsWallet(): Promise<EarningsWallet> {
  return apiGet<EarningsWallet>(`${BASE}/earnings/wallet`);
}

export function withdrawEarnings(data: WithdrawPayload): Promise<WithdrawResult> {
  return apiPost<WithdrawResult>(`${BASE}/earnings/wallet/withdraw`, data);
}

export function getEarningsPayouts(): Promise<EarningsPayouts> {
  return apiGet<EarningsPayouts>(`${BASE}/earnings/payouts`);
}
