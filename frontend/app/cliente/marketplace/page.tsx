"use client";


import Link from "next/link";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../components/ClientPageSections";
import {
  PublicationViewerComment,
  PublicationViewerData,
  PublicationViewerModal,
} from "../../components/PublicationViewerModal";
import {
  buildMarketplaceListings,
  createMarketplaceSellerKey,
  MarketplaceCategory,
  marketplaceCategoryOptions,
  marketplaceSeedPosts,
} from "../../lib/marketplaceFeed";

import {
  COMMUNITY_FEED_UPDATED_EVENT,
  CommunityFeedPost,
  readCommunityFeedPosts,
} from "../../lib/communityFeed";

const EMPTY_FEED_SNAPSHOT: CommunityFeedPost[] = [];

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

type SortMode = "recientes" | "precio-bajo" | "precio-alto";

const marketplaceBaseLikesById: Record<string, number> = {
  "market-seed-1": 18,
  "market-seed-2": 11,
  "market-seed-3": 15,
  "market-seed-4": 9,
  "market-seed-5": 6,
  "market-seed-6": 13,
};

const marketplaceSeedCommentsById: Record<string, PublicationViewerComment[]> = {
  "market-seed-1": [
    {
      id: "market-seed-1-comment-1",
      author: "Luis G.",
      text: "Sigue disponible? Me interesa y podria pasar hoy.",
      time: "Hace 22 min",
    },
    {
      id: "market-seed-1-comment-2",
      author: "Carla M.",
      text: "Buen precio para esa configuracion.",
      time: "Hace 9 min",
    },
  ],
  "market-seed-3": [
    {
      id: "market-seed-3-comment-1",
      author: "Rene P.",
      text: "El monitor incluye caja original?",
      time: "Hace 41 min",
    },
  ],
};

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

const parsePriceToNumber = (priceLabel: string): number => {
  const numeric = priceLabel.replace(/[^\d.,]/g, "").replace(/,/g, "");
  const parsed = Number.parseFloat(numeric);

  if (Number.isNaN(parsed)) {
    return Number.POSITIVE_INFINITY;
  }

  return parsed;
};

