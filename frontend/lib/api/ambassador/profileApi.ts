import { apiGet, apiPut, apiPost } from "@/lib/api/apiClient";
import type {
  AmbassadorProfile,
  UpdateProfilePayload,
  PhotoUploadResponse,
  ProfileStats,
} from "./types";

const BASE = "/api/ambassadors/profile";

export function getProfile(): Promise<AmbassadorProfile> {
  return apiGet<AmbassadorProfile>(BASE);
}

export function updateProfile(data: UpdateProfilePayload): Promise<AmbassadorProfile> {
  return apiPut<AmbassadorProfile>(BASE, data);
}

export function uploadProfilePhoto(file: File): Promise<PhotoUploadResponse> {
  const formData = new FormData();
  formData.append("photo", file);
  return apiPost<PhotoUploadResponse>(`${BASE}/photo`, formData);
}

export function getProfileStats(): Promise<ProfileStats> {
  return apiGet<ProfileStats>(`${BASE}/stats`);
}
