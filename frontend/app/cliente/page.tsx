"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  COMMUNITY_FEED_UPDATED_EVENT,
  CommunityFeedPost,
  mergeCommunityFeedPosts,
  readCommunityFeedPosts,
} from "../lib/communityFeed";
import { clientCompanyProfiles } from "../lib/clientCompanyProfiles";
import { ClientPageHeader } from "../components/ClientPageSections";
import {
  PublicationActionButton,
  PublicationAvatar,
  PublicationCard,
} from "../components/PublicationCard";
import {
  PublicationViewerData,
  PublicationViewerModal,
} from "../components/PublicationViewerModal";
import { buildClientProfileHref } from "../lib/clientUserProfiles";

type SearchMode = "normal" | "ia";
type TopView = "feed" | "seguimiento";

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

const favorites: MiniCard[] = [
  {
    name: "Laptop Zen 13",
    imageClass: "from-cyan-300/40 via-blue-500/30 to-slate-900/60",
  },
  {
    name: "Monitor UltraWide 34",
    imageClass: "from-emerald-300/35 via-cyan-400/30 to-slate-900/60",
  },
  {
    name: "Servicio tecnico premium",
    imageClass: "from-violet-300/35 via-sky-500/30 to-slate-900/60",
  },
];

const savedItems: MiniCard[] = [
  {
    name: "Kit limpieza PC",
    imageClass: "from-cyan-200/35 via-slate-500/30 to-slate-900/60",
  },
  {
    name: "Cargador USB-C 100W",
    imageClass: "from-emerald-200/35 via-teal-500/30 to-slate-900/60",
  },
  {
    name: "Mouse ergonomico",
    imageClass: "from-sky-200/35 via-blue-500/30 to-slate-900/60",
  },
];

const baseFeedItems: CommunityFeedPost[] = [
  {
    id: "post-1",
    author: "TechFix Lab",
    role: "Servicio tecnico",
    time: "Hace 2 horas",
    title: "Diagnostico express para laptops lentas",
    body: "Servicio a domicilio con limpieza interna y optimizacion de rendimiento.",
    tag: "Nuevo servicio",
    location: "La Paz",
    image: "/productos/laptop-pro-14.jpg",
    createdAt: "2026-04-17T10:00:00.000Z",
  },
  {
    id: "post-2",
    author: "Zona Gamer Store",
    role: "Tienda",
    time: "Hace 6 horas",
    title: "Mouse ergonomico con 20% de descuento",
    body: "Stock limitado. Ideal para jornadas largas y setup profesional.",
    tag: "Promocion",
    location: "Santa Cruz",
    image: "/productos/teclado-tkl.jpg",
    createdAt: "2026-04-17T07:30:00.000Z",
  },
  {
    id: "post-3",
    author: "ElectroCare",
    role: "Servicio tecnico",
    time: "Hace 1 dia",
    title: "Cambio de pasta termica y limpieza",
    body: "Mejora la temperatura y evita apagados inesperados.",
    tag: "Recomendado",
    location: "Cochabamba",
    image: "/productos/kit-limpieza-pc.jpg",
    createdAt: "2026-04-16T17:30:00.000Z",
  },
];

const aiSuggestions = [
  {
    title: "Servicio tecnico laptop a domicilio",
    match: "Detecta fallas de rendimiento y limpieza interna",
    rating: "4.9",
    slug: "servicio-tecnico-laptop-domicilio",
    imageClass: "from-cyan-300/40 via-blue-500/30 to-slate-900/60",
  },
  {
    title: "Diagnostico y mantenimiento preventivo",
    match: "Ideal si la laptop se recalienta o va lenta",
    rating: "4.8",
    slug: "diagnostico-mantenimiento-preventivo",
    imageClass: "from-emerald-300/35 via-cyan-400/30 to-slate-900/60",
  },
  {
    title: "Cambio de pasta termica + limpieza",
    match: "Recomendado cuando hay apagados inesperados",
    rating: "4.7",
    slug: "cambio-pasta-termica-limpieza",
    imageClass: "from-violet-300/35 via-sky-500/30 to-slate-900/60",
  },
];

