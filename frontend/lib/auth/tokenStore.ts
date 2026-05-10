const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

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

export function getUser(): unknown {
  if (!canUseLocalStorage()) {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function setUser(user: unknown): void {
  if (!canUseLocalStorage()) {
    return;
  }

  if (user !== undefined && user !== null) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearUser(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(USER_KEY);
}