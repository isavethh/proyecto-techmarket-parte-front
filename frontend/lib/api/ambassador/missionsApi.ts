import { apiGet, apiPatch } from "@/lib/api/apiClient";
import type { Mission } from "./types";

const BASE = "/api/ambassadors/missions";

export function getMissions(): Promise<Mission[]> {
  return apiGet<Mission[]>(BASE);
}

export function startMission(missionId: string): Promise<Mission> {
  return apiPatch<Mission>(`${BASE}/${missionId}/start`);
}

export function completeMission(missionId: string): Promise<Mission> {
  return apiPatch<Mission>(`${BASE}/${missionId}/complete`);
}
