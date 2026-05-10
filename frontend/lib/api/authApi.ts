import { clearToken, setToken } from "@/lib/auth/tokenStore";

export type AuthUser = {
  accessToken: string;
  refreshToken: string;
  userId: string | number;
  username: string;
  roles: string[];
  scopes: string[];
  user?: unknown;
};

export type AuthSession = AuthUser;

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  tipo: string;
  nombre: string;
  apellido: string;
  telefono: string;
  pais: string;
  ciudad: string;
  terminos: boolean;
};

export type RegisterResponse = AuthSession;

type ApiErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  description?: string;
};

const IAM_BASE_URL = process.env.NEXT_PUBLIC_IAM_URL;

function buildUrl(path: string): string {
  if (!IAM_BASE_URL) {
    throw new Error("NEXT_PUBLIC_IAM_URL no está configurada.");
  }

  return new URL(path, IAM_BASE_URL).toString();
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

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isLoginResponse(candidate: unknown): candidate is { token: string; refreshToken: string; user?: unknown; expiresIn?: number } {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const response = candidate as Partial<{ token: string; refreshToken: string; user?: unknown; expiresIn?: number }>;

  return (
    typeof response.token === "string" &&
    typeof response.refreshToken === "string"
  );
}

function isAuthSession(candidate: unknown): candidate is AuthSession {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const session = candidate as Partial<AuthSession>;

  return (
    typeof session.accessToken === "string" &&
    typeof session.refreshToken === "string" &&
    (typeof session.userId === "string" || typeof session.userId === "number") &&
    typeof session.username === "string" &&
    isStringArray(session.roles) &&
    isStringArray(session.scopes)
  );
}

function storeAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  setToken(session.accessToken);
  window.localStorage.setItem("refreshToken", session.refreshToken);
  window.localStorage.setItem("user", JSON.stringify(session.user));
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const response = await fetch(buildUrl("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Id": "00000000-0000-0000-0000-000000000000",
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      tenantId: "00000000-0000-0000-0000-000000000000",
    }),
  });

  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(responseBody, "No se pudo iniciar sesión."));
  }

  if (!isLoginResponse(responseBody)) {
    throw new Error("La respuesta de login no incluye token y refreshToken.");
  }

  const session: AuthSession = {
    accessToken: responseBody.token,
    refreshToken: responseBody.refreshToken,
    user: responseBody.user,
    userId: "",
    username: "",
    roles: [],
    scopes: [],
  };

  storeAuthSession(session);
  return session;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await fetch(buildUrl("/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
      tipo: payload.tipo,
      nombre: payload.nombre,
      apellido: payload.apellido,
      telefono: payload.telefono,
      pais: payload.pais,
      ciudad: payload.ciudad,
      terminos: payload.terminos,
    }),
  });

  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(responseBody, "No se pudo completar el registro."));
  }

  if (!isAuthSession(responseBody)) {
    throw new Error("La respuesta de registro no incluye accessToken, refreshToken, userId, username, roles y scopes.");
  }

  storeAuthSession(responseBody);
  return responseBody;
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  clearToken();
  window.localStorage.removeItem("refreshToken");
  window.localStorage.removeItem("user");
}