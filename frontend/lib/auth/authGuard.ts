import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getToken, clearToken, clearUser, getUser } from "./tokenStore";

/**
 * Verifica si el usuario está autenticado.
 * @returns true si existe un accessToken válido
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}

/**
 * Protege rutas: redirige a /auth si no hay token.
 * Usar en useEffect de páginas protegidas.
 * @param router - Router instance de Next.js
 */
export function requireAuth(router: AppRouterInstance): void {
  const token = getToken();
  const user = getUser();
  try {
    console.log("[requireAuth] token:", token);
    console.log("[requireAuth] user:", user);
    console.log("[requireAuth] document.cookie:", typeof document !== 'undefined' ? document.cookie : 'no-document');
  } catch (e) {
    // ignore
  }

  if (!isAuthenticated()) {
    console.log("[requireAuth] no hay token, redirigiendo a /auth");
    router.push("/auth");
  }
}

/**
 * Cierra la sesión del usuario.
 * Limpia todos los datos de autenticación y redirige a /auth.
 * @param router - Router instance de Next.js
 */
export function logout(router: AppRouterInstance): void {
  clearToken();
  window.localStorage.removeItem("refreshToken");
  clearUser();
  try {
    document.cookie = "techmarket_role=; Max-Age=0; path=/";
    console.log("[logout] techmarket_role cookie eliminada");
  } catch (e) {
    // ignore
  }

  router.push("/auth");
}
