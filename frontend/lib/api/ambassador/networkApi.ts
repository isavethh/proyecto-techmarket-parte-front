import { apiGet, apiPost, apiDelete } from "@/lib/api/apiClient";
import type {
  NetworkOverview,
  NetworkTreeNode,
  NetworkInvitation,
  CreateNetworkInvitationPayload,
  NetworkRanking,
} from "./types";

const BASE = "/api/ambassadors/network";

export function getNetwork(): Promise<NetworkOverview> {
  return apiGet<NetworkOverview>(BASE);
}

export function getNetworkTree(): Promise<NetworkTreeNode> {
  return apiGet<NetworkTreeNode>(`${BASE}/tree`);
}

export function createNetworkInvitation(data: CreateNetworkInvitationPayload): Promise<NetworkInvitation> {
  return apiPost<NetworkInvitation>(`${BASE}/invitations`, data);
}

export function getNetworkInvitations(): Promise<NetworkInvitation[]> {
  return apiGet<NetworkInvitation[]>(`${BASE}/invitations`);
}

export function deleteNetworkInvitation(invitationId: string): Promise<void> {
  return apiDelete<void>(`${BASE}/invitations/${invitationId}`);
}

export function getNetworkRanking(): Promise<NetworkRanking> {
  return apiGet<NetworkRanking>(`${BASE}/ranking`);
}
