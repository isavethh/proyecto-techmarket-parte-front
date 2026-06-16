import { getTechmarketUserId, getToken, getUser } from "@/lib/auth/tokenStore";

type ApiErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  description?: string;
};

export type EmpresaIaResponse = Record<string, unknown>;

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
  return !normalized || normalized === "UUID_REAL_EMPRESA";
}

function getUserIdHeader(): string | null {
  const techmarketUserId = getTechmarketUserId();
  const normalizedTechmarketUserId = normalizeUuid(techmarketUserId);
  if (normalizedTechmarketUserId) {
    return normalizedTechmarketUserId;
  }

  const devUserId = process.env.NEXT_PUBLIC_DEV_EMPRESA_USER_ID;
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

function getTenantId(): string {
  if (process.env.NEXT_PUBLIC_COMPANY_ID) return process.env.NEXT_PUBLIC_COMPANY_ID;
  if (process.env.NEXT_PUBLIC_TENANT_ID) return process.env.NEXT_PUBLIC_TENANT_ID;

  if (typeof window === "undefined") {
    return "00000000-0000-0000-0000-000000000000";
  }

  return (
    window.localStorage.getItem("techmarket.companyId") ||
    window.localStorage.getItem("techmarket.tenantId") ||
    "00000000-0000-0000-0000-000000000000"
  );
}

function buildHeaders(): Headers {
  const token = getToken();
  const userId = getUserIdHeader();
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-Tenant-Id": getTenantId(),
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

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

  const text = await response.text();
  return text || null;
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

export async function consultarEmpresaIa(consulta: string): Promise<EmpresaIaResponse> {
  const trimmed = consulta.trim();

  if (!trimmed) {
    throw new Error("La consulta para la IA es obligatoria.");
  }

  let response: Response;

  try {
    response = await fetch("/api/empresa/ia/consulta", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        consulta: trimmed,
        contexto: "empresa",
        tipo: "consulta",
      }),
    });
  } catch {
    throw new Error("No se pudo conectar con TechMarket-IA.");
  }

  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(body, `Error ${response.status} al consultar la IA de empresa.`));
  }

  return body && typeof body === "object" ? (body as EmpresaIaResponse) : { respuesta: body };
}
