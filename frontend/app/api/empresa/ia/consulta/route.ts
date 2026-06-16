import { NextRequest, NextResponse } from "next/server";

// La IA de empresa vive en TechMarket-AI (servicio Gemini, puerto 8091), no en TechMarket-IA.
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL;

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

export async function POST(request: NextRequest) {
  if (!AI_SERVICE_URL) {
    return NextResponse.json({ message: "NEXT_PUBLIC_AI_SERVICE_URL no esta configurada." }, { status: 500 });
  }

  try {
    const response = await fetch(new URL("/api/empresa/ia/consulta", AI_SERVICE_URL), {
      method: "POST",
      headers: buildHeaders(request),
      body: await request.text(),
    });

    const body = await readResponseBody(response);
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ message: "No se pudo conectar con TechMarket-AI." }, { status: 502 });
  }
}
