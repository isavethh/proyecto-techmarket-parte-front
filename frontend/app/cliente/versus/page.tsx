"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import ClientSidebar from "../ClientSidebar";
import {
  MarketplaceProductSummary,
  VersusVerdict,
  compareProductsVersus,
  listMarketplaceProducts,
} from "../../../lib/api/iaApi";

const formatPrice = (value: number | null) =>
  typeof value === "number"
    ? new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(value)
    : "Sin precio";

export default function ClienteVersusPage() {
  const [products, setProducts] = useState<MarketplaceProductSummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

        if (!isMounted) {
          return;
        }

        const apiProducts = response.productos ?? [];
        setProducts(apiProducts);
        setSelectedIds(apiProducts.slice(0, 2).map((product) => product.id));
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        console.error("No se pudo cargar productos para versus", requestError);
        setProducts([]);
        setSelectedIds([]);
        setError("No se pudo conectar con la API de productos.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.includes(product.id)),
    [products, selectedIds],
  );

  const toggleProduct = (id: string) => {
    setVerdict(null);
    setCompareError(null);
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.length <= 1 ? current : current.filter((item) => item !== id);
      }

      return current.length >= 4 ? current : [...current, id];
    });
  };

  const canCompareWithAi = selectedIds.length === 2;

  const handleCompareWithAi = async () => {
    if (!canCompareWithAi || isComparing) {
      return;
    }

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
    id ? (products.find((product) => product.id === id)?.nombre ?? null) : null;

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Versus" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <ClientSidebar />

          <section className="tech-card space-y-2">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? "border-cyan-300/55 bg-cyan-300/12"
                      : "border-cyan-100/15 bg-slate-950/25 hover:bg-slate-950/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-cyan-50">{product.nombre}</p>
                  <p className="mt-1 text-xs text-cyan-200/70">{formatPrice(product.precio)}</p>
                </button>
              );
            })}

            {!products.length ? (
              <p className="text-sm text-cyan-100/75">
                {isLoading ? "Cargando productos..." : "No hay productos para comparar desde la API."}
              </p>
            ) : null}
          </section>

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/marketplace", label: "Explorar marketplace" },
              { href: "#versus-activo", label: "Ver comparacion activa" },
            ]}
          />
        </aside>

        <section id="versus-activo" className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">API</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Comparador de productos</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              {error ?? "Selecciona productos del marketplace para verlos lado a lado."}
            </p>
          </section>

          <section className="tech-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">IA</p>
                <h3 className="mt-1 text-lg font-semibold text-cyan-50">¿Cuál es el mejor deal?</h3>
                <p className="mt-1 text-xs text-cyan-100/70">
                  {canCompareWithAi
                    ? "La IA compara precio, calificación y reputación del vendedor."
                    : "Selecciona exactamente 2 publicaciones para pedir el veredicto de la IA."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCompareWithAi}
                disabled={!canCompareWithAi || isComparing}
                className="rounded-2xl border border-cyan-300/55 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isComparing ? "Comparando..." : "Comparar con IA"}
              </button>
            </div>

            {compareError ? (
              <p className="rounded-2xl border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {compareError}
              </p>
            ) : null}

            {verdict ? (
              <div className="space-y-4">
                {verdict.resumen ? (
                  <p className="text-base font-semibold text-cyan-50">{verdict.resumen}</p>
                ) : null}

                {verdict.ganadorId ? (
                  <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-100">
                    🏆 Mejor deal: {productNameById(verdict.ganadorId) ?? "Producto seleccionado"}
                  </p>
                ) : null}

                {verdict.veredicto ? (
                  <p className="text-sm text-cyan-100/85">{verdict.veredicto}</p>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  {(verdict.productos ?? []).map((evaluation) => {
                    const isWinner = evaluation.id === verdict.ganadorId;
                    return (
                      <article
                        key={`verdict-${evaluation.id}`}
                        className={`rounded-3xl border p-4 ${
                          isWinner
                            ? "border-emerald-300/55 bg-emerald-400/10"
                            : "border-cyan-100/15 bg-slate-950/30"
                        }`}
                      >
                        <h4 className="text-base font-semibold text-white">
                          {evaluation.nombre ?? productNameById(evaluation.id) ?? "Producto"}
                          {isWinner ? (
                            <span className="ml-2 text-xs text-emerald-200">Mejor deal</span>
                          ) : null}
                        </h4>

                        <div className="mt-3 space-y-2 text-xs text-cyan-100/85">
                          <ScoreBar label="Valor" value={evaluation.scoreValor} />
                          <ScoreBar label="Precio" value={evaluation.scorePrecio} />
                          <ScoreBar label="Calidad" value={evaluation.scoreCalidad} />
                          <ScoreBar label="Reputación" value={evaluation.scoreReputacion} />
                        </div>

                        {evaluation.pros?.length ? (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-emerald-200">A favor</p>
                            <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-cyan-100/80">
                              {evaluation.pros.map((item, index) => (
                                <li key={`pro-${evaluation.id}-${index}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {evaluation.contras?.length ? (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-rose-200">En contra</p>
                            <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-cyan-100/80">
                              {evaluation.contras.map((item, index) => (
                                <li key={`con-${evaluation.id}-${index}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>

          {selectedProducts.length ? (
            <>
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {selectedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25"
                  >
                    {product.imagenPrincipal ? (
                      <img
                        src={product.imagenPrincipal}
                        alt={product.nombre}
                        className="h-36 w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white">{product.nombre}</h3>
                      <p className="mt-3 text-base font-bold text-cyan-100">{formatPrice(product.precio)}</p>
                      <p className="mt-2 text-sm text-cyan-100/80">
                        Calificacion: {product.calificacion ?? "Sin calificacion"}
                      </p>
                    </div>
                  </article>
                ))}
              </section>

              <section className="tech-card overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-cyan-200/75">Dato</th>
                      {selectedProducts.map((product) => (
                        <th key={`head-${product.id}`} className="px-3 py-2 text-cyan-50">
                          {product.nombre}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="rounded-l-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2 font-semibold text-cyan-100/90">
                        Precio
                      </td>
                      {selectedProducts.map((product, index) => (
                        <td
                          key={`price-${product.id}`}
                          className={`border border-cyan-100/10 bg-slate-950/35 px-3 py-2 text-cyan-100/80 ${
                            index === selectedProducts.length - 1 ? "rounded-r-xl" : ""
                          }`}
                        >
                          {formatPrice(product.precio)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="rounded-l-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2 font-semibold text-cyan-100/90">
                        Calificacion
                      </td>
                      {selectedProducts.map((product, index) => (
                        <td
                          key={`rating-${product.id}`}
                          className={`border border-cyan-100/10 bg-slate-950/35 px-3 py-2 text-cyan-100/80 ${
                            index === selectedProducts.length - 1 ? "rounded-r-xl" : ""
                          }`}
                        >
                          {product.calificacion ?? "Sin calificacion"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </section>
            </>
          ) : (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                {isLoading ? "Cargando productos..." : "No hay productos para comparar desde la API."}
              </p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  const safe = typeof value === "number" ? Math.max(0, Math.min(100, value)) : null;

  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-cyan-200/70">{label}</span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70">
        <span
          className="block h-full rounded-full bg-cyan-300/70"
          style={{ width: `${safe ?? 0}%` }}
        />
      </span>
      <span className="w-8 shrink-0 text-right text-cyan-100/80">{safe ?? "—"}</span>
    </div>
  );
}
