import { apiGet, apiPut } from "@/lib/api/apiClient";
import type { AmbassadorSettings, UpdateSettingsPayload } from "./types";

const BASE = "/api/ambassadors/settings";

export function getSettings(): Promise<AmbassadorSettings> {
  return apiGet<AmbassadorSettings>(BASE);
}

export function updateSettings(data: UpdateSettingsPayload): Promise<AmbassadorSettings> {
  return apiPut<AmbassadorSettings>(BASE, data);
}
