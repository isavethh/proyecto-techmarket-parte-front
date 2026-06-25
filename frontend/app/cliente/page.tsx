"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { requireAuth } from "@/lib/auth/authGuard";
import {
  createSearchHistory,
  createClientChatMessage,
  getClientChatMessages,
  listClientCommunities,
  listClientCommunityPosts,
  listClientChats,
  listClientNotifications,
  listCompanyPublications,
  listFavoriteCompanies,
  listFavoriteProducts,
  listMarketplaceCompanies,
  listMarketplaceProducts,
  searchGlobal,
  searchSuggestions as fetchSearchSuggestions,
  searchTrending,
  type GlobalSearchItem,
  type ClientNotification,
  type ClientChatMessage,
  type ClientChatSummary,
  type MarketplaceCompanySummary,
  type MarketplaceProductSummary,
  type SearchSuggestion,
  type SearchTrending,
} from "@/lib/api/iaApi";
import {
  CommunityFeedPost,
  mergeCommunityFeedPosts,
  readCommunityFeedPosts,
  subscribeCommunityFeedExternal,
  upsertCommunityFeedPosts,
} from "../lib/communityFeed";
import {
  FOLLOW_UPDATED_EVENT,
  readFollowing,
  toggleFollow,
  type FollowedAccount,
} from "../lib/followStore";
import { ClientPageHeader } from "../components/ClientPageSections";
import { useClientExperience } from "../components/ClientExperienceShell";
import {
  PublicationActionButton,
  PublicationAvatar,
  PublicationCard,
} from "../components/PublicationCard";
import {
  PublicationViewerData,
  PublicationViewerModal,
} from "../components/PublicationViewerModal";

type SearchMode = "normal" | "ia";
type TopView = "feed" | "seguimiento";

const buildClientProfileHref = (name: string): string => {
  const slug =
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "perfil";

  return `/cliente/perfil/${slug}`;
};

type MiniCard = {
  name: string;
  imageClass: string;
};

type SuggestedAccount = {
  id: string;
  slug: string;
  name: string;
  role: string;
  city: string;
  followers: string;
  rating: string;
  avatar: string;
};

type ChatMessage = {
  id: string;
  author: "empresa" | "cliente";
  text: string;
  time: string;
};

type ChatThread = {
  id: string;
  name: string;
  company: string;
  trigger: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
  messages: ChatMessage[];
};

type PostComment = {
  id: string;
  author: string;
  text: string;
  time: string;
};

type FollowingPost = {
  id: string;
  author: string;
  kind: "empresa" | "usuario";
  followedSince: string;
  title: string;
  body: string;
  tag: string;
  image?: string;
  createdAt: string;
  comments?: Array<{
    id: string;
    author: string;
    text: string;
    time: string;
  }>;
};

const favorites: MiniCard[] = [];

const savedItems: MiniCard[] = [];

const baseFeedItems: CommunityFeedPost[] = [];

const formatAiSearchPrice = (value: number | null): string =>
  typeof value === "number"
    ? new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(value)
    : "Sin precio";

const aiThinkingMessages = [
  "Interpretando tu necesidad técnica...",
  "Rastreando proveedores con mejor reputación...",
  "Calculando ranking por relevancia y cercania...",
  "Filtrando opciones con disponibilidad real...",
];

const aiThinkingSignals = ["NLP", "SCORE", "MATCH", "RANK"];

const suggestedAccounts: SuggestedAccount[] = [];

const quickActions = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "#feed" },
];

const stories: string[] = [];

const activityFallback: string[] = [];

const feedCommentsByPostId: Record<string, PostComment[]> = {};

const feedBaseLikesByPostId: Record<string, number> = {};

const activeClientName = "Cliente";

const emptyFeedSnapshot: CommunityFeedPost[] = [];
const emptyFollowingSnapshot: FollowedAccount[] = [];

const createAvatarInitials = (value: string): string => {
  const initials = value
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "CH";
};

const formatChatTime = (isoDate?: string | null): string => {
  if (!isoDate) {
    return "Ahora";
  }

  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) {
    return "Ahora";
  }

  const date = new Date(parsed);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const buildChatMessage = (message: ClientChatMessage): ChatMessage => ({
  id: message.id,
  author: message.remitente === "cliente" ? "cliente" : "empresa",
  text: message.contenido,
  time: formatChatTime(message.fecha),
});

const buildChatThread = (
  chat: ClientChatSummary,
  messages: ClientChatMessage[],
): ChatThread => {
  const company = chat.empresa.nombre ?? "Empresa";
  const mappedMessages = messages.map(buildChatMessage);
  const lastMessage = mappedMessages[mappedMessages.length - 1];

  return {
    id: chat.id,
    name: "Chat activo",
    company,
    trigger: "Conversacion cliente",
    lastMessage: lastMessage?.text ?? chat.ultimoMensaje ?? "Conversacion iniciada",
    time: lastMessage?.time ?? "Ahora",
    unread: chat.mensajesSinLeer ?? 0,
    avatar: createAvatarInitials(company),
    messages:
      mappedMessages.length > 0
        ? mappedMessages
        : chat.ultimoMensaje
          ? [
              {
                id: `${chat.id}-last`,
                author: "empresa",
                text: chat.ultimoMensaje,
                time: "Ahora",
              },
            ]
          : [],
  };
};

const subscribeCommunityFeed = subscribeCommunityFeedExternal;

const subscribeFollowing = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "techmarket.following") onStoreChange();
  };
  const handleUpdate = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(FOLLOW_UPDATED_EVENT, handleUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FOLLOW_UPDATED_EVENT, handleUpdate);
  };
};

const followingPosts: FollowingPost[] = [];

