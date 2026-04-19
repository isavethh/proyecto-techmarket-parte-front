"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import {
  COMMUNITY_FEED_UPDATED_EVENT,
  CommunityFeedPost,
  mergeCommunityFeedPosts,
  readCommunityFeedPosts,
} from "../lib/communityFeed";
import { clientCompanyProfiles } from "../lib/clientCompanyProfiles";
import { ClientTopbarControls } from "../components/ClientExperienceShell";

type SearchMode = "normal" | "ia";
type TopView = "feed" | "marketplace" | "seguimiento";

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

const isMarketplaceSaleItem = (item: CommunityFeedPost): boolean => {
  const normalizedTag = item.tag.toLowerCase();
  const normalizedText = `${item.title} ${item.body}`.toLowerCase();

  if (normalizedTag.includes("interaccion") || normalizedTag.includes("publicacion")) {
    return false;
  }

  return (
    normalizedTag.includes("producto") ||
    normalizedTag.includes("servicio") ||
    normalizedTag.includes("oferta") ||
    normalizedTag.includes("promoc") ||
    normalizedTag.includes("venta") ||
    normalizedText.includes("servicio") ||
    normalizedText.includes("producto") ||
    normalizedText.includes("descuento") ||
    normalizedText.includes("precio") ||
    normalizedText.includes("stock") ||
    normalizedText.includes("combo") ||
    normalizedText.includes("pack")
  );
};

