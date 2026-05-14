import {
  clearTechmarketAuth,
  clearToken,
  clearUser,
  setTechmarketToken,
  setTechmarketUserId,
  setToken,
  setUser,
} from "@/lib/auth/tokenStore";
import { loginTechMarket } from "@/lib/api/specialists";

export type AuthProfile = {
  id: string | number;
  nombre: string;
  email?: string | null;
  tipo: string;
  estado?: string;
  [key: string]: unknown;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthProfile;
};

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
let refreshSessionPromise: Promise<AuthSession> | null = null;

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

function isLoginResponse(candidate: unknown): candidate is { token: string; refreshToken: string; usuario?: unknown; expiresIn?: number } {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const response = candidate as Partial<{ token: string; refreshToken: string; usuario?: unknown; expiresIn?: number }>;

  return (
    typeof response.token === "string" &&
    typeof response.refreshToken === "string"
  );
}

function isRefreshResponse(candidate: unknown): candidate is { token: string; refreshToken: string; expiresIn?: number } {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const response = candidate as Partial<{ token: string; refreshToken: string; expiresIn?: number }>;

  return typeof response.token === "string" && typeof response.refreshToken === "string";
}

function isRegisterResponse(candidate: unknown): candidate is {
  accessToken: string;
  refreshToken: string;
  userId: string | number;
  username: string;
  roles?: unknown[];
} {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const response = candidate as Partial<{
    accessToken: string;
    refreshToken: string;
    userId: string | number;
    username: string;
    roles?: unknown[];
  }>;

  return (
    typeof response.accessToken === "string" &&
    typeof response.refreshToken === "string" &&
    (typeof response.userId === "string" || typeof response.userId === "number") &&
    typeof response.username === "string"
  );
}

function storeAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  setToken(session.accessToken);
  window.localStorage.setItem("refreshToken", session.refreshToken);
  setUser(session.user);
  // Sincronizamos la cookie que usa la middleware para rutas protegidas server-side
  setRoleCookieFromUser(session.user);
}

/**
 * Mapea el `tipo` de usuario a la cookie `techmarket_role` que usa la middleware.
 */
function mapTipoToRoleCookie(tipo: unknown): string | null {
  if (typeof tipo !== "string") return null;

  const t = tipo.toLowerCase().trim();

  switch (t) {
    case "cliente":
      return "cliente";
    case "empresa":
      return "empresa";
    case "especialista":
      // La middleware espera 'empresa_tecnico' para especialistas
      return "empresa_tecnico";
    case "embajador":
      return "embajador";
    default:
      return null;
  }
}

/**
 * Establece la cookie `techmarket_role` en el cliente con path=/ y max-age de 1 día.
 */
function setRoleCookieFromUser(user: AuthProfile | null | undefined): void {
  if (typeof window === "undefined") return;
  try {
    const tipo = user?.tipo;
    const role = mapTipoToRoleCookie(tipo);
    if (role) {
      // 86400 = 24h en segundos
      document.cookie = `techmarket_role=${role}; Max-Age=86400; path=/`;
      console.log("[setRoleCookieFromUser] cookie establecida:", role);
    } else {
      console.log("[setRoleCookieFromUser] tipo no mapeable, no se establece cookie", tipo);
    }
  } catch (e) {
    console.warn("[setRoleCookieFromUser] fallo al establecer cookie:", e);
  }
}

function buildUserFromResponse(responseBody: Record<string, unknown>): AuthProfile | null {
  const rawUser = responseBody.usuario;

  if (!rawUser || typeof rawUser !== "object") {
    console.warn("[buildUserFromResponse] rawUser no está disponible", responseBody);
    return null;
  }

  const user = {
    id: (rawUser as Record<string, unknown>).id,
    nombre: (rawUser as Record<string, unknown>).nombre,
    email: (rawUser as Record<string, unknown>).email,
    tipo: (rawUser as Record<string, unknown>).tipo,
    estado: (rawUser as Record<string, unknown>).estado,
  };

  console.log("[buildUserFromResponse] Usuario extraído:", user);

  if (
    (typeof user.id === "string" || typeof user.id === "number") &&
    typeof user.nombre === "string" &&
    typeof user.tipo === "string"
  ) {
    console.log("[buildUserFromResponse] Usuario válido, tipo:", user.tipo);
    return user as AuthProfile;
  }

  console.warn("[buildUserFromResponse] Validación fallida:", { id: typeof user.id, nombre: typeof user.nombre, tipo: typeof user.tipo });
  return null;
}

