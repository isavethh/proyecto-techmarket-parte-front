import { getTechmarketUserId, getToken, getUser } from "@/lib/auth/tokenStore";

type ApiErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  description?: string;
};

export type SpecialistAiRecord = Record<string, unknown>;

export type SpecialistAiInsightRadarItem = {
  etiqueta?: string;
  label?: string;
  valor?: number;
  value?: number;
};

export type SpecialistAiInsightsResponse = {
  radar?: SpecialistAiInsightRadarItem[];
  recomendacion?: string;
  focoSugerido?: string;
  [key: string]: unknown;
};

export type SpecialistAiAnswer = {
  resumen: string;
  planAccion: string[];
  foco: string;
};

export type SpecialistAiQueryResponse = {
  consulta: string;
  respuesta: SpecialistAiAnswer;
};

export type SpecialistPricingSuggestionPayload = {
  servicio: string;
  precioActual: number;
};

export type SpecialistPricingSuggestionResponse = {
  servicio: string;
  precioActual: string;
  sugerencia: {
    precioRecomendado: string;
    rangoOptimo: {
      min: string;
      max: string;
    };
    justificacion: string;
  };
};

export type SpecialistImprovementPlanPayload = {
  area: string;
};

export type SpecialistImprovementPlanResponse = {
  area: string;
  plan: {
    objetivo: string;
    acciones: string[];
    tiempoEstimado: string;
  };
};

export type SpecialistScheduleOptimizationResponse = {
  sugerencia: string;
  planSugerido: string[];
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
  return specialistAiRequest<SpecialistAiInsightsResponse>("/api/specialists/ai/insights");
}

export function askSpecialistAi(consulta: string): Promise<SpecialistAiQueryResponse> {
  if (typeof consulta !== "string" || !consulta.trim()) {
    throw new Error("La consulta para la IA es obligatoria.");
  }

  return specialistAiRequest<SpecialistAiQueryResponse>("/api/specialists/ai/query", {
    method: "POST",
    body: { consulta: consulta.trim() },
  });
}

export function getSpecialistPricingSuggestion(
  payload: SpecialistPricingSuggestionPayload,
): Promise<SpecialistPricingSuggestionResponse> {
  return specialistAiRequest<SpecialistPricingSuggestionResponse>("/api/specialists/ai/pricing-suggestion", {
    method: "POST",
    body: payload,
  });
}

export function getSpecialistImprovementPlan(
  payload: SpecialistImprovementPlanPayload,
): Promise<SpecialistImprovementPlanResponse> {
  return specialistAiRequest<SpecialistImprovementPlanResponse>("/api/specialists/ai/improvement-plan", {
    method: "POST",
    body: payload,
  });
}

export function getSpecialistScheduleOptimization(
): Promise<SpecialistScheduleOptimizationResponse> {
  return specialistAiRequest<SpecialistScheduleOptimizationResponse>("/api/specialists/ai/schedule-optimization", {
    method: "POST",
  });
}