const formatPublishedAt = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);

  if (Number.isNaN(parsed)) {
    return "Reciente";
  }

  const date = new Date(parsed);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes} UTC`;
};

const getFeedSaleMeta = (
  item: CommunityFeedPost,
): Pick<PublicationViewerData, "variant" | "saleKind" | "priceLabel" | "conditionLabel" | "categoryLabel"> => {
  const normalizedText = `${item.tag} ${item.title} ${item.body}`.toLowerCase();
  const hasSaleSignals =
    normalizedText.includes("producto") ||
    normalizedText.includes("servicio") ||
    normalizedText.includes("venta") ||
    normalizedText.includes("oferta") ||
    normalizedText.includes("promoc") ||
    normalizedText.includes("precio") ||
    normalizedText.includes("stock");

  if (!hasSaleSignals) {
    return { variant: "normal" };
  }

  const saleKind =
    normalizedText.includes("servicio") ||
    normalizedText.includes("mantenimiento") ||
    normalizedText.includes("diagnostico")
      ? "servicio"
      : "producto";

  const priceMatch = `${item.title} ${item.body}`.match(/(bs\.?\s?[\d.,]+|\$\s?[\d.,]+)/i);

  const conditionLabel = normalizedText.includes("seminuevo")
    ? "Seminuevo"
    : normalizedText.includes("usado")
      ? "Usado"
      : normalizedText.includes("nuevo")
        ? "Nuevo"
        : "Sin dato";

  return {
    variant: "sale",
    saleKind,
    priceLabel: priceMatch ? priceMatch[1].replace(/\s+/g, " ").trim() : "Precio por inbox",
    conditionLabel,
    categoryLabel: item.tag,
  };
};

export default function ClientePage() {
  const router = useRouter();
  const { openPostModal } = useClientExperience();

  useEffect(() => {
    requireAuth(router);
  }, [router]);

  const [topView, setTopView] = useState<TopView>("feed");
  const [searchMode, setSearchMode] = useState<SearchMode>("normal");
  const [query, setQuery] = useState<string>("");
  const [headerQuery, setHeaderQuery] = useState<string>("");
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<GlobalSearchItem[]>([]);
  const [searchTotal, setSearchTotal] = useState<number | null>(null);
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<SearchTrending[]>([]);
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [hasAiSearchRun, setHasAiSearchRun] = useState<boolean>(false);
  const [aiThinkingMessageIndex, setAiThinkingMessageIndex] = useState(0);
  const [aiResults, setAiResults] = useState<MarketplaceProductSummary[]>([]);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);
  const aiSearchTimerRef = useRef<number | null>(null);
  const companyFeedPosts = useSyncExternalStore(
    subscribeCommunityFeed,
    readCommunityFeedPosts,
    () => emptyFeedSnapshot,
  );
  const followingAccounts = useSyncExternalStore(
    subscribeFollowing,
    readFollowing,
    () => emptyFollowingSnapshot,
  );
  const [activeChatId, setActiveChatId] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [likedFeedPostIds, setLikedFeedPostIds] = useState<string[]>([]);
  const [activeFeedCommentPostId, setActiveFeedCommentPostId] = useState<string | null>(null);
  const [feedCommentDraftByPostId, setFeedCommentDraftByPostId] = useState<Record<string, string>>({});
  const [customFeedCommentsByPostId, setCustomFeedCommentsByPostId] = useState<Record<string, PostComment[]>>({});
  const [auraLikePostId, setAuraLikePostId] = useState<string | null>(null);
  const [activePublication, setActivePublication] = useState<PublicationViewerData | null>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<MarketplaceProductSummary[]>([]);
  const [favoriteCompanies, setFavoriteCompanies] = useState<MarketplaceCompanySummary[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [recommendedCompanies, setRecommendedCompanies] = useState<MarketplaceCompanySummary[]>([]);
  const [clientApiError, setClientApiError] = useState<string | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [chatError, setChatError] = useState<string | null>(null);

  const activeChat = chatThreads.find((chat) => chat.id === activeChatId) ?? null;

  useEffect(() => {
    let active = true;

    Promise.all([
      listFavoriteProducts(),
      listFavoriteCompanies(),
      listClientNotifications(),
      listMarketplaceCompanies(),
    ])
      .then(([products, companies, notificationItems, allCompanies]) => {
        if (!active) {
          return;
        }
        setFavoriteProducts(products);
        setFavoriteCompanies(companies);
        setNotifications(notificationItems);
        setRecommendedCompanies(allCompanies.slice(0, 3));
        setClientApiError(null);
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setFavoriteProducts([]);
        setFavoriteCompanies([]);
        setNotifications([]);
        setRecommendedCompanies([]);
        setClientApiError(error instanceof Error ? error.message : "No se pudo cargar datos cliente");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadChats = async () => {
      setIsChatLoading(true);
      setChatError(null);

      try {
        const chats = await listClientChats();
        const threads = await Promise.all(
          chats.map(async (chat) => {
            const messages = await getClientChatMessages(chat.id).catch(() => []);
            return buildChatThread(chat, messages);
          }),
        );

        if (!active) {
          return;
        }

        setChatThreads(threads);
        setActiveChatId((current) => {
          if (current && threads.some((thread) => thread.id === current)) {
            return current;
          }

          return threads[0]?.id ?? "";
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setChatThreads([]);
        setActiveChatId("");
        setChatError(error instanceof Error ? error.message : "No se pudieron cargar chats");
      } finally {
        if (active) {
          setIsChatLoading(false);
        }
      }
    };

    loadChats();

    // Poll for new chat messages every 8 seconds
    const pollInterval = setInterval(() => {
      if (!active) return;
      listClientChats()
        .then((chats) =>
          Promise.all(
            chats.map(async (chat) => {
              const messages = await getClientChatMessages(chat.id).catch(() => []);
              return buildChatThread(chat, messages);
            }),
          ),
        )
        .then((threads) => {
          if (active) setChatThreads(threads);
        })
        .catch(() => {});
    }, 8_000);

    return () => {
      active = false;
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchAndSeedCompanyPublications = async () => {
      try {
        const followedCompanies = readFollowing().filter((a) => a.type === "empresa");
        if (!active || followedCompanies.length === 0) return;

        const allPublications = (
          await Promise.all(followedCompanies.map((c) => listCompanyPublications(c.id)))
        ).flat();

        if (!active || allPublications.length === 0) return;

        const feedPosts = allPublications.map((pub) => ({
          id: pub.id,
          author: pub.companyName,
          authorId: pub.companyId,
          role: "Empresa verificada",
          time: "Reciente",
          title: pub.title,
          body: pub.body,
          tag: pub.type === "TEXT" ? "Publicacion de texto" : "Publicación",
          location: "TechMarket",
          image: pub.image,
          createdAt: pub.createdAt,
        }));

        upsertCommunityFeedPosts(feedPosts);
      } catch {
        // silently ignore — feed will stay with whatever it has
      }
    };

    void fetchAndSeedCompanyPublications();

    const feedPollInterval = setInterval(() => {
      if (active) void fetchAndSeedCompanyPublications();
    }, 60_000);

    return () => {
      active = false;
      clearInterval(feedPollInterval);
    };
  }, []);

  const visibleFavorites = useMemo<MiniCard[]>(
    () =>
      favoriteProducts.map((product) => ({
        name: product.nombre,
        imageClass: "from-cyan-300/40 via-blue-500/30 to-slate-900/60",
      })),
    [favoriteProducts],
  );

  const visibleCompanies = useMemo(
    () =>
      favoriteCompanies.map((company) => ({
        slug: company.id,
        name: company.nombre,
        logo:
          company.logo ??
          (company.nombre
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((token) => token[0]?.toUpperCase() ?? "")
            .join("") ||
            "TM"),
        city: "Bolivia",
        category: "Empresa seguida",
        tagline: "Empresa seguida desde tu cuenta cliente.",
        rating: company.calificacion ?? 0,
        reviewCount: 0,
      })),
    [favoriteCompanies],
  );

  useEffect(() => {
    let active = true;

    listClientCommunities()
      .then((communities) => {
        if (!active) return;
        return Promise.all(
          communities.map((community) =>
            listClientCommunityPosts(community.id)
              .then((posts) =>
                posts.map<CommunityFeedPost>((post) => ({
                  id: post.id,
                  author: post.autor,
                  role: "Comunidad",
                  time: "",
                  title: post.titulo ?? post.contenido.slice(0, 72).replace(/[.,]$/, ""),
                  body: post.contenido,
                  tag: community.nombre,
                  location: "TechMarket",
                  createdAt: post.creadoEn ?? new Date().toISOString(),
                })),
              )
              .catch(() => [] as CommunityFeedPost[]),
          ),
        ).then((grouped) => {
          if (!active) return;
          const allPosts = grouped.flat();
          if (allPosts.length > 0) {
            upsertCommunityFeedPosts(allPosts);
          }
        });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    searchTrending()
      .then((items) => {
        if (!active) {
          return;
        }
        setTrendingSearches(items);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setTrendingSearches([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setSearchSuggestions([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      fetchSearchSuggestions(normalizedQuery)
        .then((items) => {
          setSearchSuggestions(items);
        })
        .catch(() => {
          setSearchSuggestions([]);
        });
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const aiSummary = useMemo(() => {
    if (!hasAiSearchRun || !aiResults.length) return "";
    return `Encontré ${aiResults.length} ${aiResults.length === 1 ? "publicación" : "publicaciones"} en el marketplace para "${aiQuery.trim()}".`;
  }, [aiQuery, aiResults.length, hasAiSearchRun]);

  useEffect(() => {
    if (!isThinking) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setAiThinkingMessageIndex((current) => (current + 1) % aiThinkingMessages.length);
    }, 820);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isThinking]);

  useEffect(() => {
    return () => {
      if (aiSearchTimerRef.current !== null) {
        window.clearTimeout(aiSearchTimerRef.current);
      }
    };
  }, []);

  const fullFeed = useMemo(() => mergeCommunityFeedPosts(companyFeedPosts), [companyFeedPosts]);

  const filteredFeed = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return fullFeed;
    }

    return fullFeed.filter((item) => {
      const bucket = `${item.author} ${item.title} ${item.body} ${item.tag} ${item.location}`.toLowerCase();
      return bucket.includes(cleanQuery);
    });
  }, [fullFeed, query]);

  const filteredFollowingPosts = useMemo<FollowingPost[]>(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (followingAccounts.length === 0) return [];

    const followedIdSet = new Set(followingAccounts.map((a) => a.id));
    const followedNameSet = new Set(followingAccounts.map((a) => a.name.toLowerCase()));

    return fullFeed
      .filter((post) => {
        // Match by authorId (preferred) or by author name as fallback
        if (post.authorId && followedIdSet.has(post.authorId)) return true;
        return post.author && followedNameSet.has(post.author.toLowerCase());
      })
      .map((post) => {
        const matchedAccount =
          followingAccounts.find((a) => post.authorId && a.id === post.authorId) ??
          followingAccounts.find((a) => a.name.toLowerCase() === post.author.toLowerCase());
        return {
          id: post.id,
          author: post.author || matchedAccount?.name || "Empresa",
          kind: (matchedAccount?.type ?? "empresa") as "empresa" | "usuario",
          followedSince: "Seguido",
          title: post.title,
          body: post.body,
          tag: post.tag,
          image: post.image,
          createdAt: post.createdAt,
        };
      })
      .filter((post) => {
        if (!cleanQuery) return true;
        const bucket = `${post.author} ${post.title} ${post.body} ${post.tag}`.toLowerCase();
        return bucket.includes(cleanQuery);
      });
  }, [fullFeed, followingAccounts, query]);

  const clearPendingAiSearch = () => {
    if (aiSearchTimerRef.current === null) {
      return;
    }

    window.clearTimeout(aiSearchTimerRef.current);
    aiSearchTimerRef.current = null;
  };

  const resetAiSearchSession = () => {
    clearPendingAiSearch();
    setIsThinking(false);
    setHasAiSearchRun(false);
    setAiThinkingMessageIndex(0);
    setAiResults([]);
  };

  const runGlobalSearch = async (nextQuery: string) => {
    const normalizedQuery = nextQuery.trim();

    if (!normalizedQuery) {
      setLastSearchQuery("");
      setSearchResults([]);
      setSearchTotal(null);
      setSearchStatus("idle");
      setSearchError(null);
      return;
    }

    setLastSearchQuery(normalizedQuery);
    setSearchStatus("loading");
    setSearchError(null);

    try {
      const response = await searchGlobal(normalizedQuery);
      setSearchResults(response.resultados ?? []);
      setSearchTotal(response.total ?? 0);
      setSearchStatus("success");

      try {
        await createSearchHistory({ query: normalizedQuery, tipo: "general" });
      } catch {
        // ignore history failures
      }
    } catch (error) {
      setSearchResults([]);
      setSearchTotal(null);
      setSearchStatus("error");
      setSearchError(error instanceof Error ? error.message : "Error de búsqueda");
    }
  };

  const handleAiSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isThinking) {
      return;
    }

    const queryText = aiQuery.trim();
    if (!queryText) {
      return;
    }

    clearPendingAiSearch();

    setHasAiSearchRun(true);
    setAiThinkingMessageIndex(0);
    setIsThinking(true);
    setAiResults([]);
    setAiSearchError(null);

    try {
      // Búsqueda REAL en el marketplace (TechMarket-IA): título + descripción + sinónimos tech
      // (notebook -> laptop, etc.) sobre todo el catálogo. Sin RAG ni mocks.
      const page = await listMarketplaceProducts({ search: queryText });
      setAiResults(page.productos ?? []);
    } catch (error) {
      setAiResults([]);
      setAiSearchError(
        error instanceof Error ? error.message : "No se pudo buscar en el marketplace.",
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleHeaderSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runGlobalSearch(headerQuery);
  };

  const handleNormalSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runGlobalSearch(query);
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    runGlobalSearch(text);
  };

  const isPostLiked = (postId: string): boolean => likedFeedPostIds.includes(postId);

  const getFeedLikeCount = (postId: string): number => {
    const baseLikes = feedBaseLikesByPostId[postId] ?? 0;
    return baseLikes + (isPostLiked(postId) ? 1 : 0);
  };

  const getMergedFeedComments = (postId: string): PostComment[] => [
    ...(feedCommentsByPostId[postId] ?? []),
    ...(customFeedCommentsByPostId[postId] ?? []),
  ];

  const handleToggleFeedLike = (postId: string) => {
    const liked = isPostLiked(postId);

    setLikedFeedPostIds((current) => {
      if (liked) {
        return current.filter((id) => id !== postId);
      }

      return [...current, postId];
    });

    if (!liked) {
      setAuraLikePostId(postId);
      window.setTimeout(() => {
        setAuraLikePostId((current) => (current === postId ? null : current));
      }, 520);
    }
  };

  const handleToggleFeedComment = (postId: string) => {
    setActiveFeedCommentPostId((current) => (current === postId ? null : postId));
  };

  const handleSubmitFeedComment = (event: FormEvent<HTMLFormElement>, postId: string) => {
    event.preventDefault();

    const draftComment = (feedCommentDraftByPostId[postId] ?? "").trim();

    if (draftComment.length < 3) {
      return;
    }

    const nextComment: PostComment = {
      id: `${postId}-client-comment-${Date.now()}`,
      author: activeClientName,
      text: draftComment,
      time: "Ahora",
    };

    setCustomFeedCommentsByPostId((current) => ({
      ...current,
      [postId]: [...(current[postId] ?? []), nextComment],
    }));

    setFeedCommentDraftByPostId((current) => ({
      ...current,
      [postId]: "",
    }));
  };

  const handleSendFloatingChatMessage = async () => {
    if (!activeChat) {
      return;
    }

    const normalizedMessage = draftMessage.trim();
    if (normalizedMessage.length < 2) {
      return;
    }

    try {
      const sentMessage = await createClientChatMessage(activeChat.id, normalizedMessage);
      const nextMessage = buildChatMessage(sentMessage);

      setChatThreads((current) =>
        current.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                lastMessage: nextMessage.text,
                time: nextMessage.time,
                unread: 0,
                messages: [...chat.messages, nextMessage],
              }
            : chat,
        ),
      );
      setDraftMessage("");
      setChatError(null);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "No se pudo enviar el mensaje");
    }
  };

  const handleOpenFeedPublication = (item: CommunityFeedPost) => {
    const mergedComments = getMergedFeedComments(item.id);

    setActivePublication({
      id: item.id,
      title: item.title,
      body: item.body,
      author: item.author,
      role: item.role,
      location: item.location,
      createdAt: item.time || formatPublishedAt(item.createdAt),
      tag: item.tag,
      image: item.image,
      initialLikeCount: getFeedLikeCount(item.id),
      initiallyLiked: isPostLiked(item.id),
      initialComments: mergedComments.map((comment) => ({
        id: comment.id,
        author: comment.author,
        text: comment.text,
        time: comment.time,
      })),
      ...getFeedSaleMeta(item),
    });
  };

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader
        sectionLabel="Cliente activo"
        brandHref="/"
        middleSlot={(
          <form onSubmit={handleHeaderSearch}>
            <input
              className="auth-input"
              placeholder="Buscar en TechMarket..."
              value={headerQuery}
              onChange={(event) => setHeaderQuery(event.target.value)}
            />
          </form>
        )}
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <section className="tech-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                CM
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Tu panel</p>
                <p className="text-xs text-cyan-100/75">Cliente activo en TechMarket</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href} className="auth-action">
                  {action.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Perfil destacado</p>
            <div className="mt-3 rounded-2xl border border-cyan-100/15 bg-slate-950/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Recomendado para ti</p>
              <h3 className="mt-2 text-lg font-semibold text-cyan-50">Perfil desde API</h3>
              <p className="mt-1 text-sm text-cyan-100/75">Carga empresas desde la API para ver recomendaciones.</p>
              <Link
                href="/cliente/empresas"
                className="mt-4 inline-flex rounded-xl border border-cyan-100/10 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/15"
              >
                Ver perfil
              </Link>
            </div>
          </section>

          <section id="favoritos" className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Favoritos</p>
            {clientApiError ? (
              <p className="mt-2 text-xs text-amber-200/85">
                No se pudo conectar con la API: {clientApiError}
              </p>
            ) : null}
            <div className="mt-3 grid gap-3">
              {visibleFavorites.length ? (
                visibleFavorites.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-cyan-100/15 p-3">
                    <div
                      className={`h-16 w-full rounded-xl border border-cyan-100/10 bg-gradient-to-br ${item.imageClass}`}
                    />
                    <p className="mt-2 text-xs text-cyan-100/85">{item.name}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-cyan-100/15 p-3 text-xs text-cyan-100/75">
                  No hay favoritos desde la API.
                </div>
              )}
            </div>
          </section>

          <section id="empresas" className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">
              {favoriteCompanies.length ? "Empresas seguidas" : "Empresas destacadas"}
            </p>
            <div className="mt-3 space-y-3">
              {visibleCompanies.length ? (
                visibleCompanies.map((profile) => (
                  <Link
                    key={profile.slug}
                    href={`/cliente/empresa/${profile.slug}`}
                    className="block rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3 transition hover:bg-slate-950/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                        {profile.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-cyan-50">{profile.name}</p>
                        <p className="truncate text-xs text-cyan-200/70">{profile.city} · {profile.category}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-cyan-100/75">{profile.tagline}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-cyan-200/70">
                      <span>Valoracion {profile.rating.toFixed(1)}</span>
                      <span>{profile.reviewCount} opiniones</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-cyan-100/15 p-3 text-xs text-cyan-100/75">
                  No hay empresas seguidas desde la API.
                </div>
              )}
            </div>
          </section>

          <section id="guardados" className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">
              {notifications.length ? "Notificaciones" : "Guardados"}
            </p>
            <div className="mt-3 grid gap-3">
              {notifications.length
                ? notifications.slice(0, 4).map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.enlace ?? "#"}
                      className="rounded-2xl border border-cyan-100/15 p-3 text-xs text-cyan-100/85"
                    >
                      <span className={notification.leido ? "text-cyan-100/70" : "font-semibold text-cyan-50"}>
                        {notification.titulo}
                      </span>
                    </Link>
                  ))
                : (
                    <div className="rounded-2xl border border-dashed border-cyan-100/15 p-3 text-xs text-cyan-100/75">
                      No hay notificaciones desde la API.
                    </div>
                  )}
            </div>
          </section>
        </aside>

        <section className="space-y-4">
          <section id="feed" className="tech-card">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">COMUNIDAD CLIENTE</p>
                <h1 className="mt-2 text-xl font-semibold text-cyan-50 md:text-2xl">Feed principal</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openPostModal}
                  className="rounded-xl border border-cyan-200/25 bg-cyan-400/20 px-4 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/25"
                >
                  Nueva publicación
                </button>
                <div className="auth-switch">
                  <button
                    type="button"
                    className={topView === "feed" ? "active" : ""}
                    onClick={() => setTopView("feed")}
                  >
                    Feed
                  </button>
                  <button
                    type="button"
                    className={topView === "seguimiento" ? "active" : ""}
                    onClick={() => setTopView("seguimiento")}
                  >
                    Seguimiento
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-cyan-100/75">
              Seguimiento muestra publicaciones de cuentas que sigues. Marketplace ahora vive en su propia seccion.
            </p>
          </section>

          {topView === "feed" ? (
            <button
              type="button"
              onClick={openPostModal}
              className="w-full rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.9),rgba(7,24,44,0.96))] p-4 text-left shadow-xl shadow-slate-950/20 transition hover:border-cyan-200/35"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                  US
                </span>
                <span className="flex-1 rounded-full border border-cyan-100/15 bg-slate-950/35 px-4 py-3 text-sm text-cyan-100/70">
                  Que quieres publicar en TechMarket?
                </span>
              </div>
            </button>
          ) : null}

          {topView === "feed" && (
            <>
          <section className="tech-card">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={`tech-button ${
                  searchMode === "normal" ? "tech-button-primary" : "tech-button-secondary"
                }`}
                onClick={() => {
                  clearPendingAiSearch();
                  setIsThinking(false);
                  setSearchMode("normal");
                }}
              >
                Búsqueda normal
              </button>
              <button
                type="button"
                className={`tech-button ${
                  searchMode === "ia" ? "tech-button-primary" : "tech-button-secondary"
                }`}
                onClick={() => {
                  setSearchMode("ia");
                  resetAiSearchSession();
                }}
              >
                Búsqueda con IA
              </button>
            </div>

            {searchMode === "normal" && (
              <>
                <form className="mt-4" onSubmit={handleNormalSearch}>
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <input
                      className="auth-input w-full"
                      placeholder="Busca productos, tiendas o servicios..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                      type="submit"
                      className="tech-button tech-button-primary w-full md:w-auto md:whitespace-nowrap"
                    >
                      Buscar en el feed
                    </button>
                  </div>
                </form>

                {searchSuggestions.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={`${suggestion.texto}-${suggestion.tipo}`}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion.texto)}
                        className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs text-cyan-100/85 transition hover:border-cyan-200/40"
                      >
                        {suggestion.texto}
                      </button>
                    ))}
                  </div>
                ) : null}

                {query.trim() && query.trim() === lastSearchQuery ? (
                  <div className="mt-4 space-y-3">
                    {searchStatus === "loading" ? (
                      <p className="text-xs text-cyan-200/75">Buscando en todo TechMarket...</p>
                    ) : null}
                    {searchStatus === "error" && searchError ? (
                      <p className="text-xs text-rose-200/85">{searchError}</p>
                    ) : null}
                    {searchStatus === "success" ? (
                      searchResults.length > 0 ? (
                        <div className="grid gap-3">
                          <p className="text-xs text-cyan-200/75">
                            Resultados: {searchTotal ?? searchResults.length}
                          </p>
                          {searchResults.map((result) => (
                            <Link
                              key={result.id}
                              href={result.url}
                              className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3 transition hover:border-cyan-200/40"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/75">
                                  {result.tipo}
                                </p>
                                <span className="text-[11px] text-cyan-100/60">{result.id}</span>
                              </div>
                              <p className="mt-2 text-sm font-semibold text-cyan-50">{result.titulo}</p>
                              <p className="mt-1 text-xs text-cyan-100/75">
                                {result.descripcion || "Sin descripción"}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-cyan-200/75">Sin resultados globales.</p>
                      )
                    ) : null}
                  </div>
                ) : null}
              </>
            )}

            {searchMode === "ia" && (
              <form className="mt-4 space-y-4" onSubmit={handleAiSearch}>
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <input
                    className="auth-input w-full"
                    placeholder="Ej: mi laptop funciona mal y se recalienta"
                    value={aiQuery}
                    onChange={(event) => setAiQuery(event.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isThinking}
                    className="tech-button tech-button-primary w-full md:w-auto md:whitespace-nowrap"
                  >
                    {isThinking ? "Analizando..." : "Buscar con IA"}
                  </button>
                </div>

                {aiSummary && <p className="text-sm text-cyan-100/80">{aiSummary}</p>}

                {aiSearchError ? <p className="text-xs text-rose-300">{aiSearchError}</p> : null}

                {!hasAiSearchRun && !isThinking ? (
                  <p className="text-xs text-cyan-200/75">
                    Escribe una palabra (ej: &quot;notebook&quot;, &quot;monitor&quot;) y presiona
                    &quot;Buscar con IA&quot; para ver publicaciones del marketplace.
                  </p>
                ) : null}

                {hasAiSearchRun && !isThinking && aiResults.length === 0 && !aiSearchError ? (
                  <p className="text-xs text-cyan-100/70">
                    No se encontraron publicaciones en el marketplace para esa búsqueda.
                  </p>
                ) : null}

                {aiResults.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-3">
                    {aiResults.map((result) => (
                      <article
                        key={result.id}
                        className="overflow-hidden rounded-2xl border border-cyan-100/15"
                      >
                        <div className="h-24 w-full bg-slate-800/50">
                          {result.imagenPrincipal ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={result.imagenPrincipal}
                              alt={result.nombre}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-cyan-200/75">Publicación del marketplace</p>
                          <h3 className="mt-2 line-clamp-2 text-base font-semibold text-cyan-50">
                            {result.nombre}
                          </h3>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-cyan-100">
                              {formatAiSearchPrice(result.precio)}
                            </span>
                            <Link
                              className="tech-button tech-button-secondary"
                              href="/cliente/marketplace"
                            >
                              Ver en marketplace
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </form>
            )}
          </section>

          <section className="space-y-4">
            {filteredFeed.length === 0 && (
              <div className="tech-card">
                <p className="text-sm text-cyan-100/80">No encontramos publicaciones para esa búsqueda.</p>
              </div>
            )}

            {filteredFeed.map((item) => {
              const isLiked = isPostLiked(item.id);
              const isCommentOpen = activeFeedCommentPostId === item.id;
              const mergedComments = getMergedFeedComments(item.id);
              const likeCount = getFeedLikeCount(item.id);
              const draftComment = feedCommentDraftByPostId[item.id] ?? "";

              return (
                <PublicationCard
                  key={item.id}
                  header={
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <PublicationAvatar label={item.author} />
                        <div>
                          <p className="text-sm font-semibold text-cyan-50">{item.author}</p>
                          <p className="text-xs text-cyan-200/70">
                            {item.role} · {item.location} · {formatPublishedAt(item.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-3 py-1 text-xs text-cyan-100/85">
                        {item.tag}
                      </span>
                    </div>
                  }
                  content={
                    <>
                      <h2 className="mt-4 text-lg font-semibold text-cyan-50">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-cyan-100/85">{item.body}</p>
                    </>
                  }
                  media={
                    item.image
                      ? {
                          src: item.image,
                          alt: item.title,
                          imageClassName: "h-64 w-full object-cover md:h-80",
                        }
                      : undefined
                  }
                  footer={
                    <div className="mt-4 border-t border-cyan-100/10 pt-3 text-xs text-cyan-200/75">
                      {item.time || formatPublishedAt(item.createdAt)}
                    </div>
                  }
                  actions={
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <motion.button
                        type="button"
                        onClick={() => handleToggleFeedLike(item.id)}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        animate={
                          isLiked
                            ? {
                                scale: [1, 1.04, 1],
                                boxShadow: [
                                  "0 0 0 rgba(34,211,238,0)",
                                  "0 0 24px rgba(34,211,238,0.45)",
                                  "0 0 12px rgba(34,211,238,0.25)",
                                ],
                              }
                            : {
                                scale: 1,
                                boxShadow: "0 0 0 rgba(34,211,238,0)",
                              }
                        }
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className={`group relative overflow-hidden rounded-xl border px-3 py-2 font-semibold transition ${
                          isLiked
                            ? "border-cyan-200/45 bg-cyan-300/20 text-cyan-50"
                            : "border-cyan-100/10 bg-cyan-300/10 text-cyan-100/90 hover:border-cyan-200/30 hover:bg-cyan-300/15"
                        }`}
                      >
                        <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.3),transparent_70%)]" />
                        <AnimatePresence>
                          {auraLikePostId === item.id ? (
                            <motion.span
                              className="pointer-events-none absolute inset-0 rounded-xl bg-cyan-300/35"
                              initial={{ opacity: 0.55, scale: 0.78 }}
                              animate={{ opacity: 0, scale: 1.38 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          ) : null}
                        </AnimatePresence>
                        <span className="relative z-10">{isLiked ? "Te gusta" : "Me gusta"} · {likeCount}</span>
                      </motion.button>

                      <PublicationActionButton
                        onClick={() => handleToggleFeedComment(item.id)}
                        active={isCommentOpen}
                        accent="neutral"
                      >
                        Comentar · {mergedComments.length}
                      </PublicationActionButton>

                      <PublicationActionButton
                        onClick={() => handleOpenFeedPublication(item)}
                        accent="neutral"
                      >
                        Ver publicación
                      </PublicationActionButton>
                    </div>
                  }
                  composer={
                    <AnimatePresence initial={false}>
                      {isCommentOpen ? (
                        <motion.form
                          key={`${item.id}-comment-form`}
                          onSubmit={(event) => handleSubmitFeedComment(event, item.id)}
                          initial={{ opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="mt-3 space-y-2 overflow-hidden rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3"
                        >
                          <label className="block text-xs font-semibold text-cyan-200/80">Agregar comentario</label>
                          <textarea
                            value={draftComment}
                            onChange={(event) =>
                              setFeedCommentDraftByPostId((current) => ({
                                ...current,
                                [item.id]: event.target.value,
                              }))
                            }
                            placeholder="Comparte tu opinion sobre esta publicación..."
                            className="h-24 w-full resize-none rounded-2xl border border-cyan-100/10 bg-slate-950/45 px-3 py-2 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveFeedCommentPostId(null)}
                              className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/85"
                            >
                              Cerrar
                            </button>
                            <button
                              type="submit"
                              disabled={draftComment.trim().length < 3}
                              className="rounded-xl border border-cyan-200/25 bg-cyan-400/20 px-3 py-2 text-xs font-semibold text-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Publicar
                            </button>
                          </div>
                        </motion.form>
                      ) : null}
                    </AnimatePresence>
                  }
                  thread={
                    mergedComments.length > 0 ? (
                      <motion.div
                        layout
                        className="mt-4 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3"
                      >
                        <p className="text-xs font-semibold text-cyan-200/80">Comentarios · {mergedComments.length}</p>
                        {mergedComments.map((comment) => (
                          <div key={comment.id} className="rounded-xl border border-cyan-100/10 bg-white/5 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-cyan-50">{comment.author}</p>
                              <p className="text-[10px] text-cyan-200/65">{comment.time}</p>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-cyan-100/85">{comment.text}</p>
                          </div>
                        ))}
                      </motion.div>
                    ) : null
                  }
                />
              );
            })}
          </section>
            </>
          )}

          {topView === "seguimiento" && (
            <section id="seguimiento" className="space-y-4">
              <section className="tech-card">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="tech-mono text-xs text-cyan-200/75">SEGUIMIENTO</p>
                    <h2 className="mt-2 text-xl font-semibold text-cyan-50 md:text-2xl">
                      Publicaciones de cuentas que sigues
                    </h2>
                  </div>
                  <p className="text-xs text-cyan-100/70">
                    {filteredFollowingPosts.length} publicaciones en seguimiento
                  </p>
                </div>
              </section>

              {filteredFollowingPosts.length === 0 && (
                <section className="tech-card">
                  <p className="text-sm text-cyan-100/80">
                    No encontramos publicaciones de seguimiento con ese termino.
                  </p>
                </section>
              )}

              {filteredFollowingPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(16,41,72,0.92),rgba(7,24,44,0.96))] p-4 shadow-xl shadow-slate-950/25"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">{post.author}</p>
                      <p className="text-xs text-cyan-200/70">
                        {post.kind === "empresa" ? "Cuenta empresa" : "Usuario"} · {post.followedSince}
                      </p>
                    </div>
                    <span className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-3 py-1 text-xs text-cyan-100/85">
                      {post.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-cyan-50">{post.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-cyan-100/85">{post.body}</p>

                  {post.image ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100/10">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-56 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between border-t border-cyan-100/10 pt-3 text-xs text-cyan-200/75">
                    <span>{formatPublishedAt(post.createdAt)}</span>
                    <div className="flex gap-2">
                      {post.kind === "usuario" ? (
                        <Link
                          href={buildClientProfileHref(post.author)}
                          className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-cyan-100/90"
                        >
                          Ver perfil
                        </Link>
                      ) : null}
                      <button type="button" className="rounded-xl border border-cyan-100/10 bg-cyan-300/10 px-3 py-2 text-cyan-100/90">
                        Me interesa
                      </button>
                      <button type="button" className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-cyan-100/90">
                        Comentar
                      </button>
                    </div>
                  </div>

                  {post.comments && post.comments.length > 0 ? (
                    <div className="mt-4 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                      <p className="text-xs font-semibold text-cyan-200/80">Comentarios</p>
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="rounded-xl border border-cyan-100/10 bg-white/5 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-cyan-50">{comment.author}</p>
                            <p className="text-[10px] text-cyan-200/65">{comment.time}</p>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-cyan-100/85">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </section>
          )}
        </section>

        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Cuentas recomendadas</p>
            <p className="mt-2 text-xs text-cyan-100/75">Empresas y especialistas con buena reputación en la comunidad.</p>
            <div className="mt-4 space-y-3">
              {recommendedCompanies.length > 0 ? (
                recommendedCompanies.map((company) => {
                  const initials =
                    company.nombre
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((token) => token[0]?.toUpperCase() ?? "")
                      .join("") || "TM";
                  const followed = followingAccounts.some((a) => a.id === company.id);
                  return (
                    <div
                      key={company.id}
                      className="flex items-center gap-3 rounded-2xl border border-cyan-100/15 bg-slate-950/30 p-3 transition hover:bg-slate-950/50"
                    >
                      <Link
                        href={`/cliente/empresa/${company.id}`}
                        className="flex min-w-0 flex-1 items-center gap-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-cyan-50">{company.nombre}</p>
                          {company.calificacion != null && company.calificacion > 0 && (
                            <p className="text-xs text-cyan-200/70">Valoracion {company.calificacion.toFixed(1)}</p>
                          )}
                        </div>
                      </Link>
                      <button
                        type="button"
                        title={followed ? "Dejar de seguir" : "Seguir"}
                        onClick={() =>
                          toggleFollow({ id: company.id, name: company.nombre, type: "empresa" })
                        }
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition ${
                          followed
                            ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-300"
                            : "border-cyan-100/20 bg-white/5 text-cyan-100/70 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300"
                        }`}
                      >
                        {followed ? "✓" : "+"}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-cyan-100/60">No hay cuentas recomendadas desde la API.</p>
              )}
            </div>
          </section>

          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Actividad del ecosistema</p>
            <ul className="mt-3 space-y-2 text-xs text-cyan-100/80">
              {trendingSearches.length > 0
                ? trendingSearches.map((trend) => (
                    <li key={trend.texto}>
                      {trend.texto} · {trend.busquedas} busquedas
                    </li>
                  ))
                : <li>No hay actividad desde la API.</li>}
            </ul>
          </section>
        </aside>
      </main>

      <PublicationViewerModal
        publication={activePublication}
        onClose={() => setActivePublication(null)}
        secondaryActionLabel={activePublication?.variant === "sale" ? "Contactar vendedor" : undefined}
        onSecondaryAction={() => setActivePublication(null)}
        onEngagementChange={(publicationId, snapshot) => {
          setLikedFeedPostIds((current) => {
            if (snapshot.likedByCurrentUser) {
              return current.includes(publicationId) ? current : [...current, publicationId];
            }

            return current.filter((id) => id !== publicationId);
          });

          const baseCommentIds = new Set(
            (feedCommentsByPostId[publicationId] ?? []).map((comment) => comment.id),
          );
          const nextCustomComments = snapshot.comments
            .filter((comment) => !baseCommentIds.has(comment.id))
            .map((comment) => ({
              id: comment.id,
              author: comment.author,
              text: comment.text,
              time: comment.time,
            }));

          setCustomFeedCommentsByPostId((current) => ({
            ...current,
            [publicationId]: nextCustomComments,
          }));
        }}
      />

      <AnimatePresence>
        {isThinking ? (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/72 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.9 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-100/25 bg-[linear-gradient(165deg,rgba(8,27,48,0.96),rgba(4,16,30,0.98))] px-6 py-6 text-center shadow-2xl shadow-slate-950/60"
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.26),transparent_62%)]" />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.05),transparent)]" />

              <div className="relative">
                <p className="tech-mono text-[11px] tracking-[0.24em] text-cyan-200/78">IA SEARCH ENGINE</p>
                <h3 className="mt-3 text-xl font-semibold text-cyan-50">Analizando tu consulta con IA</h3>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {aiThinkingSignals.map((signal, index) => (
                    <motion.span
                      key={signal}
                      animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                      transition={{ duration: 1.15, repeat: Number.POSITIVE_INFINITY, delay: index * 0.12 }}
                      className="rounded-full border border-cyan-100/18 bg-cyan-300/12 px-3 py-1 text-[11px] font-semibold text-cyan-100/92"
                    >
                      {signal}
                    </motion.span>
                  ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={aiThinkingMessageIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mt-4 text-sm text-cyan-100/85"
                  >
                    {aiThinkingMessages[aiThinkingMessageIndex]}
                  </motion.p>
                </AnimatePresence>

                <div className="mt-5 overflow-hidden rounded-full border border-cyan-100/15 bg-slate-950/55">
                  <motion.div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.95),rgba(59,130,246,0.55))]"
                    initial={{ width: "8%", opacity: 0.8 }}
                    animate={{ width: "100%", opacity: 0.95 }}
                    transition={{ duration: 1.75, ease: "linear" }}
                  />
                </div>

                <p className="mt-3 text-xs text-cyan-200/75">
                  Cruzando semantica, reputación y disponibilidad en tiempo real.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-5 right-4 z-50 w-[340px] max-w-[calc(100vw-1rem)] md:bottom-6 md:right-6">
        <AnimatePresence mode="wait" initial={false}>
          {isChatOpen && activeChat ? (
            <motion.div
              key="chat-open"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.9 }}
              className="overflow-hidden rounded-[1.75rem] border border-cyan-100/20 bg-[linear-gradient(180deg,rgba(8,20,35,0.98),rgba(5,13,24,0.99))] shadow-[0_24px_55px_rgba(2,12,27,0.55)]"
            >
              <div className="relative border-b border-cyan-100/12 bg-[linear-gradient(120deg,rgba(19,78,110,0.32),rgba(7,24,44,0.85))] px-4 py-3.5">
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.22),transparent_62%)]" />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                      {activeChat.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{activeChat.company}</p>
                      <p className="text-xs text-cyan-100/75">{activeChat.name}</p>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => setIsChatOpen(false)}
                    whileHover={{ y: -1, backgroundColor: "rgba(255,255,255,0.12)" }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-[10px] font-semibold text-cyan-100/85"
                  >
                    Cerrar
                  </motion.button>
                </div>

                <div className="relative mt-2 flex items-center gap-2 text-[11px] text-cyan-100/75">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.85)]" />
                  Activo ahora
                  {activeChat.unread ? (
                    <span className="rounded-full border border-cyan-100/20 bg-white/10 px-2 py-0.5 text-[10px] text-cyan-50">
                      {activeChat.unread} nuevos
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="border-b border-cyan-100/10 bg-slate-950/45 px-3 py-2.5">
                <div className="chat-scrollbar chat-scrollbar-x flex gap-2 overflow-x-auto">
                  {chatThreads.map((chat) => {
                    const isActive = chat.id === activeChatId;

                    return (
                      <motion.button
                        key={chat.id}
                        type="button"
                        onClick={() => setActiveChatId(chat.id)}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          isActive
                            ? "border-cyan-300/65 bg-cyan-300/20 text-cyan-50"
                            : "border-cyan-100/15 bg-white/5 text-cyan-100/80 hover:border-cyan-200/35 hover:bg-white/10"
                        }`}
                      >
                        {chat.company}
                        {chat.unread ? ` · ${chat.unread}` : ""}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="chat-scrollbar max-h-[300px] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,rgba(4,13,24,0.35),rgba(4,11,20,0.6))] px-4 py-3">
                {activeChat.messages.map((message, messageIndex) => (
                  <motion.div
                    key={`${activeChat.id}-${message.id}`}
                    className={`flex ${message.author === "cliente" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 8, x: message.author === "cliente" ? 8 : -8 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.2, delay: messageIndex * 0.03 }}
                  >
                    <div
                      className={`max-w-[84%] rounded-2xl border px-3 py-2 text-xs leading-5 ${
                        message.author === "cliente"
                          ? "border-cyan-200/25 bg-cyan-300/16 text-cyan-50"
                          : "border-cyan-100/10 bg-white/6 text-cyan-100/92"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="mt-2 text-right text-[10px] text-cyan-100/55">{message.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-cyan-100/10 bg-slate-950/45 px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSendFloatingChatMessage();
                      }
                    }}
                    placeholder="Escribe un mensaje..."
                    className="w-full rounded-2xl border border-cyan-100/15 bg-slate-950/45 px-3 py-2 text-xs text-cyan-50 placeholder:text-cyan-100/42 focus:outline-none focus:ring-2 focus:ring-cyan-300/35"
                  />
                  <motion.button
                    type="button"
                    onClick={handleSendFloatingChatMessage}
                    disabled={draftMessage.trim().length < 2}
                    whileHover={{ y: -1, boxShadow: "0 10px 20px rgba(6,182,212,0.22)" }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-2xl border border-cyan-200/25 bg-cyan-400/20 px-3 py-2 text-xs font-semibold text-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Enviar
                  </motion.button>
                </div>
                {chatError ? (
                  <p className="mt-2 text-[11px] text-rose-200/85">{chatError}</p>
                ) : null}
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="chat-closed"
              type="button"
              onClick={() => setIsChatOpen(true)}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              whileHover={{ y: -1, boxShadow: "0 16px 30px rgba(8, 145, 178, 0.28)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="group relative w-full overflow-hidden rounded-full border border-cyan-100/20 bg-[linear-gradient(135deg,rgba(14,116,144,0.95),rgba(8,47,73,0.98))] px-4 py-3 text-xs font-semibold text-cyan-50 shadow-lg shadow-slate-950/45"
            >
              <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(153,246,228,0.28),transparent_68%)]" />
              <span className="relative flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                  Chat cliente
                </span>
                <span className="rounded-full border border-cyan-100/25 bg-white/10 px-2 py-0.5 text-[10px]">
                  {isChatLoading ? "Cargando" : `${chatThreads.length} chats`}
                </span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
