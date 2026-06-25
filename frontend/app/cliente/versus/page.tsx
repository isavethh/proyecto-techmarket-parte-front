"use client";

import { useEffect, useMemo, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import ClientSidebar from "../ClientSidebar";
import {
  MarketplaceProductSummary,
  VersusVerdict,
  compareProductsVersus,
  listMarketplaceProducts,
} from "../../../lib/api/iaApi";

const MAX_SLOTS = 2;
const SLOT_LABELS = ["A", "B"];

const formatPrice = (value: number | null) =>
  typeof value === "number"
    ? new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(value)
    : "Sin precio";

const formatRating = (value: number | null) =>
  typeof value === "number" && value > 0 ? `${value.toFixed(1)} ★` : "Sin reseñas";

export default function ClienteVersusPage() {
  const [products, setProducts] = useState<MarketplaceProductSummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<VersusVerdict | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listMarketplaceProducts({ pagina: 1 });
        if (!isMounted) return;

        const apiProducts = response.productos ?? [];
        setProducts(apiProducts);
        setSelectedIds(apiProducts.slice(0, MAX_SLOTS).map((product) => product.id));
      } catch (requestError) {
        if (!isMounted) return;
        console.error("No se pudo cargar productos para versus", requestError);
        setProducts([]);
        setSelectedIds([]);
        setError("No se pudo conectar con la API de productos.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const productById = useMemo(() => {
    const map = new Map<string, MarketplaceProductSummary>();
    products.forEach((product) => map.set(product.id, product));
    return map;
  }, [products]);

  const slots = useMemo(
    () =>
      Array.from({ length: MAX_SLOTS }, (_, index) => productById.get(selectedIds[index]) ?? null),
    [productById, selectedIds],
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => product.nombre.toLowerCase().includes(term));
  }, [products, search]);

  const canCompareWithAi = selectedIds.length === MAX_SLOTS;

  const resetVerdict = () => {
    setVerdict(null);
    setCompareError(null);
  };

  const toggleProduct = (id: string) => {
    resetVerdict();
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= MAX_SLOTS) {
        // Slots llenos: cambiamos el retador (slot B) y mantenemos el anclado (A).
        return [current[0], id];
      }
      return [...current, id];
    });
  };

  const clearSlot = (index: number) => {
    resetVerdict();
    setSelectedIds((current) => current.filter((_, position) => position !== index));
  };

  const handleCompareWithAi = async () => {
    if (!canCompareWithAi || isComparing) return;

    setIsComparing(true);
    setCompareError(null);
    setVerdict(null);

    try {
      const result = await compareProductsVersus(selectedIds);
      setVerdict(result);
    } catch (requestError) {
      setCompareError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo comparar las publicaciones con IA.",
      );
    } finally {
      setIsComparing(false);
    }
  };

  const productNameById = (id: string | null) =>
    id ? (productById.get(id)?.nombre ?? null) : null;

  const [productA, productB] = slots;

  const bestPriceId = useMemo(() => {
    if (
      !productA ||
      !productB ||
      typeof productA.precio !== "number" ||
      typeof productB.precio !== "number" ||
      productA.precio === productB.precio
    ) {
      return null;
    }
    return productA.precio < productB.precio ? productA.id : productB.id;
  }, [productA, productB]);

  const bestRatingId = useMemo(() => {
    const ratingA = productA?.calificacion ?? 0;
    const ratingB = productB?.calificacion ?? 0;
    if (!productA || !productB || ratingA === ratingB) return null;
    return ratingA > ratingB ? productA.id : productB.id;
  }, [productA, productB]);

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Versus" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <ClientSidebar />

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/marketplace", label: "Explorar marketplace" },
            ]}
          />
        </aside>

        <section
          id="versus-activo"
          className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          {/* Duelo A vs B */}
          <section className="tech-card space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">Versus</p>
                <h2 className="mt-1 text-2xl font-semibold text-cyan-50">Duelo de publicaciones</h2>
                <p className="mt-1 text-sm text-cyan-100/75">
                  {error ?? "Enfrenta 2 publicaciones y deja que la IA elija el mejor deal."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCompareWithAi}
                disabled={!canCompareWithAi || isComparing}
                className="rounded-2xl border border-cyan-300/55 bg-cyan-300/15 px-5 py-2.5 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isComparing ? "Comparando..." : "Comparar con IA"}
              </button>
            </div>

            <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <ProductSlot
                product={productA}
                label={SLOT_LABELS[0]}
                isWinner={verdict?.ganadorId === productA?.id}
                onClear={() => clearSlot(0)}
              />
              <div className="flex items-center justify-center">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-cyan-300/40 bg-slate-950/60 text-sm font-bold tracking-wide text-cyan-100">
                  VS
                </span>
              </div>
              <ProductSlot
                product={productB}
                label={SLOT_LABELS[1]}
                isWinner={verdict?.ganadorId === productB?.id}
                onClear={() => clearSlot(1)}
              />
            </div>

            {!canCompareWithAi ? (
              <p className="text-xs text-cyan-100/60">
                Elige 2 publicaciones desde el catálogo para activar el veredicto de la IA.
              </p>
            ) : null}

            {/* Quick compare determinista (sin IA) */}
            {productA && productB ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <QuickCompareRow
                  label="Precio"
                  valueA={formatPrice(productA.precio)}
                  valueB={formatPrice(productB.precio)}
                  winsA={bestPriceId === productA.id}
                  winsB={bestPriceId === productB.id}
                />
                <QuickCompareRow
                  label="Calificación"
                  valueA={formatRating(productA.calificacion)}
                  valueB={formatRating(productB.calificacion)}
                  winsA={bestRatingId === productA.id}
                  winsB={bestRatingId === productB.id}
                />
              </div>
            ) : null}
          </section>

          {/* Veredicto IA */}
          {compareError ? (
            <section className="tech-card">
              <p className="rounded-2xl border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {compareError}
              </p>
            </section>
          ) : null}

          {verdict ? (
            <section className="tech-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="tech-mono text-xs text-cyan-200/75">Veredicto IA</p>
                {verdict.ganadorId ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-100">
                    🏆 Mejor deal: {productNameById(verdict.ganadorId) ?? "Producto seleccionado"}
                  </span>
                ) : null}
              </div>

              {verdict.resumen ? (
                <p className="text-base font-semibold text-cyan-50">{verdict.resumen}</p>
              ) : null}

              {verdict.veredicto ? (
                <p className="text-sm text-cyan-100/85">{verdict.veredicto}</p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                {(verdict.productos ?? []).map((evaluation) => {
                  const isWinner = evaluation.id === verdict.ganadorId;
                  const product = productById.get(evaluation.id);
                  return (
                    <article
                      key={`verdict-${evaluation.id}`}
                      className={`overflow-hidden rounded-3xl border ${
                        isWinner
                          ? "border-emerald-300/55 bg-emerald-400/10"
                          : "border-cyan-100/15 bg-slate-950/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 border-b border-white/5 p-4">
                        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-800/70">
                          {product?.imagenPrincipal ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.imagenPrincipal}
                              alt={product.nombre}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </span>
                        <h4 className="min-w-0 flex-1 text-base font-semibold text-white">
                          <span className="block truncate">
                            {evaluation.nombre ?? productNameById(evaluation.id) ?? "Producto"}
                          </span>
                          {isWinner ? (
                            <span className="text-xs font-medium text-emerald-200">Mejor deal</span>
                          ) : null}
                        </h4>
                      </div>

                      <div className="space-y-2 p-4 text-xs text-cyan-100/85">
                        <ScoreBar label="Valor" value={evaluation.scoreValor} highlight={isWinner} />
                        <ScoreBar label="Precio" value={evaluation.scorePrecio} highlight={isWinner} />
                        <ScoreBar label="Calidad" value={evaluation.scoreCalidad} highlight={isWinner} />
                        <ScoreBar
                          label="Reputación"
                          value={evaluation.scoreReputacion}
                          highlight={isWinner}
                        />
                      </div>

                      {evaluation.pros?.length || evaluation.contras?.length ? (
                        <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2">
                          {evaluation.pros?.length ? (
                            <div>
                              <p className="text-xs font-semibold text-emerald-200">A favor</p>
                              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-cyan-100/80">
                                {evaluation.pros.map((item, index) => (
                                  <li key={`pro-${evaluation.id}-${index}`}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}

                          {evaluation.contras?.length ? (
                            <div>
                              <p className="text-xs font-semibold text-rose-200">En contra</p>
                              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-cyan-100/80">
                                {evaluation.contras.map((item, index) => (
                                  <li key={`con-${evaluation.id}-${index}`}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* Catálogo integrado */}
          <section className="tech-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">Catálogo</p>
                <h3 className="mt-1 text-lg font-semibold text-cyan-50">Elige las publicaciones a enfrentar</h3>
              </div>
              <span className="rounded-full border border-cyan-100/15 bg-slate-950/40 px-3 py-1 text-xs font-semibold text-cyan-100/80">
                {selectedIds.length}/{MAX_SLOTS} seleccionadas
              </span>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar producto por nombre..."
              className="w-full rounded-2xl border border-cyan-100/15 bg-slate-950/40 px-4 py-2.5 text-sm text-cyan-50 placeholder:text-cyan-200/40 focus:border-cyan-300/55 focus:outline-none"
            />

            {filteredProducts.length ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const slotIndex = selectedIds.indexOf(product.id);
                  const isSelected = slotIndex !== -1;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      aria-pressed={isSelected}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition ${
                        isSelected
                          ? "border-cyan-300/55 bg-cyan-300/12 ring-1 ring-cyan-300/40"
                          : "border-cyan-100/15 bg-slate-950/25 hover:border-cyan-100/30 hover:bg-slate-950/40"
                      }`}
                    >
                      {isSelected ? (
                        <span className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-cyan-300/85 text-xs font-bold text-slate-950">
                          {SLOT_LABELS[slotIndex]}
                        </span>
                      ) : null}

                      <span className="h-28 w-full bg-slate-800/50">
                        {product.imagenPrincipal ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imagenPrincipal}
                            alt={product.nombre}
                            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : null}
                      </span>

                      <span className="flex flex-1 flex-col p-3">
                        <span className="line-clamp-2 text-sm font-semibold text-cyan-50">
                          {product.nombre}
                        </span>
                        <span className="mt-2 flex items-center justify-between text-xs">
                          <span className="font-semibold text-cyan-100">
                            {formatPrice(product.precio)}
                          </span>
                          <span className="text-amber-200/80">
                            {formatRating(product.calificacion)}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-cyan-100/75">
                {isLoading
                  ? "Cargando productos..."
                  : products.length
                    ? "Ningún producto coincide con tu búsqueda."
                    : "No hay productos para comparar desde la API."}
              </p>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

function ProductSlot({
  product,
  label,
  isWinner,
  onClear,
}: {
  product: MarketplaceProductSummary | null;
  label: string;
  isWinner: boolean;
  onClear: () => void;
}) {
  if (!product) {
    return (
      <div className="flex min-h-[180px] flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-100/25 bg-slate-950/20 p-5 text-center">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-cyan-100/20 text-base font-bold text-cyan-200/70">
          {label}
        </span>
        <p className="mt-3 text-sm font-semibold text-cyan-100/80">Slot {label} vacío</p>
        <p className="mt-1 text-xs text-cyan-100/55">Elígelo desde el catálogo de la izquierda.</p>
      </div>
    );
  }

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border shadow-xl shadow-slate-950/25 ${
        isWinner
          ? "border-emerald-300/55 bg-emerald-400/10"
          : "border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))]"
      }`}
    >
      <span className="absolute left-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-slate-950/70 text-xs font-bold text-cyan-100">
        {label}
      </span>
      <button
        type="button"
        onClick={onClear}
        aria-label={`Quitar producto ${label}`}
        className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-slate-950/70 text-cyan-100/80 transition hover:bg-rose-500/40 hover:text-white"
      >
        ×
      </button>

      <div className="h-32 w-full bg-slate-800/40">
        {product.imagenPrincipal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imagenPrincipal}
            alt={product.nombre}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-white">{product.nombre}</h3>
        <p className="mt-2 text-lg font-bold text-cyan-100">{formatPrice(product.precio)}</p>
        <p className="mt-1 text-xs text-amber-200/80">{formatRating(product.calificacion)}</p>
        {isWinner ? (
          <p className="mt-2 inline-block rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs font-semibold text-emerald-100">
            Mejor deal
          </p>
        ) : null}
      </div>
    </article>
  );
}

function QuickCompareRow({
  label,
  valueA,
  valueB,
  winsA,
  winsB,
}: {
  label: string;
  valueA: string;
  valueB: string;
  winsA: boolean;
  winsB: boolean;
}) {
  const cell = (value: string, wins: boolean) => (
    <span
      className={`flex-1 rounded-xl px-3 py-1.5 text-center text-sm ${
        wins
          ? "bg-emerald-400/15 font-semibold text-emerald-100"
          : "bg-slate-950/40 text-cyan-100/80"
      }`}
    >
      {value}
    </span>
  );

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-cyan-100/10 bg-slate-950/25 p-2">
      <span className="w-24 shrink-0 pl-1 text-xs font-semibold text-cyan-200/75">{label}</span>
      {cell(valueA, winsA)}
      {cell(valueB, winsB)}
    </div>
  );
}

function ScoreBar({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | null;
  highlight?: boolean;
}) {
  const safe = typeof value === "number" ? Math.max(0, Math.min(100, value)) : null;

  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-cyan-200/70">{label}</span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70">
        <span
          className={`block h-full rounded-full ${highlight ? "bg-emerald-300/80" : "bg-cyan-300/70"}`}
          style={{ width: `${safe ?? 0}%` }}
        />
      </span>
      <span className="w-8 shrink-0 text-right text-cyan-100/80">{safe ?? "—"}</span>
    </div>
  );
}