function buildUserFromRegisterResponse(
  responseBody: { userId: string | number; username: string },
  payload: RegisterPayload,
): AuthProfile {
  return {
    id: String(responseBody.userId),
    nombre: responseBody.username,
    email: responseBody.username,
    tipo: payload.tipo,
  };
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

  const user = buildUserFromResponse(responseBody as Record<string, unknown>);

  if (!user) {
    throw new Error("La respuesta de login no incluye un usuario válido.");
  }

  const session: AuthSession = {
    accessToken: responseBody.token,
    refreshToken: responseBody.refreshToken,
    user,
  };

  console.log("[login] Sesión creada:", { user: session.user, tipo: session.user?.tipo });

  storeAuthSession(session);

  // Autenticar también en TechMarket-IA para obtener el UUID del dominio
  try {
    const tmLogin = await loginTechMarket(credentials.email, credentials.password);
    setTechmarketToken(tmLogin.accessToken);
    setTechmarketUserId(tmLogin.userId);
    console.log("[login] TechMarket-IA auth OK, userId:", tmLogin.userId);
  } catch {
    console.warn("[login] TechMarket-IA auth falló, se usará admin como fallback");
  }

  return session;
}

export async function refreshAuthSession(): Promise<AuthSession> {
  if (typeof window === "undefined") {
    throw new Error("No se puede refrescar la sesión fuera del navegador.");
  }

  if (refreshSessionPromise) {
    return refreshSessionPromise;
  }

  refreshSessionPromise = (async () => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    const currentUser = getStoredUser();

    if (!refreshToken || !currentUser) {
      clearAuthSession();
      throw new Error("Tu sesión venció. Inicia sesión nuevamente.");
    }

    const response = await fetch(buildUrl("/auth/refresh-token"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": "00000000-0000-0000-0000-000000000000",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const responseBody = await readResponseBody(response);

    if (!response.ok || !isRefreshResponse(responseBody)) {
      clearAuthSession();
      throw new Error(resolveErrorMessage(responseBody, "Tu sesión venció. Inicia sesión nuevamente."));
    }

    const session: AuthSession = {
      accessToken: responseBody.token,
      refreshToken: responseBody.refreshToken,
      user: currentUser,
    };

    storeAuthSession(session);
    return session;
  })().finally(() => {
    refreshSessionPromise = null;
  });

  return refreshSessionPromise;
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

  if (!isRegisterResponse(responseBody)) {
    throw new Error("La respuesta de registro no incluye accessToken y refreshToken.");
  }

  const user = buildUserFromRegisterResponse(responseBody, payload);

  const session: AuthSession = {
    accessToken: responseBody.accessToken,
    refreshToken: responseBody.refreshToken,
    user,
  };

  storeAuthSession(session);
  return session;
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  clearToken();
  window.localStorage.removeItem("refreshToken");
  clearUser();
  clearTechmarketAuth();
  try {
    // eliminar cookie usada por middleware
    document.cookie = "techmarket_role=; Max-Age=0; path=/";
    console.log("[clearAuthSession] techmarket_role cookie eliminada");
  } catch (e) {
    // ignore
  }
}

function getStoredUser(): AuthProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem("user");
  if (!rawUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as Partial<AuthProfile>;
    if (
      (typeof parsedUser.id === "string" || typeof parsedUser.id === "number") &&
      typeof parsedUser.nombre === "string" &&
      typeof parsedUser.tipo === "string"
    ) {
      return parsedUser as AuthProfile;
    }
  } catch {
    return null;
  }

  return null;
}
