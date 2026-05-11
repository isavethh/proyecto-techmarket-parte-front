const TECHMARKET_API_URL = process.env.NEXT_PUBLIC_TECHMARKET_API_URL;

if (!TECHMARKET_API_URL) {
  throw new Error("Falta configurar NEXT_PUBLIC_TECHMARKET_API_URL en .env.local");
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  userId?: string;
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", token, userId, body } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (userId) {
    headers["X-User-Id"] = userId;
  }

  const response = await fetch(`${TECHMARKET_API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Error ${response.status} en ${path}${errorText ? `: ${errorText}` : ""}`
    );
  }

  return response.json() as Promise<T>;
}