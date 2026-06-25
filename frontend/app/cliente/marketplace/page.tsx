"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getMarketplaceProduct,
  listMarketplaceCategories,
  listMarketplaceProducts,
  type MarketplaceProductDetail,
  type MarketplaceProductSummary,
} from "@/lib/api/iaApi";
import {
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../components/ClientPageSections";
import ClientSidebar from "../ClientSidebar";
import {
  PublicationViewerData,
  PublicationViewerModal,
} from "../../components/PublicationViewerModal";
import {
  searchMarketplaceSemantic,
  type MarketplaceHit,
} from "@/lib/api/marketplaceSearch";
type MarketplaceListing = {
  post: {
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
    companyId?: string;
  };
  category: string;
  condition: string;
  priceLabel: string;
};

type SortMode = "recientes" | "precio-bajo" | "precio-alto";
type CategoryFilter = string;

const MARKETPLACE_CHAT_MAP_KEY = "techmarket.client.marketplace.chatByProduct";

const readMarketplaceChatMap = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(MARKETPLACE_CHAT_MAP_KEY);
    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === "object" && !Array.isArray(parsedValue)
      ? (parsedValue as Record<string, string>)
      : {};
  } catch {
    return {};
  }
};

const createMarketplaceSellerKey = (sellerName: string): string =>
  sellerName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "empresa";

const parsePriceToNumber = (priceLabel: string): number => {
  const numeric = priceLabel.replace(/[^\d.,]/g, "").replace(/,/g, "");
  const parsed = Number.parseFloat(numeric);

  if (Number.isNaN(parsed)) {
    return Number.POSITIVE_INFINITY;
  }

  return parsed;
};

