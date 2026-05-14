import { apiGet } from "@/lib/api/apiClient";
import type {
  PerformanceReport,
  ReferralsReport,
  CommissionsReport,
  ConversionFunnelReport,
  ExportReportParams,
} from "./types";

const BASE = "/api/ambassadors/reports";

export function getPerformanceReport(): Promise<PerformanceReport> {
  return apiGet<PerformanceReport>(`${BASE}/performance`);
}

export function getReferralsReport(): Promise<ReferralsReport> {
  return apiGet<ReferralsReport>(`${BASE}/referrals`);
}

export function getCommissionsReport(): Promise<CommissionsReport> {
  return apiGet<CommissionsReport>(`${BASE}/commissions`);
}

export function getConversionFunnelReport(): Promise<ConversionFunnelReport> {
  return apiGet<ConversionFunnelReport>(`${BASE}/conversion-funnel`);
}

export function exportReport(params: ExportReportParams): Promise<Blob> {
  return apiGet<Blob>(`${BASE}/export`, {
    params: {
      type: params.type,
      format: params.format,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    },
  });
}
