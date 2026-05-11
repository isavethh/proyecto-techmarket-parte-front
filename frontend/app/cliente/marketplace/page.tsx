"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../components/ClientPageSections";
import { getProducts, getCategories } from "@/lib/api/marketplace";
import { addToCart, addFavoriteProduct } from "@/lib/api/clientApi";
import type { ApiProduct, ApiCategory } from "@/lib/api/types";

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
        <div className="h-44 w-full bg-[linear-gradient(140deg,rgba(34,211,238,0.25),rgba(30,64,175,0.24),rgba(8,47,73,0.6))]" />
      )}

      <div className="p-4">
        <p className="text-2xl font-bold text-cyan-50">
          Bs. {product.precio.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </p>
        <h2 className="mt-2 line-clamp-2 text-base font-semibold text-white">{product.nombre}</h2>

        <div className="mt-3 flex items-center gap-2 text-xs text-cyan-200/70">
          <span>★ {product.calificacion.toFixed(1)}</span>
          <span className="font-mono text-cyan-200/45">{product.id}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/cliente/marketplace/${product.id}`}
            className="rounded-xl border border-cyan-200/25 bg-cyan-400/18 px-3 py-2 text-center text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/24"
          >
            Ver detalle
          </Link>
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
          >
            Agregar al carrito
          </button>
        </div>

        <button
          type="button"
          onClick={() => onFavorite(product.id)}
          className="mt-2 w-full rounded-xl border border-cyan-100/10 bg-transparent px-3 py-1.5 text-xs text-cyan-200/60 transition hover:text-cyan-200/90"
        >
          + Agregar a favoritos
        </button>
      </div>
    </motion.article>
  );
}

export default function ClienteMarketplacePage() {
  const pathname = usePathname();
  const router = useRouter();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recientes");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const params: { search?: string; category?: string } = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedCategory) params.category = selectedCategory;

    getProducts(params)
      .then((res) => {
        setProducts(res.productos);
        setTotal(res.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sortMode === "precio-bajo") copy.sort((a, b) => a.precio - b.precio);
    if (sortMode === "precio-alto") copy.sort((a, b) => b.precio - a.precio);
    return copy;
  }, [products, sortMode]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      showToast("Producto agregado al carrito");
    } catch {
      showToast("No se pudo agregar al carrito");
    }
  };

  const handleFavorite = async (productId: string) => {
    try {
      await addFavoriteProduct(productId);
      showToast("Agregado a favoritos");
    } catch {
      showToast("No se pudo agregar a favoritos");
    }
  };

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Marketplace" />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-cyan-100/20 bg-slate-900/95 px-5 py-3 text-sm font-semibold text-cyan-50 shadow-xl backdrop-blur">
          {toast}
        </div>
      )}

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
                  <Link key={item.label} href={item.href} className={`auth-action ${isActive ? "active" : ""}`}>
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
              Descubre productos y ofertas publicados por empresas en TechMarket.
            </p>
          </section>

          <div className="space-y-4">
            <section className="tech-card">
              <p className="text-sm font-semibold text-cyan-50">Filtros</p>

              <div className="mt-3 space-y-3">
                <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-search">
                  Buscar
                </label>
                <input
                  id="marketplace-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: laptop, monitor, teclado"
                  className="auth-input"
                />

                <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-category">
                  Categoría
                </label>
                <select
                  id="marketplace-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="auth-select"
                >
                  <option value="">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>

                <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="marketplace-sort">
                  Ordenar por
                </label>
                <select
                  id="marketplace-sort"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
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
                { href: "/cliente/carrito", label: "Mi carrito" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(130deg,rgba(7,29,50,0.96),rgba(8,58,87,0.9),rgba(6,23,43,0.95))] p-5 shadow-xl shadow-slate-950/30 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/80">GET /api/marketplace/products</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50 md:text-3xl">Productos disponibles</h1>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Total</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{total}</p>
              </div>
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Mostrando</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{sortedProducts.length}</p>
              </div>
            </div>
          </section>

          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando productos desde la API...</p>
            </section>
          ) : error ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con{" "}
                <span className="font-mono text-cyan-200">GET /api/marketplace/products</span>.
              </p>
            </section>
          ) : sortedProducts.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">No hay productos para esa búsqueda.</p>
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
    </div>
  );
}