const aiThinkingMessages = [
  "Interpretando tu necesidad tecnica...",
  "Rastreando proveedores con mejor reputacion...",
  "Calculando ranking por relevancia y cercania...",
  "Filtrando opciones con disponibilidad real...",
];

const aiThinkingSignals = ["NLP", "SCORE", "MATCH", "RANK"];

const suggestedAccounts: SuggestedAccount[] = [
  {
    id: "acc-1",
    slug: "tecnocentro-andino",
    name: "TecnoCentro Andino",
    role: "Tienda de equipos",
    city: "La Paz",
    followers: "8.2k",
    rating: "4.8",
    avatar: "TA",
  },
  {
    id: "acc-2",
    slug: "fixcloud-soporte",
    name: "FixCloud Soporte",
    role: "Servicio tecnico",
    city: "Santa Cruz",
    followers: "3.6k",
    rating: "4.7",
    avatar: "FC",
  },
  {
    id: "acc-3",
    slug: "redlink-pro",
    name: "RedLink Pro",
    role: "Instalaciones y redes",
    city: "Cochabamba",
    followers: "1.9k",
    rating: "4.6",
    avatar: "RL",
  },
];

const quickActions = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "#feed" },
];

const stories = ["TecnoCentro", "FixCloud", "RedLink", "Zona Gamer", "ElectroCare", "BuildStation"];

const feedCommentsByPostId: Record<string, PostComment[]> = {
  "post-1": [
    {
      id: "post-1-comment-1",
      author: "Marco T.",
      text: "Me sirvio este servicio, dejaron mi laptop mucho mas rapida.",
      time: "Hace 21 min",
    },
    {
      id: "post-1-comment-2",
      author: "Paola R.",
      text: "Atienden fines de semana? necesito mantenimiento urgente.",
      time: "Hace 9 min",
    },
  ],
  "post-2": [
    {
      id: "post-2-comment-1",
      author: "Diego V.",
      text: "El descuento sigue activo? quiero dos unidades para oficina.",
      time: "Hace 17 min",
    },
  ],
  "seed-company-post-1": [
    {
      id: "seed-company-post-1-comment-1",
      author: "Lina C.",
      text: "Buena info, gracias por publicar detalles de rendimiento.",
      time: "Hace 34 min",
    },
  ],
};

const feedBaseLikesByPostId: Record<string, number> = {
  "post-1": 24,
  "post-2": 17,
  "post-3": 12,
  "seed-company-post-1": 9,
};

const activeClientName = "Camila Mendoza";

const clientChatThreads: ChatThread[] = [
  {
    id: "chat-1",
    name: "Sergio Ramirez",
    company: "TechFix Lab",
    trigger: "Buscaste servicio tecnico",
    lastMessage: "Vi tu busqueda y puedo ayudarte hoy mismo.",
    time: "Ahora",
    unread: 1,
    avatar: "TR",
    messages: [
      { id: "m1", author: "empresa", text: "Hola, vi que buscaste servicio tecnico.", time: "10:20" },
      { id: "m2", author: "empresa", text: "Puedo atenderte hoy mismo en tu zona.", time: "10:21" },
      { id: "m3", author: "cliente", text: "Perfecto, necesito diagnostico para mi laptop.", time: "10:22" },
    ],
  },
  {
    id: "chat-2",
    name: "Laura V.",
    company: "Zona Gamer Store",
    trigger: "Buscaste laptop",
    lastMessage: "Tengo modelos disponibles con entrega inmediata.",
    time: "Hace 8 min",
    unread: 2,
    avatar: "ZG",
    messages: [
      { id: "m1", author: "empresa", text: "Hola, vimos que buscaste una laptop.", time: "09:55" },
      { id: "m2", author: "empresa", text: "Tenemos opciones para estudio y gaming.", time: "09:56" },
      { id: "m3", author: "cliente", text: "Me interesa una laptop ligera para trabajo.", time: "09:58" },
      { id: "m4", author: "empresa", text: "Te comparto 2 opciones con entrega inmediata.", time: "10:00" },
    ],
  },
];

const emptyFeedSnapshot: CommunityFeedPost[] = [];