export default function ClienteMarketplacePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>("Todos");
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [sortMode, setSortMode] = useState<SortMode>("recientes");
  const [activePublication, setActivePublication] = useState<PublicationViewerData | null>(null);

  const dynamicFeedPosts = useSyncExternalStore(
    subscribeCommunityFeed,
    readCommunityFeedPosts,
    () => EMPTY_FEED_SNAPSHOT,
  );

  const allListings = useMemo(
    () => buildMarketplaceListings([...marketplaceSeedPosts, ...dynamicFeedPosts]),
    [dynamicFeedPosts],
  );

  const listingCountBySeller = useMemo(() => {
    return allListings.reduce<Record<string, number>>((accumulator, listing) => {
      accumulator[listing.post.author] = (accumulator[listing.post.author] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [allListings]);

  const cityOptions = useMemo(() => {
    const cities = new Set(allListings.map((listing) => listing.post.location));
    return ["Todas", ...cities];
  }, [allListings]);

  const filteredListings = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const baseFiltered = allListings.filter((listing) => {
      const matchesQuery =
        !normalizedSearch ||
        `${listing.post.title} ${listing.post.body} ${listing.post.author} ${listing.post.location}`
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory = selectedCategory === "Todos" || listing.category === selectedCategory;
      const matchesCity = selectedCity === "Todas" || listing.post.location === selectedCity;

      return matchesQuery && matchesCategory && matchesCity;
    });

    return [...baseFiltered].sort((a, b) => {
      if (sortMode === "precio-bajo") {
        return parsePriceToNumber(a.priceLabel) - parsePriceToNumber(b.priceLabel);
      }

      if (sortMode === "precio-alto") {
        return parsePriceToNumber(b.priceLabel) - parsePriceToNumber(a.priceLabel);
      }

      return Date.parse(b.post.createdAt) - Date.parse(a.post.createdAt);
    });
  }, [allListings, searchQuery, selectedCategory, selectedCity, sortMode]);

  const highlightedListings = filteredListings.slice(0, 3);

  const handleOpenListing = (listing: (typeof filteredListings)[number]) => {
    const normalizedText = `${listing.post.tag} ${listing.post.title} ${listing.post.body}`.toLowerCase();
    const saleKind =
      normalizedText.includes("servicio") ||
      normalizedText.includes("mantenimiento") ||
      normalizedText.includes("diagnostico")
        ? "servicio"
        : "producto";

    setActivePublication({
      id: listing.post.id,
      title: listing.post.title,
      body: listing.post.body,
      author: listing.post.author,
      role: listing.post.role,
      location: listing.post.location,
      createdAt: listing.post.time,
      tag: listing.post.tag,
      image: listing.post.image,
      variant: "sale",
      saleKind,
      priceLabel: listing.priceLabel,
      conditionLabel: listing.condition,
      categoryLabel: listing.category,
      initialLikeCount: marketplaceBaseLikesById[listing.post.id] ?? 0,
      initiallyLiked: false,
      initialComments: marketplaceSeedCommentsById[listing.post.id] ?? [],
    });
  };

  const redirectToSellerChat = (sellerName: string, productTitle: string) => {
    const message = `Hola, vi tu anuncio \"${productTitle}\". Sigue disponible?`;
    const params = new URLSearchParams({
      source: "marketplace",
      seller: sellerName,
      company: sellerName,
      product: productTitle,
      message,
    });

    setActivePublication(null);
    router.push(`/cliente/chat?${params.toString()}`);
  };

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Marketplace" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
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
              {clientMenuItems.map((item) => {
                const isActive =
                  item.href === "/cliente"
                    ? pathname === "/cliente"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`auth-action ${isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="tech-card mt-4">
            <p className="tech-mono text-xs text-cyan-200/75">MARKETPLACE</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Exploracion comercial</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Descubre productos, ofertas y servicios publicados por empresas y tecnicos en TechMarket.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Marketplace", "Ofertas", "Productos", "Servicios"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs text-cyan-100/85"
                >
                  {chip}
                </span>
              ))}
            </div>
          </section>
          <div className="space-y-4">
            <section className="tech-card">
              <p className="text-sm font-semibold text-cyan-50">Filtros rapidos</p>

              <div className="mt-3 space-y-3">
                <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-search">
                  Buscar en marketplace
                </label>
                <input
                  id="marketplace-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Ej: laptop, monitor, teclado"
                  className="auth-input"
                />

                <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-category">
                  Categoria
                </label>
                <select
                  id="marketplace-category"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as MarketplaceCategory)}
                  className="auth-select"
                >
                  {marketplaceCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-city">
                  Ciudad
                </label>
                <select
                  id="marketplace-city"
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                  className="auth-select"
                >
                  {cityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-sort">
                  Ordenar por
                </label>
                <select
                  id="marketplace-sort"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="auth-select"
                >
                  <option value="recientes">Recientes</option>
                  <option value="precio-bajo">Precio: menor a mayor</option>
                  <option value="precio-alto">Precio: mayor a menor</option>
                </select>
              </div>
            </section>

            <ClientQuickLinksCard
              links={[
                { href: "/cliente", label: "Volver al feed" },
                { href: "/cliente/empresas", label: "Explorar empresas" },
                { href: "/cliente/comunidades", label: "Ir a comunidades" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(130deg,rgba(7,29,50,0.96),rgba(8,58,87,0.9),rgba(6,23,43,0.95))] p-5 shadow-xl shadow-slate-950/30 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/80">EXPLORAR MARKETPLACE</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50 md:text-3xl">Anuncios activos de productos en venta</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/85">
              Estilo marketplace: cards visuales, multiples publicaciones por vendedor, filtros rapidos y resultados ordenados para decidir mas rapido.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Anuncios</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{filteredListings.length}</p>
              </div>
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Vendedores</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{Object.keys(listingCountBySeller).length}</p>
              </div>
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Destacados</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{highlightedListings.length}</p>
              </div>
            </div>
          </section>

          {filteredListings.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No encontramos anuncios para esos filtros. Prueba con otra categoria o ciudad.
              </p>
            </section>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredListings.map((listing) => {
                const sellerPosts = listingCountBySeller[listing.post.author] ?? 1;
                const sellerProfileHref = `/cliente/marketplace/vendedor/${createMarketplaceSellerKey(listing.post.author)}?seller=${encodeURIComponent(listing.post.author)}`;

                return (
                  <motion.article
                    key={listing.post.id}
                    whileHover={{ y: -3, boxShadow: "0 18px 36px rgba(8,145,178,0.22)" }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(160deg,rgba(14,39,69,0.95),rgba(7,24,44,0.97))] shadow-xl shadow-slate-950/25"
                  >
                    {listing.post.image ? (
                      <img
                        src={listing.post.image}
                        alt={listing.post.title}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-44 w-full bg-[linear-gradient(140deg,rgba(34,211,238,0.25),rgba(30,64,175,0.24),rgba(8,47,73,0.6))]" />
                    )}

                    <div className="p-4">
                      <p className="text-2xl font-bold text-cyan-50">{listing.priceLabel}</p>
                      <h2 className="mt-2 line-clamp-2 text-base font-semibold text-white">{listing.post.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-cyan-100/80">{listing.post.body}</p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-cyan-50">
                          {listing.category}
                        </span>
                        <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-cyan-100/85">
                          {listing.condition}
                        </span>
                      </div>

                      <Link
                        href={sellerProfileHref}
                        className="mt-4 block rounded-2xl border border-cyan-100/15 bg-[linear-gradient(140deg,rgba(18,57,90,0.55),rgba(9,27,48,0.8))] p-3 transition hover:border-cyan-300/40 hover:shadow-[0_14px_26px_rgba(8,145,178,0.24)]"
                      >
                        <p className="tech-mono text-[10px] tracking-[0.18em] text-cyan-200/70">VENDEDOR</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-200/35 bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                            {listing.post.author
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((token) => token[0]?.toUpperCase() ?? "")
                              .join("")}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-cyan-50">{listing.post.author}</p>
                            <p className="truncate text-xs text-cyan-200/75">{listing.post.role}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-cyan-100/80">
                          <p className="truncate">{listing.post.location}</p>
                          <span className="rounded-full border border-cyan-100/15 bg-white/5 px-2.5 py-1 text-[11px] text-cyan-100/90">
                            {sellerPosts} anuncios
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] font-semibold text-cyan-200/80">Ver perfil del vendedor</p>
                      </Link>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenListing(listing)}
                          className="rounded-xl border border-cyan-200/25 bg-cyan-400/18 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/24"
                        >
                          Ver anuncio
                        </button>
                        <button
                          type="button"
                          onClick={() => redirectToSellerChat(listing.post.author, listing.post.title)}
                          className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
                        >
                          Contactar
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </section>
          )}
        </section>
      </main>

      <PublicationViewerModal
        publication={activePublication}
        onClose={() => setActivePublication(null)}
        secondaryActionLabel="Contactar vendedor"
        onSecondaryAction={() => {
          if (!activePublication) {
            return;
          }

          redirectToSellerChat(activePublication.author, activePublication.title);
        }}
      />
    </div>
  );
}
