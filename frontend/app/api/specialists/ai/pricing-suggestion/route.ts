import { NextRequest } from "next/server";
import { proxySpecialistAiRequest } from "../proxy";

export function POST(request: NextRequest) {
  return proxySpecialistAiRequest(request, "/api/specialists/ai/pricing-suggestion", "POST");
}
