import { NextRequest, NextResponse } from "next/server";

// La IA de empresa vive en TechMarket-AI (servicio Gemini, puerto 8091), no en TechMarket-IA.
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL;
// Los datos reales del negocio viven en TechMarket-IA (puerto 8082). El servicio AI es stateless
// (sin BD): aqui obtenemos el contexto real y se lo pasamos al LLM para que el consejo refleje la
// situacion real de la empresa y no respuestas genericas.
const IA_SERVICE_URL = process.env.TECHMARKET_API_URL || process.env.NEXT_PUBLIC_TECHMARKET_API_URL;

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<unknown>;
  }

  const text = await response.text();
  return text || null;
}

function buildHeaders(request: NextRequest): Headers {
  const headers = new Headers();

  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  const userId = request.headers.get("x-user-id");
  const tenantId = request.headers.get("x-tenant-id");

  if (authorization) headers.set("Authorization", authorization);
  if (contentType) headers.set("Content-Type", contentType);
  if (userId) headers.set("X-User-Id", userId);
  if (tenantId) headers.set("X-Tenant-Id", tenantId);

  return headers;
}

/**
 * Trae el contexto real de la empresa desde TechMarket-IA (reputacion, catalogo, actividad).
 * Best-effort: si IA no responde, la consulta sigue sin datos reales en vez de fallar.
 */
async function fetchRealContext(headers: Headers): Promise<unknown | null> {
  if (!IA_SERVICE_URL) return null;
  try {
    const response = await fetch(new URL("/api/empresa/ia-contexto", IA_SERVICE_URL), {
      method: "GET",
      headers,
    });
    if (!response.ok) return null;
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!AI_SERVICE_URL) {
    return NextResponse.json({ message: "NEXT_PUBLIC_AI_SERVICE_URL no esta configurada." }, { status: 500 });
  }

  const headers = buildHeaders(request);

  let payload: { question?: unknown; context?: Record<string, unknown> } = {};
  try {
    payload = JSON.parse((await request.text()) || "{}");
  } catch {
    payload = {};
  }

  const realContext = await fetchRealContext(headers);
  const mergedContext = realContext
    ? { ...(payload.context ?? {}), negocio: realContext }
    : payload.context;

  try {
    const response = await fetch(new URL("/api/empresa/ia/consulta", AI_SERVICE_URL), {
      method: "POST",
      headers,
      body: JSON.stringify({ ...payload, context: mergedContext }),
    });

    const body = await readResponseBody(response);
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ message: "No se pudo conectar con TechMarket-AI." }, { status: 502 });
  }
}