const subscribeCommunityFeed = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "techmarket.community.feed") {
      onStoreChange();
    }
  };

  const handleFeedUpdate = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COMMUNITY_FEED_UPDATED_EVENT, handleFeedUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COMMUNITY_FEED_UPDATED_EVENT, handleFeedUpdate);
  };
};

const followingPosts: FollowingPost[] = [
  {
    id: "follow-1",
    author: "TechFix Lab",
    kind: "empresa",
    followedSince: "Sigues esta cuenta desde hace 3 meses",
    title: "Promo especial para mantenimiento preventivo",
    body: "Esta semana tenemos descuento por combo de limpieza + pasta termica.",
    tag: "Promocion",
    image: "/productos/kit-limpieza-pc.jpg",
    createdAt: "2026-04-17T09:00:00.000Z",
    comments: [
      {
        id: "follow-1-comment-1",
        author: "Nadia P.",
        text: "Aproveche esta promo la semana pasada y el servicio fue rapido.",
        time: "Hace 28 min",
      },
      {
        id: "follow-1-comment-2",
        author: "Rafael G.",
        text: "Confirman si la oferta tambien aplica para equipos de escritorio?",
        time: "Hace 12 min",
      },
    ],
  },
  {
    id: "follow-2",
    author: "Zona Gamer Store",
    kind: "empresa",
    followedSince: "Sigues esta cuenta desde hace 1 mes",
    title: "Nuevo stock de laptops para trabajo y gaming",
    body: "Llegaron modelos con SSD 1TB y 16GB RAM. Entrega inmediata.",
    tag: "Producto",
    image: "/productos/laptop-pro-14.jpg",
    createdAt: "2026-04-17T07:10:00.000Z",
    comments: [
      {
        id: "follow-2-comment-1",
        author: "Diana K.",
        text: "Me interesa la de 16 GB RAM, tienen envio para Cochabamba?",
        time: "Hace 35 min",
      },
      {
        id: "follow-2-comment-2",
        author: "Jorge M.",
        text: "El modelo con 1TB esta muy bueno para trabajo pesado.",
        time: "Hace 7 min",
      },
    ],
  },
  {
    id: "follow-user-1",
    author: "Andres Cliente",
    kind: "usuario",
    followedSince: "Sigues este perfil desde hace 2 semanas",
    title: "alguien sabe que deberia comprarme, una laptop ultraligera o un setup de escritorio?",
    body: "Estoy entre una laptop ultraligera y un setup de escritorio. Que recomiendan para trabajar y jugar?",
    tag: "Consulta",
    createdAt: "2026-04-17T11:30:00.000Z",
    comments: [
      {
        id: "comment-1",
        author: "Carla M.",
        text: "Si te mueves mucho, laptop ultraligera. Si trabajas siempre en casa, setup de escritorio.",
        time: "Hace 19 min",
      },
      {
        id: "comment-2",
        author: "Luis Tech",
        text: "Para trabajar y jugar, te conviene setup de escritorio por rendimiento/precio.",
        time: "Hace 11 min",
      },
      {
        id: "comment-3",
        author: "Mariana R.",
        text: "Yo iria por laptop si priorizas portabilidad; agrega monitor externo y quedas bien para ambos casos.",
        time: "Hace 4 min",
      },
    ],
  },
];

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
  const [topView, setTopView] = useState<TopView>("feed");
  const [searchMode, setSearchMode] = useState<SearchMode>("normal");
  const [query, setQuery] = useState<string>("");
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [hasAiSearchRun, setHasAiSearchRun] = useState<boolean>(false);
  const [aiThinkingMessageIndex, setAiThinkingMessageIndex] = useState(0);
  const [aiResults, setAiResults] = useState<typeof aiSuggestions>([]);
  const aiSearchTimerRef = useRef<number | null>(null);
  const companyFeedPosts = useSyncExternalStore(
    subscribeCommunityFeed,
    readCommunityFeedPosts,
    () => emptyFeedSnapshot,
  );
  const [activeChatId, setActiveChatId] = useState(clientChatThreads[0].id);
  const [draftMessage, setDraftMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [likedFeedPostIds, setLikedFeedPostIds] = useState<string[]>([]);
  const [activeFeedCommentPostId, setActiveFeedCommentPostId] = useState<string | null>(null);
  const [feedCommentDraftByPostId, setFeedCommentDraftByPostId] = useState<Record<string, string>>({});
  const [customFeedCommentsByPostId, setCustomFeedCommentsByPostId] = useState<Record<string, PostComment[]>>({});
  const [auraLikePostId, setAuraLikePostId] = useState<string | null>(null);
  const [activePublication, setActivePublication] = useState<PublicationViewerData | null>(null);

  const activeChat =
    clientChatThreads.find((chat) => chat.id === activeChatId) ?? clientChatThreads[0];

  const aiSummary = useMemo(() => {
    if (!hasAiSearchRun || !aiResults.length) return "";
    return `Entendi tu necesidad: ${aiQuery.trim() || "consulta tecnica"}.`;
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

  const fullFeed = useMemo(
    () => mergeCommunityFeedPosts([...baseFeedItems, ...companyFeedPosts]),
    [companyFeedPosts],
  );

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

  const filteredFollowingPosts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return followingPosts;
    }

    return followingPosts.filter((item) => {
      const bucket = `${item.author} ${item.title} ${item.body} ${item.tag}`.toLowerCase();
      return bucket.includes(cleanQuery);
    });
  }, [query]);

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

  const handleAiSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isThinking) {
      return;
    }

    clearPendingAiSearch();

    setHasAiSearchRun(true);
    setAiThinkingMessageIndex(0);
    setIsThinking(true);
    setAiResults([]);

    aiSearchTimerRef.current = window.setTimeout(() => {
      setAiResults(aiSuggestions);
      setIsThinking(false);
      aiSearchTimerRef.current = null;
    }, 1850);
  };

  const handleNormalSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    <div className="flex-1 pb-10">
      <ClientPageHeader
        sectionLabel="Cliente activo"
        brandHref="/"
        middleSlot={(
          <form onSubmit={handleNormalSearch}>
            <input
              className="auth-input"
              placeholder="Buscar en TechMarket..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
        )}
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[260px_minmax(0,1fr)_300px] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
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
              <h3 className="mt-2 text-lg font-semibold text-cyan-50">{clientCompanyProfiles[0].name}</h3>
              <p className="mt-1 text-sm text-cyan-100/75">{clientCompanyProfiles[0].tagline}</p>
              <Link
                href={`/cliente/empresa/${clientCompanyProfiles[0].slug}`}
                className="mt-4 inline-flex rounded-xl border border-cyan-100/10 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/15"
              >
                Ver perfil
              </Link>
            </div>
          </section>

          <section id="favoritos" className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Favoritos</p>
            <div className="mt-3 grid gap-3">
              {favorites.map((item) => (
                <div key={item.name} className="rounded-2xl border border-cyan-100/15 p-3">
                  <div
                    className={`h-16 w-full rounded-xl border border-cyan-100/10 bg-gradient-to-br ${item.imageClass}`}
                  />
                  <p className="mt-2 text-xs text-cyan-100/85">{item.name}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="empresas" className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Empresas destacadas</p>
            <div className="mt-3 space-y-3">
              {clientCompanyProfiles.map((profile) => (
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
              ))}
            </div>
          </section>

          <section id="guardados" className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Guardados</p>
            <div className="mt-3 grid gap-3">
              {savedItems.map((item) => (
                <div key={item.name} className="rounded-2xl border border-cyan-100/15 p-3">
                  <div
                    className={`h-16 w-full rounded-xl border border-cyan-100/10 bg-gradient-to-br ${item.imageClass}`}
                  />
                  <p className="mt-2 text-xs text-cyan-100/85">{item.name}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-4">
          <section id="feed" className="tech-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">COMUNIDAD CLIENTE</p>
                <h1 className="mt-2 text-xl font-semibold text-cyan-50 md:text-2xl">Feed principal</h1>
              </div>
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
            <p className="mt-3 text-sm text-cyan-100/75">
              Seguimiento muestra publicaciones de cuentas que sigues. Marketplace ahora vive en su propia seccion.
            </p>
          </section>

          {topView === "feed" && (
            <>
          <section className="tech-card overflow-hidden">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {stories.map((story) => (
                <button
                  key={story}
                  type="button"
                  className="flex min-w-[95px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-cyan-100/15 bg-slate-950/30 px-3 py-3 text-center text-xs text-cyan-100/85"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/40 bg-gradient-to-br from-cyan-300 to-blue-600 font-bold text-slate-950">
                    {story.slice(0, 2).toUpperCase()}
                  </span>
                  <span>{story}</span>
                </button>
              ))}
            </div>
          </section>

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
                Busqueda normal
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
                Busqueda con IA
              </button>
            </div>

            {searchMode === "normal" && (
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

                {!hasAiSearchRun && !isThinking ? (
                  <p className="text-xs text-cyan-200/75">
                    Escribe tu consulta y presiona &quot;Buscar con IA&quot; para iniciar el analisis.
                  </p>
                ) : null}

                {hasAiSearchRun && aiResults.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-3">
                    {aiResults.map((result) => (
                      <article key={result.title} className="rounded-2xl border border-cyan-100/15 p-4">
                        <div
                          className={`h-24 w-full rounded-xl border border-cyan-100/10 bg-gradient-to-br ${result.imageClass}`}
                        />
                        <p className="mt-3 text-xs text-cyan-200/75">Servicio tecnico</p>
                        <h3 className="mt-2 text-base font-semibold text-cyan-50">{result.title}</h3>
                        <p className="mt-2 text-sm text-cyan-100/80">{result.match}</p>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-xs text-cyan-200/85">Reputacion {result.rating}</span>
                          <Link
                            className="tech-button tech-button-secondary"
                            href={`/cliente/servicios/${result.slug}`}
                          >
                            Ver resenas
                          </Link>
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
                <p className="text-sm text-cyan-100/80">No encontramos publicaciones para esa busqueda.</p>
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
                        Ver publicacion
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
                            placeholder="Comparte tu opinion sobre esta publicacion..."
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

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Cuentas recomendadas</p>
            <p className="mt-2 text-xs text-cyan-100/75">Empresas y especialistas con buena reputacion en la comunidad.</p>
            <div className="mt-4 space-y-3">
              {suggestedAccounts.map((account) => (
                <article key={account.id} className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                      {account.avatar}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">{account.name}</p>
                      <p className="text-xs text-cyan-200/75">{account.role}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-cyan-100/70">
                    {account.city} · {account.followers} seguidores · {account.rating}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/cliente/empresa/${account.slug}`}
                      className="flex-1 rounded-xl border border-cyan-200/20 bg-cyan-400/15 px-3 py-2 text-center text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                    >
                      Ver perfil
                    </Link>
                    <button type="button" className="rounded-xl border border-cyan-200/20 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90">
                      Seguir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Actividad del ecosistema</p>
            <ul className="mt-3 space-y-2 text-xs text-cyan-100/80">
              <li>Nuevas publicaciones de empresas cada dia.</li>
              <li>Mayor interaccion en soporte remoto y diagnostico.</li>
              <li>Embajadores activos recomendando negocios locales.</li>
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
                  Cruzando semantica, reputacion y disponibilidad en tiempo real.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-5 right-4 z-50 w-[340px] max-w-[calc(100vw-1rem)] md:bottom-6 md:right-6">
        <AnimatePresence mode="wait" initial={false}>
          {isChatOpen ? (
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
                  {clientChatThreads.map((chat) => {
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
                    placeholder="Escribe un mensaje..."
                    className="w-full rounded-2xl border border-cyan-100/15 bg-slate-950/45 px-3 py-2 text-xs text-cyan-50 placeholder:text-cyan-100/42 focus:outline-none focus:ring-2 focus:ring-cyan-300/35"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ y: -1, boxShadow: "0 10px 20px rgba(6,182,212,0.22)" }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-2xl border border-cyan-200/25 bg-cyan-400/20 px-3 py-2 text-xs font-semibold text-cyan-50"
                  >
                    Enviar
                  </motion.button>
                </div>
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
                  Chat activo · {activeChat.company}
                </span>
                <span className="rounded-full border border-cyan-100/25 bg-white/10 px-2 py-0.5 text-[10px]">
                  {clientChatThreads.length} chats
                </span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
