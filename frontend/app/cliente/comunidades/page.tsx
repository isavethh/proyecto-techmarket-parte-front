"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  discoverClientCommunities,
  joinClientCommunity,
  leaveClientCommunity,
  listClientCommunities,
  type ClientCommunity,
} from "@/lib/api/iaApi";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import ClientSidebar from "../ClientSidebar";

type FilterMode = "todas" | "unidas" | "disponibles";

const coverImages = [
  "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
];

const tagForCommunity = (name: string): string => {
  const normalized = name.toLowerCase();
  if (normalized.includes("pc") || normalized.includes("armadores")) return "PC Building";
  if (normalized.includes("soporte") || normalized.includes("tecnico")) return "Soporte";
  if (normalized.includes("red")) return "Redes";
  if (normalized.includes("gam")) return "Gaming";
  return "TechMarket";
};

const coverForIndex = (index: number) => coverImages[index % coverImages.length];

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return "—";
  }
};

export default function ComunidadesPage() {
  const [communities, setCommunities] = useState<ClientCommunity[]>([]);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionTone, setActionTone] = useState<"success" | "error">("success");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("todas");
  const [search, setSearch] = useState("");

  const loadCommunities = async () => {
    setIsLoading(true);
    setRemoteError(null);
    try {
      const response = await discoverClientCommunities();
      setCommunities(response);
    } catch (discoverError) {
      // Fallback: si /discover no existe aún en el backend, intentar con /communities
      // que solo devuelve las comunidades del usuario unidas.
      console.warn("Discover falló, usando fallback a /communities", discoverError);
      try {
        const fallback = await listClientCommunities();
        setCommunities(fallback.map((c) => ({ ...c, unido: true })));
        setRemoteError(null);
      } catch (fallbackError) {
        setRemoteError(
          fallbackError instanceof Error
            ? fallbackError.message
            : "No se pudo cargar comunidades",
        );
        setCommunities([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCommunities();
  }, []);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = window.setTimeout(() => setActionMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [actionMessage]);

  const filteredCommunities = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const list = [...communities]
      .filter((community) => {
        if (filter === "unidas") return community.unido;
        if (filter === "disponibles") return !community.unido;
        return true;
      })
      .filter((community) => {
        if (!normalizedSearch) return true;
        return (
          community.nombre.toLowerCase().includes(normalizedSearch) ||
          (community.descripcion ?? "").toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
    return list;
  }, [communities, filter, search]);

  const totalJoined = useMemo(() => communities.filter((c) => c.unido).length, [communities]);
  const totalAvailable = communities.length;

  const featuredCommunity = useMemo(
    () => communities.find((c) => c.unido) ?? communities[0] ?? null,
    [communities],
  );

  const handleJoinCommunity = async (community: ClientCommunity) => {
    if (busyId) return;
    setBusyId(community.id);
    try {
      const response = await joinClientCommunity(community.id);
      setCommunities((current) =>
        current.map((c) =>
          c.id === community.id ? { ...c, unido: true, miembros: c.miembros + (c.unido ? 0 : 1) } : c,
        ),
      );
      setActionMessage(response.mensaje ?? `Te uniste a ${community.nombre}`);
      setActionTone("success");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "No se pudo unir a la comunidad");
      setActionTone("error");
    } finally {
      setBusyId(null);
    }
  };

  const handleLeaveCommunity = async (community: ClientCommunity) => {
    if (busyId) return;
    setBusyId(community.id);
    try {
      await leaveClientCommunity(community.id);
      setCommunities((current) =>
        current.map((c) =>
          c.id === community.id
            ? { ...c, unido: false, miembros: Math.max(0, c.miembros - 1) }
            : c,
        ),
      );
      setActionMessage(`Saliste de ${community.nombre}`);
      setActionTone("success");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "No se pudo salir de la comunidad");
      setActionTone("error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader sectionLabel="Comunidades" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-120px)] lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar min-w-0 space-y-4 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
          <ClientSidebar contextCard={false} />

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">RESUMEN</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                <p className="text-cyan-200/70">Disponibles</p>
                <p className="mt-1 text-lg font-bold text-cyan-50">{totalAvailable}</p>
              </div>
              <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                <p className="text-cyan-200/70">Unido</p>
                <p className="mt-1 text-lg font-bold text-cyan-300">{totalJoined}</p>
              </div>
            </div>
          </section>

          {featuredCommunity ? (
            <section className="tech-card">
              <p className="tech-mono text-xs text-cyan-200/75">COMUNIDAD DESTACADA</p>
              <h3 className="mt-2 text-xl font-semibold text-cyan-50">{featuredCommunity.nombre}</h3>
              <p className="mt-3 text-sm leading-7 text-cyan-100/80">
                {featuredCommunity.descripcion ??
                  "Entra como visitante para explorar contenido. Al unirte desbloqueas participación completa."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {tagForCommunity(featuredCommunity.nombre)}
                </span>
                <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {featuredCommunity.miembros} miembros
                </span>
                {featuredCommunity.unido ? (
                  <span className="rounded-full border border-emerald-300/35 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                    Miembro activo
                  </span>
                ) : null}
              </div>
              <Link
                href={`/cliente/comunidades/${featuredCommunity.id}`}
                className="mt-4 inline-flex w-full justify-center rounded-xl border border-cyan-100/15 bg-cyan-300/15 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/25"
              >
                Abrir comunidad →
              </Link>
            </section>
          ) : null}

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/servicios", label: "Ir a servicios" },
              { href: "/cliente/chat", label: "Ir a chat" },
            ]}
          />
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:h-[calc(100vh-120px)] lg:pr-2">
          <section className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.9),rgba(7,24,44,0.96))] p-5 shadow-xl shadow-slate-950/25 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/75">DESCUBRIMIENTO</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50">Comunidades activas</h1>
            <p className="mt-2 text-sm text-cyan-100/80">
              {remoteError
                ? `No se pudo conectar con la API: ${remoteError}`
                : "Explora todas las comunidades disponibles. Únete para publicar y conectar con otros miembros."}
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="flex-1 rounded-xl border border-cyan-100/15 bg-slate-950/45 px-3 py-2 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
              <div className="flex gap-2">
                {(["todas", "unidas", "disponibles"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFilter(mode)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      filter === mode
                        ? "border-cyan-300/45 bg-cyan-300/20 text-cyan-50"
                        : "border-cyan-100/15 bg-white/5 text-cyan-100/80 hover:bg-cyan-100/10"
                    }`}
                  >
                    {mode === "todas" ? "Todas" : mode === "unidas" ? "Mías" : "Por unirse"}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {actionMessage ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                actionTone === "success"
                  ? "border-emerald-300/35 bg-emerald-500/12 text-emerald-100"
                  : "border-rose-400/35 bg-rose-500/12 text-rose-100"
              }`}
            >
              {actionMessage}
            </div>
          ) : null}

          {isLoading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando comunidades...</p>
            </section>
          ) : filteredCommunities.length === 0 ? (
            <section className="tech-card flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-100/10 bg-cyan-400/10 text-2xl">
                👥
              </div>
              <p className="text-base font-semibold text-cyan-50">
                {search.trim()
                  ? "No encontramos comunidades para esa búsqueda"
                  : filter === "unidas"
                    ? "Aún no te uniste a ninguna comunidad"
                    : "No hay comunidades disponibles"}
              </p>
              <p className="max-w-md text-sm text-cyan-100/70">
                {filter === "unidas"
                  ? "Explora la pestaña 'Por unirse' para descubrir comunidades activas."
                  : "Las nuevas comunidades aparecerán aquí cuando estén disponibles."}
              </p>
            </section>
          ) : (
            <section className="grid gap-4 md:grid-cols-2">
              {filteredCommunities.map((community, index) => {
                const isJoined = community.unido;
                const tag = tagForCommunity(community.nombre);
                const isBusy = busyId === community.id;

                return (
                  <article
                    key={community.id}
                    className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(180deg,rgba(12,42,72,0.94),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-950 md:h-48">
                      <img
                        src={coverForIndex(index)}
                        alt={community.nombre}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      {isJoined ? (
                        <span className="absolute right-3 top-3 rounded-full border border-emerald-300/40 bg-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-50 backdrop-blur-sm">
                          ✓ Miembro
                        </span>
                      ) : null}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                          {tag}
                        </span>
                        <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-50">
                          {isJoined ? "Miembro" : "Visitante"}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-semibold text-cyan-50">{community.nombre}</h2>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-cyan-100/80 line-clamp-3">
                        {community.descripcion ??
                          "Comunidad activa para compartir dudas, comparaciones, experiencias y recomendaciones tecnológicas."}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                          <p className="tech-mono text-[10px] text-cyan-200/60">MIEMBROS</p>
                          <p className="mt-1 font-semibold text-cyan-50">{community.miembros}</p>
                        </div>
                        <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                          <p className="tech-mono text-[10px] text-cyan-200/60">CREADA</p>
                          <p className="mt-1 font-semibold text-cyan-50">
                            {formatDate(community.creadoEn)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                        <Link
                          href={`/cliente/comunidades/${community.id}`}
                          className="rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-center text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                        >
                          Abrir comunidad
                        </Link>
                        {isJoined ? (
                          <button
                            type="button"
                            onClick={() => void handleLeaveCommunity(community)}
                            disabled={isBusy}
                            className="rounded-xl border border-rose-400/25 bg-rose-500/12 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-60"
                          >
                            {isBusy ? "..." : "Salir"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleJoinCommunity(community)}
                            disabled={isBusy}
                            className="rounded-xl border border-cyan-200/35 bg-cyan-300/20 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/30 disabled:opacity-60"
                          >
                            {isBusy ? "Uniéndose..." : "Unirme"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
