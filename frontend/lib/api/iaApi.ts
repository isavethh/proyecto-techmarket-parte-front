type ApiErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  description?: string;
};

const IA_BASE_URL = process.env.NEXT_PUBLIC_IA_URL ?? "http://localhost:8092";

export type GlobalSearchItem = {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  url: string;
};

export type GlobalSearchResponse = {
  total: number;
  resultados: GlobalSearchItem[];
};

export type SearchSuggestion = {
  texto: string;
  tipo: string;
};

export type SearchTrending = {
  texto: string;
  busquedas: number;
};

export type SearchHistoryItem = {
  id: string;
  query: string;
  fecha: string;
};

export type ConversationSummary = {
  id: string;
  titulo: string;
  ultimoMensaje: string;
  mensajesSinLeer: number;
};

export type ConversationMessage = {
  id: string;
  remitenteId: string;
  contenido: string;
  fecha: string;
};

export type CreateConversationPayload = {
  participanteId: string;
  tipo: string;
  mensajeInicial: string;
};

export type CreateConversationResponse = {
  id: string;
  estado: string;
};

export type CreateMessageResponse = {
  id: string;
  contenido: string;
  estado: string;
};

export type MessageResponse = {
  mensaje: string;
};

function buildUrl(path: string): string {
  return new URL(path, IA_BASE_URL).toString();
}

function normalizeUserId(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const toLocalUuid = (rawValue: string): string | null => {
    const normalized = rawValue.trim();
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (uuidPattern.test(normalized)) {
      return normalized;
    }

    if (/^\d+$/.test(normalized)) {
      return `00000000-0000-0000-0000-${normalized.padStart(12, "0").slice(-12)}`;
    }

    return null;
  };

  if (typeof value === "number") {
    return toLocalUuid(String(value));
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.toUpperCase().startsWith("USR-")) {
    return toLocalUuid(trimmed.slice(4));
  }

  return toLocalUuid(trimmed);
}

export function readCurrentUserId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem("user");
  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as Record<string, unknown> | null;
    const candidate = parsed?.id ?? parsed?.userId ?? parsed?.usuarioId ?? null;
    return normalizeUserId(candidate);
  } catch {
    return null;
  }
}

function buildHeaders(existing: HeadersInit | undefined, hasBody: boolean): Headers {
  const headers = new Headers(existing);

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const userId = readCurrentUserId();
  if (userId && !headers.has("X-User-Id")) {
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
  return textBody ? textBody : null;
}

function resolveErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim()) {
    return body;
  }

  if (body && typeof body === "object") {
    const candidate = body as ApiErrorBody;

    if (candidate.message) {
      return candidate.message;
    }

    if (candidate.error) {
      return candidate.error;
    }

    if (candidate.detail) {
      return candidate.detail;
    }

    if (candidate.description) {
      return candidate.description;
    }
  }

  return fallback;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const hasBody = Boolean(options?.body);
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: buildHeaders(options?.headers, hasBody),
  });

  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(responseBody, "Error de solicitud"));
  }

  return responseBody as T;
}

export async function searchGlobal(query: string): Promise<GlobalSearchResponse> {
  const params = new URLSearchParams();
  const normalized = query.trim();
  if (normalized) {
    params.set("q", normalized);
  }

  const path = params.toString() ? `/api/search/global?${params}` : "/api/search/global";
  return request<GlobalSearchResponse>(path, { method: "GET" });
}

export async function searchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const params = new URLSearchParams();
  const normalized = query.trim();
  if (normalized) {
    params.set("q", normalized);
  }

  const path = params.toString() ? `/api/search/suggestions?${params}` : "/api/search/suggestions";
  return request<SearchSuggestion[]>(path, { method: "GET" });
}

export async function searchTrending(): Promise<SearchTrending[]> {
  return request<SearchTrending[]>("/api/search/trending", { method: "GET" });
}

export async function listSearchHistory(): Promise<SearchHistoryItem[]> {
  return request<SearchHistoryItem[]>("/api/search/history", { method: "GET" });
}

export async function createSearchHistory(payload: {
  query: string;
  tipo: string;
}): Promise<{ id: string; mensaje: string }> {
  return request<{ id: string; mensaje: string }>("/api/search/history", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteSearchHistory(historyId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/search/history/${historyId}`, {
    method: "DELETE",
  });
}

export async function listConversations(): Promise<ConversationSummary[]> {
  return request<ConversationSummary[]>("/api/conversations", { method: "GET" });
}

export async function createConversation(
  payload: CreateConversationPayload,
): Promise<CreateConversationResponse> {
  return request<CreateConversationResponse>("/api/conversations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getConversationMessages(
  conversationId: string,
): Promise<ConversationMessage[]> {
  return request<ConversationMessage[]>(`/api/conversations/${conversationId}/messages`, {
    method: "GET",
  });
}

export async function createConversationMessage(
  conversationId: string,
  contenido: string,
): Promise<CreateMessageResponse> {
  return request<CreateMessageResponse>(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ contenido }),
  });
}

export async function markConversationRead(conversationId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/conversations/${conversationId}/read`, {
    method: "PUT",
  });
}

export async function deleteConversationMessage(messageId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/messages/${messageId}`, {
    method: "DELETE",
  });
}
