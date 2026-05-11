import { apiGet, apiPost } from "@/lib/api/apiClient";
import type {
  AiQueryPayload,
  AiQueryResponse,
  AiInsight,
  ProspectScorePayload,
  ProspectScoreResponse,
  FollowUpSuggestionPayload,
  FollowUpSuggestionResponse,
  ImprovementPlanPayload,
  ImprovementPlanResponse,
} from "./types";

const BASE = "/api/ambassadors/ai";
const AI_SERVICE = { service: "ai" as const };

export function queryAi(data: AiQueryPayload): Promise<AiQueryResponse> {
  return apiPost<AiQueryResponse>(`${BASE}/query`, data, AI_SERVICE);
}

export function getAiInsights(): Promise<AiInsight[]> {
  return apiGet<AiInsight[]>(`${BASE}/insights`, AI_SERVICE);
}

export function getProspectScore(data: ProspectScorePayload): Promise<ProspectScoreResponse> {
  return apiPost<ProspectScoreResponse>(`${BASE}/prospect-score`, data, AI_SERVICE);
}

export function getFollowUpSuggestion(data: FollowUpSuggestionPayload): Promise<FollowUpSuggestionResponse> {
  return apiPost<FollowUpSuggestionResponse>(`${BASE}/follow-up-suggestion`, data, AI_SERVICE);
}

export function getImprovementPlan(data: ImprovementPlanPayload): Promise<ImprovementPlanResponse> {
  return apiPost<ImprovementPlanResponse>(`${BASE}/improvement-plan`, data, AI_SERVICE);
}
