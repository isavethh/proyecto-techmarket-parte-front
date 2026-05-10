const TOKEN_KEY = "accessToken";

const canUseLocalStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function getToken(): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}