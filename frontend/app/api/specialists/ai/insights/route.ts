import { NextRequest } from "next/server";
import { proxySpecialistAiRequest } from "../proxy";

export function GET(request: NextRequest) {
  return proxySpecialistAiRequest(request, "/api/specialists/ai/insights", "GET");
}