const formatCurrency = (value: number | null): string => {
  if (value === null || value === undefined) {
    return "Precio por inbox";
  }

  return `Bs ${value.toLocaleString("es-BO", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

const productToListing = (
  product: MarketplaceProductSummary,
  detail?: MarketplaceProductDetail,
): MarketplaceListing => ({
  post: {
    id: product.id,
    author: detail?.empresa?.nombre ?? product.id,
    role: "Empresa",
    time: "Disponible",
    title: product.nombre,
    body:
      detail?.descripcion ??
      `Producto publicado en TechMarket${product.calificacion ? ` con calificacion ${product.calificacion}/5` : ""}.`,
    tag: "Producto",
    location: "Bolivia",
    image: product.imagenPrincipal ?? undefined,
    createdAt: new Date().toISOString(),
    companyId: detail?.empresa?.id,
  },
  category: "Otros",
  condition: "Sin dato",
  priceLabel: formatCurrency(product.precio),
});

export default function ClienteMarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("Todos");
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [sortMode, setSortMode] = useState<SortMode>("recientes");
  const [activePublication, setActivePublication] = useState<PublicationViewerData | null>(null);
  const [apiListings, setApiListings] = useState<MarketplaceListing[]>([]);
  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [chatByProductId, setChatByProductId] = useState<Record<string, string>>({});
  const [aiQuery, setAiQuery] = useState("");
  const [aiHits, setAiHits] = useState<MarketplaceHit[] | null>(null);
  const [aiListings, setAiListings] = useState<MarketplaceListing[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function runSemanticSearch() {
    const query = aiQuery.trim();
    if (!query) return;

    setAiLoading(true);
    setAiError(null);
    setAiHits(null);
    setAiListings(null);

    try {
      // Búsqueda REAL en el backend del marketplace: empareja título + descripción y amplía con
      // sinónimos tech (notebook -> laptop, etc.) sobre TODO el catálogo. Sin RAG.
      const page = await listMarketplaceProducts({ search: query });
      setAiListings(page.productos.map((product) => productToListing(product)));
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "No se pudo buscar en el marketplace.");
    }

    try {
      // Bonus: si el stack RAG (TechMarket-AI + embeddings) está disponible, agregamos
      // empresas/especialistas por significado. Si no responde, nos quedamos con los productos.
      const hits = await searchMarketplaceSemantic(query);
      if (hits.length > 0) {
        setAiHits(hits);
      }
    } catch {
      // Sin búsqueda semántica disponible: los productos del marketplace ya estan mostrados.
    } finally {
      setAiLoading(false);
    }
  }

  const allListings = useMemo(() => apiListings, [apiListings]);

  useEffect(() => {
    const refreshChatMap = () => setChatByProductId(readMarketplaceChatMap());

    refreshChatMap();
    window.addEventListener("focus", refreshChatMap);
    window.addEventListener("storage", refreshChatMap);

    return () => {
      window.removeEventListener("focus", refreshChatMap);
      window.removeEventListener("storage", refreshChatMap);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadMarketplace = async () => {
      setIsLoadingApi(true);
      setApiError(null);

      try {
        const [productPage, categories] = await Promise.all([
          listMarketplaceProducts({ pagina: 1 }),
          listMarketplaceCategories(),
        ]);

        if (!active) {
          return;
        }

        const productDetails = await Promise.all(
          productPage.productos.map((product) =>
            getMarketplaceProduct(product.id).catch(() => null),
          ),
        );

        setApiListings(
          productPage.productos.map((product, index) =>
            productToListing(product, productDetails[index] ?? undefined),
          ),
        );
        setApiCategories(categories.flatMap((category) => [
          category.nombre,
          ...category.subcategorias.map((subcategory) => subcategory.nombre),
        ]));
      } catch (error) {
        if (!active) {
          return;
        }

        setApiListings([]);
        setApiCategories([]);
        setApiError(error instanceof Error ? error.message : "No se pudo cargar marketplace");
      } finally {
        if (active) {
          setIsLoadingApi(false);
        }
      }
    };

    loadMarketplace();

    return () => {
      active = false;
    };
  }, []);

  const categoryOptions = useMemo(
    () => ["Todos", ...new Set(apiCategories)],
    [apiCategories],
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

      const matchesCategory =
        selectedCategory === "Todos" ||
        listing.category === selectedCategory ||
        listing.post.tag === selectedCategory;
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
  const activePublicationListing = useMemo(
    () =>
      activePublication
        ? allListings.find((item) => item.post.id === activePublication.id) ?? null
        : null,
    [activePublication, allListings],
  );

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
      initialLikeCount: 0,
      initiallyLiked: false,
      initialComments: [],
    });
  };

  const redirectToSellerChat = (listing: MarketplaceListing) => {
    const existingChatId = chatByProductId[listing.post.id];
    if (existingChatId) {
      setActivePublication(null);
      router.push(`/cliente/chat?chatId=${encodeURIComponent(existingChatId)}`);
      return;
    }

    const sellerName = listing.post.author;
    const productTitle = listing.post.title;
    const message = `Hola, vi tu anuncio \"${productTitle}\". Sigue disponible?`;

    if (!listing.post.companyId) {
      setActivePublication(null);
      setApiError(
        "No se pudo abrir el chat porque esta publicación no trae una empresa asociada desde la API.",
      );
      return;
    }

    const params = new URLSearchParams({
      source: "marketplace",
      seller: sellerName,
      company: sellerName,
      companyId: listing.post.companyId,
      productId: listing.post.id,
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
          <ClientSidebar />
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

                <div className="rounded-2xl border border-cyan-100/15 bg-cyan-500/5 p-3">
                  <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-ai-search">
                    Búsqueda inteligente (IA)
                  </label>
                  <input
                    id="marketplace-ai-search"
                    value={aiQuery}
                    onChange={(event) => setAiQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") runSemanticSearch();
                    }}
                    placeholder="Ej: laptop para diseño, teclado mecánico, reparación de redes"
                    className="auth-input"
                  />
                  <button
                    type="button"
                    onClick={runSemanticSearch}
                    disabled={aiLoading || !aiQuery.trim()}
                    className="mt-2 w-full rounded-xl bg-cyan-500/80 px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
                  >
                    {aiLoading ? "Buscando por significado..." : "Buscar con IA"}
                  </button>
                  {aiError && <p className="mt-2 text-xs text-rose-300">{aiError}</p>}

                  {aiListings && (
                    <div className="mt-3 space-y-2">
                      {aiListings.length === 0 ? (
                        <p className="text-xs text-cyan-100/70">
                          No se encontraron productos en el marketplace para esa búsqueda.
                        </p>
                      ) : (
                        <>
                          <p className="text-[11px] text-cyan-200/60">Productos del marketplace:</p>
                          {aiListings.map((listing) => (
                            <button
                              key={listing.post.id}
                              type="button"
                              onClick={() => handleOpenListing(listing)}
                              className="flex w-full items-center gap-2 rounded-xl border border-cyan-100/10 bg-slate-950/40 px-3 py-2 text-left transition hover:bg-slate-950/60"
                            >
                              <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-800/60">
                                {listing.post.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={listing.post.image}
                                    alt={listing.post.title}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                ) : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold text-cyan-50">
                                  {listing.post.title}
                                </span>
                                <span className="block text-[11px] text-cyan-200/70">
                                  {listing.priceLabel}
                                </span>
                              </span>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {aiHits && aiHits.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-cyan-100/10 pt-3">
                      <p className="text-[11px] text-cyan-200/60">Empresas y especialistas relacionados:</p>
                      {aiHits.map((hit) => (
                        <div
                          key={hit.id}
                          className="rounded-xl border border-cyan-100/10 bg-slate-950/40 px-3 py-2"
                        >
                          <p className="text-xs font-semibold text-cyan-50">{hit.title}</p>
                          <p className="text-[11px] text-cyan-200/70">
                            {hit.type === "empresa" ? "Empresa" : "Especialista"}
                            {hit.ownerName ? ` · ${hit.ownerName}` : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-category">
                  Categoría
                </label>
                <select
                  id="marketplace-category"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="auth-select"
                >
                  {categoryOptions.map((option) => (
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
              Estilo marketplace: cards visuales, multiples publicaciones por vendedor, filtros rapidos y resultados ordenados para decidir más rápido.
            </p>
            {isLoadingApi ? (
              <p className="mt-3 text-xs text-cyan-200/75">Cargando productos desde la API...</p>
            ) : null}
            {apiError ? (
              <p className="mt-3 text-xs text-amber-200/85">
                No se pudo conectar con la API: {apiError}
              </p>
            ) : null}

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
                No hay productos para mostrar desde la API.
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
                          onClick={() => redirectToSellerChat(listing)}
                          className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
                        >
                          {chatByProductId[listing.post.id] ? "Ver mensaje" : "Contactar"}
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
        secondaryActionLabel={
          activePublicationListing && chatByProductId[activePublicationListing.post.id]
            ? "Ver mensaje"
            : "Contactar vendedor"
        }
        onSecondaryAction={() => {
          if (!activePublicationListing) {
            return;
          }

          redirectToSellerChat(activePublicationListing);
        }}
      />
    </div>
  );
}
