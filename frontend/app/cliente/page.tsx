"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type SearchMode = "normal" | "ia";
type SidebarView = "busqueda" | "favoritos" | "guardados" | "mensajeria" | "seguimiento";

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

const followedFeedItems = [
  {
    id: "follow-1",
    author: "TechFix Lab",
    role: "Servicio tecnico",
    time: "Hace 1 hora",
    title: "Plan de mantenimiento mensual",
    body: "Seguimiento preventivo con visitas programadas y reportes.",
    tag: "Seguimiento",
    location: "Bogota",
    imageClass: "from-cyan-300/40 via-blue-500/30 to-slate-900/60",
  },
  {
    id: "follow-2",
    author: "Zona Gamer Store",
    role: "Tienda",
    time: "Hace 4 horas",
    title: "Nuevas laptops ultralivianas",
    body: "Modelos 2026 con bateria extendida y envio inmediato.",
    tag: "Novedad",
    location: "Medellin",
    imageClass: "from-emerald-300/35 via-cyan-400/30 to-slate-900/60",
  },
];

const searchHistory = [
  {
    term: "servicio tecnico",
    context: "Busqueda reciente",
  },
  {
    term: "laptop",
    context: "Busqueda reciente",
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

export default function ClientePage() {
  const [searchMode, setSearchMode] = useState<SearchMode>("normal");
  const [query, setQuery] = useState<string>("");
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [aiResults, setAiResults] = useState<typeof aiSuggestions>([]);
  const [sidebarView, setSidebarView] = useState<SidebarView>("busqueda");
  const [activeChatId, setActiveChatId] = useState(clientChatThreads[0].id);
  const [draftMessage, setDraftMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);

  const activeChat =
    clientChatThreads.find((chat) => chat.id === activeChatId) ?? clientChatThreads[0];

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
              className={`auth-action ${sidebarView === "mensajeria" ? "active" : ""}`}
              onClick={() => setSidebarView("mensajeria")}
            >
              Mensajeria
            </button>
            <button
              type="button"
              className={`auth-action ${sidebarView === "seguimiento" ? "active" : ""}`}
              onClick={() => setSidebarView("seguimiento")}
            >
              Seguimiento
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
                    <div className="rounded-2xl border border-cyan-100/15 bg-white/5 p-4">
                      <p className="tech-mono text-xs text-cyan-200/70">Historial reciente</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {searchHistory.map((item) => (
                          <button
                            key={item.term}
                            type="button"
                            className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100/90"
                          >
                            {item.term}
                          </button>
                        ))}
                      </div>
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
                    <div className="rounded-2xl border border-cyan-100/15 bg-white/5 p-4">
                      <p className="tech-mono text-xs text-cyan-200/70">Historial reciente</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {searchHistory.map((item) => (
                          <button
                            key={item.term}
                            type="button"
                            className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100/90"
                          >
                            {item.term}
                          </button>
                        ))}
                      </div>
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

          {sidebarView === "mensajeria" && (
            <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
              <div className="p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                  <aside className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="tech-mono text-xs text-cyan-200/75">MENSAJERIA</p>
                        <h2 className="mt-2 text-2xl font-bold text-white">Chats activos</h2>
                      </div>
                      <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                        {clientChatThreads.length}
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {clientChatThreads.map((chat) => {
                        const isActive = chat.id === activeChatId;

                        return (
                          <button
                            key={chat.id}
                            type="button"
                            onClick={() => setActiveChatId(chat.id)}
                            className={`w-full rounded-3xl border p-4 text-left transition ${
                              isActive
                                ? "border-cyan-300/50 bg-cyan-300/12"
                                : "border-cyan-100/10 bg-white/5 hover:bg-cyan-100/8"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                                {chat.avatar}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="font-semibold text-white">{chat.company}</p>
                                  <span className="text-xs text-cyan-100/60">{chat.time}</span>
                                </div>
                                <p className="text-xs text-cyan-100/70">{chat.trigger}</p>
                                <p className="mt-1 truncate text-sm text-cyan-100/80">{chat.lastMessage}</p>
                              </div>
                            </div>
                            {chat.unread ? (
                              <div className="mt-3 flex justify-end">
                                <span className="rounded-full bg-cyan-300 px-2.5 py-1 text-xs font-semibold text-slate-950">
                                  {chat.unread}
                                </span>
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <section className="flex min-h-[520px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-4 md:p-5">
                    <div className="flex items-center justify-between border-b border-cyan-100/10 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                          {activeChat.avatar}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">{activeChat.company}</p>
                          <p className="text-sm text-cyan-100/70">{activeChat.name}</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                        En linea
                      </span>
                    </div>

                    <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-3xl bg-slate-950/30 p-4 md:p-5">
                      {activeChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.author === "cliente" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                              message.author === "cliente"
                                ? "bg-cyan-300/15 text-cyan-50"
                                : "bg-white/5 text-cyan-100/90"
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className="mt-2 text-right text-xs text-cyan-100/55">{message.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 shrink-0 rounded-3xl border border-cyan-100/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Responder</p>
                      <div className="mt-3 flex flex-col gap-3 md:flex-row">
                        <input
                          value={draftMessage}
                          onChange={(event) => setDraftMessage(event.target.value)}
                          placeholder="Escribe un mensaje..."
                          className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                        />
                        <button className="rounded-2xl border border-cyan-100/10 bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                          Enviar
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </section>
          )}

          {sidebarView === "seguimiento" && (
            <div className="tech-card">
              <h2 className="text-2xl font-semibold text-cyan-50">Seguimiento</h2>
              <p className="mt-3 text-sm text-cyan-100/80">
                Publicaciones de empresas y servicios tecnicos que sigues.
              </p>
              <div className="mt-4 space-y-4">
                {followedFeedItems.map((item) => (
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
                    <h3 className="mt-3 text-lg font-semibold text-cyan-50">{item.title}</h3>
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

            <div className="max-h-[280px] space-y-3 overflow-y-auto px-4 py-3">
              {activeChat.messages.map((message) => (
                <div
                  key={message.id}
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
                <button className="rounded-2xl border border-cyan-100/10 bg-cyan-400/15 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
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
