export type CommunityFeedPost = {
  id: string;
  author: string;
  role: string;
  time: string;
  title: string;
  body: string;
  tag: string;
  location: string;
  image?: string;
  createdAt: string;
};

const COMMUNITY_FEED_STORAGE_KEY = "techmarket.community.feed";

const isString = (value: unknown): value is string => typeof value === "string";

const isCommunityFeedPost = (value: unknown): value is CommunityFeedPost => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isString(candidate.id) &&
    isString(candidate.author) &&
    isString(candidate.role) &&
    isString(candidate.time) &&
    isString(candidate.title) &&
    isString(candidate.body) &&
    isString(candidate.tag) &&
    isString(candidate.location) &&
    isString(candidate.createdAt) &&
    (candidate.image === undefined || isString(candidate.image))
  );
};

export const readCommunityFeedPosts = (): CommunityFeedPost[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(COMMUNITY_FEED_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCommunityFeedPost);
  } catch {
    return [];
  }
};

export const writeCommunityFeedPosts = (posts: CommunityFeedPost[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(COMMUNITY_FEED_STORAGE_KEY, JSON.stringify(posts));
};

export const mergeCommunityFeedPosts = (posts: CommunityFeedPost[]): CommunityFeedPost[] => {
  const byId = new Map<string, CommunityFeedPost>();

  posts.forEach((post) => {
    byId.set(post.id, post);
  });

  return [...byId.values()].sort((a, b) => {
    const bTime = Date.parse(b.createdAt);
    const aTime = Date.parse(a.createdAt);

    if (Number.isNaN(bTime) || Number.isNaN(aTime)) {
      return 0;
    }

    return bTime - aTime;
  });
};

export const upsertCommunityFeedPosts = (incomingPosts: CommunityFeedPost[]): CommunityFeedPost[] => {
  const currentPosts = readCommunityFeedPosts();
  const mergedPosts = mergeCommunityFeedPosts([...currentPosts, ...incomingPosts]);

  writeCommunityFeedPosts(mergedPosts);

  return mergedPosts;
};
