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
<<<<<<< ours
=======
import {
  COMMUNITY_FEED_UPDATED_EVENT,
  CommunityFeedPost,
  readCommunityFeedPosts,
} from "../../lib/communityFeed";
>>>>>>> theirs
import {
  buildMarketplaceListings,
  createMarketplaceSellerKey,
  MarketplaceCategory,
  marketplaceCategoryOptions,
  marketplaceSeedPosts,
} from "../../lib/marketplaceFeed";

<<<<<<< ours
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
=======
const EMPTY_FEED_SNAPSHOT: CommunityFeedPost[] = [];
>>>>>>> theirs

type SortMode = "recientes" | "precio-bajo" | "precio-alto";

function formatPrice(price: number): string {
  return `Bs. ${price.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((t) => t[0]?.toUpperCase() ?? "")
      .join("") || "PR"
  );
}

function ProductCard({
  product,
  onAddToCart,
  onFavorite,
}: {
  product: ApiProduct;
  onAddToCart: (id: string) => void;
  onFavorite: (id: string) => void;
}) {
  return (
    <motion.article
      whileHover={{ y: -3, boxShadow: "0 18px 36px rgba(8,145,178,0.22)" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(160deg,rgba(14,39,69,0.95),rgba(7,24,44,0.97))] shadow-xl shadow-slate-950/25"
    >
      {product.imagenPrincipal ? (
        <img
          src={product.imagenPrincipal}
          alt={product.nombre}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-[linear-gradient(140deg,rgba(34,211,238,0.25),rgba(30,64,175,0.24),rgba(8,47,73,0.6))]">
          <span className="text-4xl font-bold text-cyan-300/40">
            {getInitials(product.nombre)}
          </span>
        </div>
      )}

      <div className="p-4">
        <p className="text-2xl font-bold text-cyan-50">
          {formatPrice(product.precio)}
        </p>
        <h2 className="mt-2 line-clamp-2 text-base font-semibold text-white">
          {product.nombre}
        </h2>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(product.calificacion)
                    ? "text-amber-400"
                    : "text-cyan-100/25"
                }
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-cyan-100/70">{product.calificacion.toFixed(1)}</span>
        </div>

        <p className="mt-2 font-mono text-[11px] text-cyan-200/55">{product.id}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            className="rounded-xl border border-cyan-200/25 bg-cyan-400/18 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/24"
          >
            Agregar al carrito
          </button>
          <button
            type="button"
            onClick={() => onFavorite(product.id)}
            className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
          >
            Favorito
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function ClienteMarketplacePage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("recientes");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setApiError(false);

      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      if (!productsRes) {
        setApiError(true);
      } else {
        setProducts(productsRes.productos);
        setTotal(productsRes.total);
      }

      if (categoriesRes) {
        setCategories(categoriesRes);
      }

      setLoading(false);
    }

    load();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      const res = await getProducts();
      if (res) {
        setProducts(res.productos);
        setTotal(res.total);
      }
      return;
    }

    const res = await getProducts({ search: searchQuery.trim() });
    if (res) {
      setProducts(res.productos);
      setTotal(res.total);
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
    } else {
      const res = await getProducts({ category: categoryId });
      if (res) {
        setProducts(res.productos);
        setTotal(res.total);
      }
    }
  };

  const handleAddToCart = async (productId: string) => {
    const result = await addToCart(productId, 1);
    showToast(
      result
        ? "Producto agregado al carrito"
        : "No se pudo agregar al carrito (API no disponible)",
    );
  };

  const handleFavorite = async (productId: string) => {
    await addFavoriteProduct(productId);
    showToast("Solicitud de favorito enviada a la API");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sortMode === "precio-bajo") {
      copy.sort((a, b) => a.precio - b.precio);
    } else if (sortMode === "precio-alto") {
      copy.sort((a, b) => b.precio - a.precio);
    }
    return copy;
  }, [products, sortMode]);

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
            <p className="tech-mono text-xs text-cyan-200/80">
              GET /api/marketplace/products
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50 md:text-3xl">
              Catalogo de productos
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/85">
              Productos obtenidos en tiempo real desde la API de TechMarket. Usa los filtros
              para buscar por nombre o categoria.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">
                  Total API
                </p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{total}</p>
              </div>
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">
                  Mostrando
                </p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">
                  {sortedProducts.length}
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">
                  Categorias
                </p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">
                  {categories.length || "—"}
                </p>
              </div>
            </div>
          </section>

          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando productos desde la API...</p>
            </section>
          ) : apiError ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con la API en{" "}
                <span className="font-mono text-cyan-200">localhost:8082</span>. Verifica
                que el servidor este corriendo.
              </p>
              <p className="mt-2 font-mono text-xs text-cyan-200/60">
                GET /api/marketplace/products
              </p>
            </section>
          ) : sortedProducts.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se encontraron productos para esos filtros.
              </p>
            </section>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onFavorite={handleFavorite}
                />
              ))}
            </section>
          )}
        </section>
      </main>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-cyan-100/20 bg-[linear-gradient(135deg,rgba(8,47,73,0.97),rgba(4,16,30,0.98))] px-5 py-3 text-sm text-cyan-50 shadow-2xl shadow-slate-950/50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
