import { NextRequest, NextResponse } from "next/server";

// El comparador "Versus" usa IA cognitiva de TechMarket-AI (Gemini, 8091) para el veredicto, pero
// los datos reales de cada publicación (precio, reseñas, reputación del vendedor) viven en
// TechMarket-IA (8082). El servicio AI es stateless: aquí armamos el contexto real y se lo pasamos
// para que el veredicto refleje el marketplace de verdad y no suposiciones.
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL;
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
  headers.set("Content-Type", contentType || "application/json");
  if (userId) headers.set("X-User-Id", userId);
  if (tenantId) headers.set("X-Tenant-Id", tenantId);

  return headers;
}

/**
 * Trae el contexto real de las publicaciones desde TechMarket-IA (precio, descripción, calificación
 * + nº de reseñas, reputación del vendedor). Devuelve la lista `productos` o null si IA no responde.
 */
async function fetchRealContext(
  headers: Headers,
  productIds: string[],
): Promise<unknown[] | null> {
  if (!IA_SERVICE_URL) return null;
  try {
    const response = await fetch(new URL("/api/marketplace/versus-contexto", IA_SERVICE_URL), {
      method: "POST",
      headers,
      body: JSON.stringify({ productIds }),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { productos?: unknown[] };
    return Array.isArray(body.productos) ? body.productos : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!AI_SERVICE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_AI_SERVICE_URL no esta configurada." },
      { status: 500 },
    );
  }

  const headers = buildHeaders(request);

  let payload: { productIds?: unknown } = {};
  try {
    payload = JSON.parse((await request.text()) || "{}");
  } catch {
    payload = {};
  }

  const productIds = Array.isArray(payload.productIds)
    ? payload.productIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    : [];

  if (productIds.length < 2) {
    return NextResponse.json(
      { message: "Se requieren exactamente 2 publicaciones para comparar." },
      { status: 400 },
    );
  }

  const productos = await fetchRealContext(headers, productIds);
  if (!productos || productos.length < 2) {
    return NextResponse.json(
      { message: "No se pudo obtener la información real de las publicaciones a comparar." },
      { status: 502 },
    );
  }

  try {
    const response = await fetch(new URL("/api/marketplace/versus", AI_SERVICE_URL), {
      method: "POST",
      headers,
      body: JSON.stringify({ productos, context: { fuente: "versus-contexto" } }),
    });
    const body = await readResponseBody(response);
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ message: "No se pudo conectar con TechMarket-AI." }, { status: 502 });
  }
}
