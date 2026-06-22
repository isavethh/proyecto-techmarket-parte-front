import { NextRequest, NextResponse } from "next/server";

// La IA del especialista vive en TechMarket-AI (servicio Gemini, puerto 8091), no en TechMarket-IA.
const BACKEND_URL = process.env.AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL;
// Los datos reales del especialista viven en TechMarket-IA (puerto 8082). El servicio AI es
// stateless (sin BD): aqui obtenemos el contexto real y se lo inyectamos a cada consulta para que
// el consejo refleje la reputacion, servicios y actividad reales del especialista.
const IA_SERVICE_URL = process.env.TECHMARKET_API_URL || process.env.NEXT_PUBLIC_TECHMARKET_API_URL;

type ProxyMethod = "GET" | "POST";

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

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (userId) {
    headers.set("X-User-Id", userId);
  }

  return headers;
}

/**
 * Trae el contexto real del especialista desde TechMarket-IA. Best-effort: si IA no responde, la
 * consulta sigue (sin datos reales) en vez de fallar.
 */
async function fetchRealContext(headers: Headers): Promise<unknown | null> {
  if (!IA_SERVICE_URL) return null;
  try {
    const response = await fetch(new URL("/api/specialists/ia-contexto", IA_SERVICE_URL), {
      method: "GET",
      headers,
    });
    if (!response.ok) return null;
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export async function proxySpecialistAiRequest(
  request: NextRequest,
  path: string,
  method: ProxyMethod,
): Promise<NextResponse> {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "AI_SERVICE_URL no esta configurada." },
      { status: 500 },
    );
  }

  const headers = buildHeaders(request);
  // Aseguramos JSON al inyectar contexto, aunque la peticion original no traiga body.
  headers.set("Content-Type", "application/json");

  let body: string | undefined;
  if (method === "POST") {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse((await request.text()) || "{}");
    } catch {
      payload = {};
    }
    const realContext = await fetchRealContext(headers);
    if (realContext) {
      payload = { ...payload, context: { ...(payload.context as object), especialista: realContext } };
    }
    body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(new URL(path, BACKEND_URL), {
      method,
      headers,
      body,
    });

    const responseBody = await readResponseBody(response);
    return NextResponse.json(responseBody, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con el servicio de IA." },
      { status: 502 },
    );
  }
}