export default function ClientePage() {
  const [topView, setTopView] = useState<TopView>("feed");
  const [searchMode, setSearchMode] = useState<SearchMode>("normal");
  const [query, setQuery] = useState<string>("");
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [aiResults, setAiResults] = useState<typeof aiSuggestions>([]);
  const companyFeedPosts = useSyncExternalStore(
    subscribeCommunityFeed,
    readCommunityFeedPosts,
    () => emptyFeedSnapshot,
  );
  const [activeChatId, setActiveChatId] = useState(clientChatThreads[0].id);
  const [draftMessage, setDraftMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);

  const activeChat =
    clientChatThreads.find((chat) => chat.id === activeChatId) ?? clientChatThreads[0];

  const aiSummary = useMemo(() => {
    if (!aiResults.length) return "";
    return `Entendi tu necesidad: ${aiQuery.trim() || "consulta tecnica"}.`;
  }, [aiQuery, aiResults.length]);

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

  const marketplaceItems = useMemo(
    () => fullFeed.filter((item) => isMarketplaceSaleItem(item)),
    [fullFeed],
  );

  const filteredMarketplaceItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return marketplaceItems;
    }

    return marketplaceItems.filter((item) => {
      const bucket = `${item.author} ${item.title} ${item.body} ${item.tag} ${item.location}`.toLowerCase();
      return bucket.includes(cleanQuery);
    });
  }, [marketplaceItems, query]);

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

  const handleAiSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsThinking(true);
    setAiResults([]);

    setTimeout(() => {
      setAiResults(aiSuggestions);
      setIsThinking(false);
    }, 1400);
  };

  const handleNormalSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex-1 pb-10">
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <div className="hidden flex-1 max-w-xl md:block">
            <form onSubmit={handleNormalSearch}>
              <input
                className="auth-input"
                placeholder="Buscar en TechMarket..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>
          </div>
          <ClientTopbarControls sectionLabel="Cliente activo" />
        </div>
      </header>

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
                <h1 className="mt-2 text-xl font-semibold text-cyan-50 md:text-2xl">Feed y Marketplace</h1>
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
                  className={topView === "marketplace" ? "active" : ""}
                  onClick={() => setTopView("marketplace")}
                >
                  Marketplace
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
              Marketplace muestra ventas y Seguimiento muestra publicaciones de cuentas que sigues.
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
                onClick={() => setSearchMode("normal")}
              >
                Busqueda normal
              </button>
              <button
                type="button"
                className={`tech-button ${
                  searchMode === "ia" ? "tech-button-primary" : "tech-button-secondary"
                }`}
                onClick={() => setSearchMode("ia")}
              >
                Busqueda con IA
              </button>
            </div>

            {searchMode === "normal" && (
              <form className="mt-4 space-y-3" onSubmit={handleNormalSearch}>
                <input
                  className="auth-input"
                  placeholder="Busca productos, tiendas o servicios..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button type="submit" className="tech-button tech-button-primary">
                  Buscar en el feed
                </button>
              </form>
            )}

            {searchMode === "ia" && (
              <form className="mt-4 space-y-4" onSubmit={handleAiSearch}>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    className="auth-input"
                    placeholder="Ej: mi laptop funciona mal y se recalienta"
                    value={aiQuery}
                    onChange={(event) => setAiQuery(event.target.value)}
                  />
                  <button type="submit" className="tech-button tech-button-primary">
                    Buscar con IA
                  </button>
                </div>

                {aiSummary && <p className="text-sm text-cyan-100/80">{aiSummary}</p>}

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
              </form>
            )}
          </section>

          <section className="space-y-4">
            {filteredFeed.length === 0 && (
              <div className="tech-card">
                <p className="text-sm text-cyan-100/80">No encontramos publicaciones para esa busqueda.</p>
              </div>
            )}

            {filteredFeed.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(16,41,72,0.92),rgba(7,24,44,0.96))] p-4 shadow-xl shadow-slate-950/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                      {item.author.slice(0, 2).toUpperCase()}
                    </div>
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

                <h2 className="mt-4 text-lg font-semibold text-cyan-50">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-cyan-100/85">{item.body}</p>

                {item.image ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100/10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-64 w-full object-cover md:h-80"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="mt-4 border-t border-cyan-100/10 pt-3 text-xs text-cyan-200/75">
                  {item.time || formatPublishedAt(item.createdAt)}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <button type="button" className="rounded-xl border border-cyan-100/10 bg-cyan-300/10 px-3 py-2 text-cyan-100/90">
                    Me gusta
                  </button>
                  <button type="button" className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-cyan-100/90">
                    Comentar
                  </button>
                  <button type="button" className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-cyan-100/90">
                    Compartir
                  </button>
                </div>

                {feedCommentsByPostId[item.id] && feedCommentsByPostId[item.id].length > 0 ? (
                  <div className="mt-4 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                    <p className="text-xs font-semibold text-cyan-200/80">Comentarios</p>
                    {feedCommentsByPostId[item.id].map((comment) => (
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
            </>
          )}

          {topView === "marketplace" && (
            <section id="marketplace" className="space-y-4">
              <section className="tech-card">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="tech-mono text-xs text-cyan-200/75">MARKETPLACE</p>
                    <h2 className="mt-2 text-xl font-semibold text-cyan-50 md:text-2xl">Solo ventas de empresas</h2>
                  </div>
                  <p className="text-xs text-cyan-100/70">
                    {filteredMarketplaceItems.length} resultados de venta activos
                  </p>
                </div>
              </section>

              {filteredMarketplaceItems.length === 0 && (
                <section className="tech-card">
                  <p className="text-sm text-cyan-100/80">
                    No hay ventas que coincidan con tu busqueda. Prueba con otro termino.
                  </p>
                </section>
              )}

              {filteredMarketplaceItems.length > 0 && (
                <section className="grid gap-4 md:grid-cols-2">
                  {filteredMarketplaceItems.map((item) => (
                    <article
                      key={`market-${item.id}`}
                      className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-48 w-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-cyan-50">{item.author}</p>
                          <span className="rounded-full border border-cyan-100/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/90">
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 text-sm text-cyan-100/80">{item.body}</p>
                        <p className="mt-3 text-xs text-cyan-200/75">
                          {item.location} · {formatPublishedAt(item.createdAt)}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="rounded-xl border border-cyan-100/10 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-50"
                          >
                            Ver detalle
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm font-semibold text-cyan-100/90"
                          >
                            Contactar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>
              )}
            </section>
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

      {isThinking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur">
          <div className="rounded-3xl border border-cyan-100/20 bg-background-soft/90 px-8 py-6 text-center">
            <p className="tech-mono text-xs text-cyan-200/80">IA ANALIZANDO</p>
            <p className="mt-3 text-lg font-semibold text-cyan-50">Busqueda semantica en progreso...</p>
            <p className="mt-2 text-sm text-cyan-100/80">Estamos buscando servicios tecnicos.</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 w-[320px]">
        {isChatOpen ? (
          <div className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between border-b border-cyan-100/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                  {activeChat.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{activeChat.company}</p>
                  <p className="text-xs text-cyan-100/70">{activeChat.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-[10px] font-semibold text-cyan-100/80"
              >
                Cerrar
              </button>
            </div>

            <div className="border-b border-cyan-100/10 px-3 py-2">
              <div className="chat-scrollbar chat-scrollbar-x flex gap-2 overflow-x-auto">
                {clientChatThreads.map((chat) => {
                  const isActive = chat.id === activeChatId;

                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => setActiveChatId(chat.id)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        isActive
                          ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-50"
                          : "border-cyan-100/15 bg-white/5 text-cyan-100/80"
                      }`}
                    >
                      {chat.company}
                      {chat.unread ? ` · ${chat.unread}` : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="chat-scrollbar max-h-[280px] space-y-3 overflow-y-auto px-4 py-3">
              {activeChat.messages.map((message) => (
                <div
                  key={`${activeChat.id}-${message.id}`}
                  className={`flex ${message.author === "cliente" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-5 ${
                      message.author === "cliente"
                        ? "bg-cyan-300/15 text-cyan-50"
                        : "bg-white/5 text-cyan-100/90"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="mt-2 text-right text-[10px] text-cyan-100/55">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-cyan-100/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-3 py-2 text-xs text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
                <button
                  type="button"
                  className="rounded-2xl border border-cyan-100/10 bg-cyan-400/15 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="w-full rounded-full border border-cyan-100/15 bg-[linear-gradient(135deg,_rgba(14,116,144,0.9),_rgba(8,47,73,0.96))] px-4 py-3 text-xs font-semibold text-cyan-50 shadow-lg shadow-slate-950/40"
          >
            Chat activo · {activeChat.company}
          </button>
        )}
      </div>
    </div>
  );
}
