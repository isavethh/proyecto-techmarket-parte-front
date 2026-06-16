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

// La IA del embajador vive en TechMarket-AI (servicio Gemini, 8091), no en TechMarket-IA (8082).
const AI = { service: "ai" } as const;

export function queryAi(data: AiQueryPayload): Promise<AiQueryResponse> {
  return apiPost<AiQueryResponse>(`${BASE}/query`, data, AI);
}

export function getAiInsights(): Promise<AiInsight[]> {
  return apiGet<AiInsight[]>(`${BASE}/insights`, AI);
}

export function getProspectScore(data: ProspectScorePayload): Promise<ProspectScoreResponse> {
  return apiPost<ProspectScoreResponse>(`${BASE}/prospect-score`, data, AI);
}

export function getFollowUpSuggestion(data: FollowUpSuggestionPayload): Promise<FollowUpSuggestionResponse> {
  return apiPost<FollowUpSuggestionResponse>(`${BASE}/follow-up-suggestion`, data, AI);
}

export function getImprovementPlan(data: ImprovementPlanPayload): Promise<ImprovementPlanResponse> {
  return apiPost<ImprovementPlanResponse>(`${BASE}/improvement-plan`, data, AI);
}
