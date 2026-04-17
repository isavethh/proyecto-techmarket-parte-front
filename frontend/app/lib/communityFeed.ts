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
const EMPTY_COMMUNITY_FEED: CommunityFeedPost[] = [];

let cachedRawFeed: string | null | undefined;
let cachedFeedPosts: CommunityFeedPost[] = EMPTY_COMMUNITY_FEED;

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
    return EMPTY_COMMUNITY_FEED;
  }

  const stored = window.localStorage.getItem(COMMUNITY_FEED_STORAGE_KEY);

  if (stored === cachedRawFeed) {
    return cachedFeedPosts;
  }

  cachedRawFeed = stored;

  if (!stored) {
    cachedFeedPosts = EMPTY_COMMUNITY_FEED;
    return cachedFeedPosts;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      cachedFeedPosts = EMPTY_COMMUNITY_FEED;
      return cachedFeedPosts;
    }

    const filteredPosts = parsed.filter(isCommunityFeedPost);
    cachedFeedPosts = filteredPosts.length ? filteredPosts : EMPTY_COMMUNITY_FEED;
    return cachedFeedPosts;
  } catch {
    cachedFeedPosts = EMPTY_COMMUNITY_FEED;
    return cachedFeedPosts;
  }
};

export const writeCommunityFeedPosts = (posts: CommunityFeedPost[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(posts);
  window.localStorage.setItem(COMMUNITY_FEED_STORAGE_KEY, serialized);
  cachedRawFeed = serialized;
  cachedFeedPosts = posts.length ? posts : EMPTY_COMMUNITY_FEED;
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
