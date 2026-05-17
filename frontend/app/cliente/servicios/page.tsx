"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listMarketplaceServices, type MarketplaceProductSummary } from "@/lib/api/iaApi";
import {
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../components/ClientPageSections";
import ClientSidebar from "../ClientSidebar";

export default function ServiciosIndexPage() {
  const [services, setServices] = useState<MarketplaceProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    listMarketplaceServices(appliedSearch ? { search: appliedSearch } : undefined)
      .then((response) => {
        if (!active) return;
        setServices(response.productos);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setServices([]);
        setError(err instanceof Error ? err.message : "No se pudo cargar servicios");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [appliedSearch]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedSearch(search.trim());
  };

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader sectionLabel="Servicios" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-140px)] lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
          <ClientSidebar />

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/marketplace", label: "Explorar marketplace" },
              { href: "/cliente/empresas", label: "Explorar empresas" },
            ]}
          />
        </aside>

        <section className="chat-scrollbar min-h-0 space-y-4 overflow-y-auto overflow-x-hidden pr-0 lg:h-[calc(100vh-140px)] lg:pr-4">
          <section className="tech-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">API</p>
                <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Servicios disponibles</h2>
              </div>
              <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs text-cyan-100/80">
                {services.length} servicios
              </span>
            </div>
            {error ? (
              <p className="mt-3 text-sm text-amber-200/85">No se pudo conectar: {error}</p>
            ) : (
              <p className="mt-3 text-sm text-cyan-100/80">
                {isLoading ? "Cargando servicios..." : "Listado conectado al backend."}
              </p>
            )}

            <form className="mt-4" onSubmit={handleSearch}>
              <div className="flex gap-3">
                <input
                  className="auth-input flex-1"
                  placeholder="Buscar servicio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="tech-button tech-button-primary whitespace-nowrap">
                  Buscar
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] p-4 shadow-xl shadow-slate-950/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{service.nombre}</h3>
                  <span className="shrink-0 rounded-full border border-cyan-100/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    Servicio
                  </span>
                </div>

                {service.precio != null && (
                  <p className="mt-3 text-lg font-semibold text-cyan-300">
                    Bs {service.precio.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                  </p>
                )}

                {(service.calificacion ?? 0) > 0 && (
                  <p className="mt-1 text-xs text-cyan-100/70">
                    Calificacion: {service.calificacion?.toFixed(1)}
                  </p>
                )}

                <div className="mt-4">
                  <Link
                    href={`/cliente/marketplace/${service.id}`}
                    className="inline-flex rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-4 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                  >
                    Ver detalles
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {!isLoading && services.length === 0 && !error && (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                {appliedSearch
                  ? `No se encontraron servicios para "${appliedSearch}".`
                  : "No hay servicios disponibles."}
              </p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
