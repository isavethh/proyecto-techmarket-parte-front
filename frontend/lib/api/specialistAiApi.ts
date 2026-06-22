import { getTechmarketUserId, getToken, getUser } from "@/lib/auth/tokenStore";

type ApiErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  description?: string;
};

export type SpecialistAiRecord = Record<string, unknown>;

/**
 * Insight accionable que devuelve TechMarket-AI (:8091) para query/pricing/improvement/schedule.
 * Coincide con `BusinessInsight` del backend (salida estructurada del LLM).
 */
export type BusinessInsight = {
  summary: string;
  dataPoints: string[];
  advice: string;
  nextStep: string;
  actionPlan: string[];
  watchItems: string[];
  priority: string;
  confidence: string;
  focusLabel: string;
  focusHref: string;
};

export type SpecialistScenarioPrompt = {
  title: string;
  prompt: string;
  impact: string;
};

export type SpecialistRadarBar = {
  label: string;
  value: number;
};

/** Dashboard de insights del especialista (GET /insights). Coincide con `SpecialistInsights`. */
export type SpecialistAiInsightsResponse = {
  recommendedQuestions: string[];
  scenarioPrompts: SpecialistScenarioPrompt[];
  radarBars: SpecialistRadarBar[];
};

export type SpecialistPricingSuggestionPayload = {
  serviceId?: string;
  serviceName: string;
};

export type SpecialistImprovementPlanPayload = {
  focus: string;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeUuid(value: string | number | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return UUID_PATTERN.test(normalized) ? normalized : null;
}

function isDevUserIdPlaceholder(value: string | null | undefined): boolean {
  if (!value) {
    return true;
  }

  const normalized = value.trim();
  return !normalized || normalized === "UUID_REAL_SPECIALIST" || normalized === "UUID_REAL_ESPECIALISTA";
}

function getUserIdHeader(): string | null {
  const techmarketUserId = getTechmarketUserId();
  const normalizedTechmarketUserId = normalizeUuid(techmarketUserId);
  if (normalizedTechmarketUserId) {
    return normalizedTechmarketUserId;
  }

  const devUserId = process.env.NEXT_PUBLIC_DEV_SPECIALIST_USER_ID;
  if (!isDevUserIdPlaceholder(devUserId)) {
    const normalizedDevUserId = normalizeUuid(devUserId);
    if (normalizedDevUserId) {
      return normalizedDevUserId;
    }
  }

  const user = getUser() as { id?: string | number; userId?: string | number; usuarioId?: string | number } | null;
  const candidate = user?.id ?? user?.userId ?? user?.usuarioId;
  return normalizeUuid(candidate);
}

function buildHeaders(hasBody: boolean): Headers {
  const headers = new Headers();

  if (hasBody) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  const userId = getUserIdHeader();

  if (!token) {
    throw new Error("No autorizado. Vuelve a iniciar sesión.");
  }

  headers.set("Authorization", `Bearer ${token}`);

  if (userId) {
    headers.set("X-User-Id", userId);
  }

  return headers;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<unknown>;
  }

  const textBody = await response.text();
  return textBody || null;
}

function resolveErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim()) {
    return body;
  }

  if (body && typeof body === "object") {
    const candidate = body as ApiErrorBody;
    if (candidate.message) return candidate.message;
    if (candidate.error) return candidate.error;
    if (candidate.detail) return candidate.detail;
    if (candidate.description) return candidate.description;
  }

  return fallback;
}

async function specialistAiRequest<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const hasBody = options.body !== undefined;
  let response: Response;

  try {
    response = await fetch(path, {
      method: options.method ?? "GET",
      headers: buildHeaders(hasBody),
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con TechMarket-IA.");
  }

  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("No autorizado. Vuelve a iniciar sesión.");
    }

    const fallback = `Error ${response.status} al consultar la IA del especialista.`;
    throw new Error(resolveErrorMessage(responseBody, fallback));
  }

  return responseBody as T;
}

export function getSpecialistAiInsights(): Promise<SpecialistAiInsightsResponse> {
  // POST (con cuerpo vacio) para que el proxy pueda inyectar el contexto real del especialista.
  return specialistAiRequest<SpecialistAiInsightsResponse>("/api/specialists/ai/insights", {
    method: "POST",
    body: {},
  });
}

export function askSpecialistAi(consulta: string): Promise<BusinessInsight> {
  if (typeof consulta !== "string" || !consulta.trim()) {
    throw new Error("La consulta para la IA es obligatoria.");
  }

  return specialistAiRequest<BusinessInsight>("/api/specialists/ai/query", {
    method: "POST",
    body: { consulta: consulta.trim() },
  });
}

export function getSpecialistPricingSuggestion(
  payload: SpecialistPricingSuggestionPayload,
): Promise<BusinessInsight> {
  return specialistAiRequest<BusinessInsight>("/api/specialists/ai/pricing-suggestion", {
    method: "POST",
    body: payload,
  });
}

export function getSpecialistImprovementPlan(
  payload: SpecialistImprovementPlanPayload,
): Promise<BusinessInsight> {
  return specialistAiRequest<BusinessInsight>("/api/specialists/ai/improvement-plan", {
    method: "POST",
    body: payload,
  });
}

export function getSpecialistScheduleOptimization(): Promise<BusinessInsight> {
  return specialistAiRequest<BusinessInsight>("/api/specialists/ai/schedule-optimization", {
    method: "POST",
  });
}
