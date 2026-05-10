import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getToken, clearToken, clearUser } from "./tokenStore";

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
  if (!isAuthenticated()) {
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
  router.push("/auth");
}
