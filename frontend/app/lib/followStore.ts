export type FollowedAccount = {
  id: string;
  name: string;
  type: "empresa" | "usuario";
};

const FOLLOW_STORAGE_KEY = "techmarket.following";
export const FOLLOW_UPDATED_EVENT = "techmarket.following.updated";

const EMPTY_FOLLOWING: FollowedAccount[] = [];

let cachedRaw: string | null | undefined;
let cachedFollowing: FollowedAccount[] = EMPTY_FOLLOWING;

const isFollowedAccount = (value: unknown): value is FollowedAccount => {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    (c.type === "empresa" || c.type === "usuario")
  );
};

export const readFollowing = (): FollowedAccount[] => {
  if (typeof window === "undefined") return EMPTY_FOLLOWING;
  const stored = window.localStorage.getItem(FOLLOW_STORAGE_KEY);
  if (stored === cachedRaw) return cachedFollowing;
  cachedRaw = stored;
  if (!stored) {
    cachedFollowing = EMPTY_FOLLOWING;
    return cachedFollowing;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      cachedFollowing = EMPTY_FOLLOWING;
      return cachedFollowing;
    }
    const filtered = parsed.filter(isFollowedAccount);
    cachedFollowing = filtered.length ? filtered : EMPTY_FOLLOWING;
    return cachedFollowing;
  } catch {
    cachedFollowing = EMPTY_FOLLOWING;
    return cachedFollowing;
  }
};

const writeFollowing = (accounts: FollowedAccount[]): void => {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(accounts);
  window.localStorage.setItem(FOLLOW_STORAGE_KEY, serialized);
  cachedRaw = serialized;
  cachedFollowing = accounts.length ? accounts : EMPTY_FOLLOWING;
  window.dispatchEvent(new Event(FOLLOW_UPDATED_EVENT));
};

export const isFollowing = (id: string): boolean =>
  readFollowing().some((a) => a.id === id);

export const toggleFollow = (account: FollowedAccount): boolean => {
  const current = readFollowing();
  const exists = current.some((a) => a.id === account.id);
  if (exists) {
    writeFollowing(current.filter((a) => a.id !== account.id));
    return false;
  }
  writeFollowing([...current, account]);
  return true;
};
