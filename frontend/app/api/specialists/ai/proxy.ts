import { NextRequest, NextResponse } from "next/server";

// La IA del especialista vive en TechMarket-AI (servicio Gemini, puerto 8091), no en TechMarket-IA.
const BACKEND_URL = process.env.AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL;

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

  try {
    const response = await fetch(new URL(path, BACKEND_URL), {
      method,
      headers: buildHeaders(request),
      body: method === "POST" ? await request.text() : undefined,
    });

    const body = await readResponseBody(response);
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con el servicio de IA." },
      { status: 502 },
    );
  }
}
