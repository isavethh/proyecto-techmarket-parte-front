import { getToken } from "@/lib/auth/tokenStore";

// ---------------------------------------------------------------------------
// Base URLs
// ---------------------------------------------------------------------------

const TECHMARKET_API_URL = process.env.NEXT_PUBLIC_TECHMARKET_API_URL;
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type ApiErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  description?: string;
};

function resolveBaseUrl(service: "main" | "ai"): string {
  const url = service === "ai" ? AI_SERVICE_URL : TECHMARKET_API_URL;

  if (!url) {
    const envVar = service === "ai" ? "NEXT_PUBLIC_AI_SERVICE_URL" : "NEXT_PUBLIC_TECHMARKET_API_URL";
    throw new Error(`${envVar} no está configurada.`);
  }

  return url;
}

function buildUrl(path: string, service: "main" | "ai" = "main"): string {
  return new URL(path, resolveBaseUrl(service)).toString();
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

// ---------------------------------------------------------------------------
// Core request function
// ---------------------------------------------------------------------------

type RequestOptions = {
  /** Override the service base URL (defaults to "main" = TECHMARKET_API_URL). */
  service?: "main" | "ai";
  /** Additional headers to merge. */
  headers?: Record<string, string>;
  /** Query string parameters. */
  params?: Record<string, string | number | boolean | undefined>;
};

function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";

  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number | boolean] => entry[1] !== undefined,
  );

  if (entries.length === 0) return "";

  const searchParams = new URLSearchParams();
  for (const [key, value] of entries) {
    searchParams.set(key, String(value));
  }

  return `?${searchParams.toString()}`;
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const service = options?.service ?? "main";
  const queryString = buildQueryString(options?.params);
  const url = buildUrl(path + queryString, service);

  const token = getToken();

  const headers: Record<string, string> = {
    "X-Tenant-Id": "00000000-0000-0000-0000-000000000000",
    ...(options?.headers ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Do not set Content-Type for FormData — the browser sets the boundary automatically.
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
  });

  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(responseBody, `Error ${response.status} en ${method} ${path}`));
  }

  return responseBody as T;
}

// ---------------------------------------------------------------------------
// Public convenience methods
// ---------------------------------------------------------------------------

export function apiGet<T = unknown>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>("GET", path, undefined, options);
}

export function apiPost<T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return request<T>("POST", path, body, options);
}

export function apiPut<T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return request<T>("PUT", path, body, options);
}

export function apiPatch<T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return request<T>("PATCH", path, body, options);
}

export function apiDelete<T = unknown>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>("DELETE", path, undefined, options);
}
