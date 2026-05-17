export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082";

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "X-User-Id": "USR-001",
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...(options.headers as Record<string, string>),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}
