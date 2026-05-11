import { apiGet } from "@/lib/api/apiClient";
import type { HistoryEntry, HistorySummary } from "./types";

const BASE = "/api/ambassadors/history";

export function getHistory(): Promise<HistoryEntry[]> {
  return apiGet<HistoryEntry[]>(BASE);
}

export function getHistorySummary(): Promise<HistorySummary> {
  return apiGet<HistorySummary>(`${BASE}/summary`);
}
