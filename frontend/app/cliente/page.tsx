"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type SearchMode = "normal" | "ia";
type SidebarView = "busqueda" | "favoritos" | "guardados";

const favorites = [
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

const savedItems = [
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

const feedItems = [
  {
    id: "post-1",
    author: "TechFix Lab",
    role: "Servicio tecnico",
    time: "Hace 2 horas",
    title: "Diagnostico express para laptops lentas",
    body: "Servicio a domicilio con limpieza interna y optimizacion de rendimiento.",
    tag: "Nuevo servicio",
    location: "Bogota",
    imageClass: "from-cyan-300/40 via-blue-500/30 to-slate-900/60",
  },
  {
    id: "post-2",
    author: "Zona Gamer Store",
    role: "Tienda",
    time: "Hace 6 horas",
    title: "Mouse ergonomico con 20% de descuento",
    body: "Stock limitado. Ideal para jornadas largas y setup profesional.",
    tag: "Promocion",
    location: "Medellin",
    imageClass: "from-emerald-300/35 via-cyan-400/30 to-slate-900/60",
  },
  {
    id: "post-3",
    author: "ElectroCare",
    role: "Servicio tecnico",
    time: "Hace 1 dia",
    title: "Cambio de pasta termica y limpieza",
    body: "Mejora la temperatura y evita apagados inesperados.",
    tag: "Recomendado",
    location: "Cali",
    imageClass: "from-violet-300/35 via-sky-500/30 to-slate-900/60",
  },
];

const normalResults = [
  {
    title: "Laptop Pro 14",
    category: "Equipos",
    info: "Entrega 24-48h · 4.8",
  },
  {
    title: "Teclado mecanico TKL",
    category: "Accesorios",
    info: "Entrega 24h · 4.7",
  },
  {
    title: "Servicio tecnico express",
    category: "Servicios",
    info: "Disponible hoy · 4.9",
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

export default function ClientePage() {
  const [searchMode, setSearchMode] = useState<SearchMode>("normal");
  const [query, setQuery] = useState<string>("");
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [aiResults, setAiResults] = useState<typeof aiSuggestions>([]);
  const [sidebarView, setSidebarView] = useState<SidebarView>("busqueda");

  const aiSummary = useMemo(() => {
    if (!aiResults.length) return "";
    return `Entendi tu necesidad: ${aiQuery.trim() || "consulta tecnica"}.`;
  }, [aiQuery, aiResults.length]);

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
    <div className="flex-1 pb-12">
      <header className="tech-top-nav">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Cliente activo</span>
        </div>
      </header>

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_1fr]">
        <aside className="tech-card h-fit">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-cyan-50">Mi espacio</p>
            <span className="tech-chip">Sidebar</span>
          </div>
          <div className="mt-5 grid gap-2">
            <button
              type="button"
              className={`auth-action ${sidebarView === "busqueda" ? "active" : ""}`}
              onClick={() => setSidebarView("busqueda")}
            >
              Busca lo que necesitas
            </button>
            <button
              type="button"
              className={`auth-action ${sidebarView === "favoritos" ? "active" : ""}`}
              onClick={() => setSidebarView("favoritos")}
            >
              Favoritos
            </button>
            <button
              type="button"
              className={`auth-action ${sidebarView === "guardados" ? "active" : ""}`}
              onClick={() => setSidebarView("guardados")}
            >
              Guardados
            </button>
          </div>

        </aside>

        <section className="space-y-6">
          {sidebarView === "busqueda" && (
            <>
              <div className="tech-hero p-6 md:p-8">
                <p className="tech-mono text-xs text-cyan-200/75">ROL_ACTIVO=CLIENTE</p>
                <h1 className="mt-2 text-3xl font-bold text-cyan-50 md:text-4xl">
                  Busqueda inteligente para tu proxima compra o servicio.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
                  Elige el tipo de busqueda que necesitas: normal para catalogos o
                  IA para recomendaciones semanticas.
                </p>
              </div>

              <div className="tech-card">
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
                  <form className="mt-5 space-y-4" onSubmit={handleNormalSearch}>
                    <div className="flex flex-col gap-3 md:flex-row">
                      <input
                        className="auth-input"
                        placeholder="Busca productos, tiendas o servicios..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <button type="submit" className="tech-button tech-button-primary">
                        Buscar
                      </button>
                    </div>
                  </form>
                )}

                {searchMode === "ia" && (
                  <form className="mt-5 space-y-4" onSubmit={handleAiSearch}>
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
                    {aiSummary && (
                      <p className="text-sm text-cyan-100/80">{aiSummary}</p>
                    )}
                    <div className="grid gap-3 md:grid-cols-3">
                      {aiResults.map((result) => (
                        <article
                          key={result.title}
                          className="rounded-2xl border border-cyan-100/15 p-4"
                        >
                          <div
                            className={`h-28 w-full rounded-xl border border-cyan-100/10 bg-gradient-to-br ${result.imageClass}`}
                          />
                          <p className="mt-4 tech-mono text-xs text-cyan-200/75">
                            Servicio tecnico
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-cyan-50">
                            {result.title}
                          </h3>
                          <p className="mt-3 text-sm text-cyan-100/80">{result.match}</p>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm text-cyan-200/85">
                              Reputacion {result.rating}
                            </span>
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
              </div>

              <div className="tech-card">
                <h2 className="text-2xl font-semibold text-cyan-50">Feed</h2>
                <p className="mt-3 text-sm text-cyan-100/80">
                  Novedades y actividad relevante para ti.
                </p>
                <div className="mt-4 space-y-4">
                  {feedItems.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-cyan-100/15 bg-background-soft/40 p-4"
                    >
                      <div
                        className={`h-36 w-full rounded-xl border border-cyan-100/10 bg-gradient-to-br ${item.imageClass}`}
                      />
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-cyan-50">{item.author}</p>
                          <p className="text-xs text-cyan-200/70">
                            {item.role} · {item.location}
                          </p>
                        </div>
                        <span className="rounded-full border border-cyan-100/20 px-3 py-1 text-xs text-cyan-100/80">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-cyan-50">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-cyan-100/80">{item.body}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-cyan-200/70">
                        <span>{item.time}</span>
                        <button type="button" className="auth-link">
                          Ver publicacion
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}

          {sidebarView === "favoritos" && (
            <div className="tech-card">
              <h2 className="text-2xl font-semibold text-cyan-50">Tus favoritos</h2>
              <p className="mt-3 text-sm text-cyan-100/80">
                Accede rapido a productos y servicios que marcaste.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {favorites.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-cyan-100/15 p-4">
                    <div
                      className={`h-24 w-full rounded-xl border border-cyan-100/10 bg-gradient-to-br ${item.imageClass}`}
                    />
                    <p className="mt-3 text-sm text-cyan-100/85">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sidebarView === "guardados" && (
            <div className="tech-card">
              <h2 className="text-2xl font-semibold text-cyan-50">Guardados</h2>
              <p className="mt-3 text-sm text-cyan-100/80">
                Listado de productos o servicios que guardaste para despues.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {savedItems.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-cyan-100/15 p-4">
                    <div
                      className={`h-24 w-full rounded-xl border border-cyan-100/10 bg-gradient-to-br ${item.imageClass}`}
                    />
                    <p className="mt-3 text-sm text-cyan-100/85">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </main>

      {isThinking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur">
          <div className="rounded-3xl border border-cyan-100/20 bg-background-soft/90 px-8 py-6 text-center">
            <p className="tech-mono text-xs text-cyan-200/80">IA ANALIZANDO</p>
            <p className="mt-3 text-lg font-semibold text-cyan-50">
              Busqueda semantica en progreso...
            </p>
            <p className="mt-2 text-sm text-cyan-100/80">Estamos buscando servicios tecnicos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
