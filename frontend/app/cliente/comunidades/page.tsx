"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import {
  getClientCommunities,
  joinCommunityApi,
  leaveCommunityApi,
  getCommunityPosts,
} from "../../lib/api/clientApi";
import type { ApiCommunity, ApiCommunityPost } from "../../lib/api/types";

const EMPTY_COMMUNITIES: ReturnType<typeof readCommunityCatalog> = [];
const EMPTY_POSTS: ReturnType<typeof readCommunityPosts> = [];

function CommunityCard({
  community,
  posts,
  joined,
  onJoin,
  onLeave,
  onViewPosts,
}: {
  community: ApiCommunity;
  posts: ApiCommunityPost[];
  joined: boolean;
  onJoin: (id: string, name: string) => void;
  onLeave: (id: string, name: string) => void;
  onViewPosts: (id: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25">
      <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-cyan-300/25 via-blue-500/20 to-slate-950/70">
        <span className="text-5xl font-bold text-cyan-300/35">
          {getInitials(community.nombre)}
        </span>
      </div>

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

const formatDateTime = (iso: string) => {
  const parsed = Date.parse(iso);

        <h3 className="mt-3 text-lg font-semibold text-white">{community.nombre}</h3>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-xl border border-cyan-100/10 bg-slate-950/25 px-2 py-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/60">Miembros</p>
            <p className="mt-1 font-semibold text-cyan-50">{community.miembros}</p>
          </div>
          <div className="rounded-xl border border-cyan-100/10 bg-slate-950/25 px-2 py-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/60">Posts</p>
            <p className="mt-1 font-semibold text-cyan-50">{posts.length}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onViewPosts(community.id)}
            className="flex-1 rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-center text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
          >
            Ver posts
          </button>
          {!joined ? (
            <button
              type="button"
              onClick={() => onJoin(community.id, community.nombre)}
              className="rounded-xl border border-cyan-100/20 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
            >
              Unirme
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onLeave(community.id, community.nombre)}
              className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-200/90 transition hover:bg-red-400/15"
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ComunidadesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const communities = useSyncExternalStore(
    subscribeCommunityStore,
    readCommunityCatalog,
    () => EMPTY_COMMUNITIES,
  );
  const posts = useSyncExternalStore(subscribeCommunityStore, readCommunityPosts, () => EMPTY_POSTS);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getClientCommunities();
      if (!result) {
        setApiError(true);
      } else {
        setCommunities(result);
        setJoinedIds(new Set(result.map((c) => c.id)));
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleViewPosts = async (communityId: string) => {
    if (activeCommunityId === communityId) {
      setActiveCommunityId(null);
      return;
    }
    setActiveCommunityId(communityId);
    if (!postsByCommunityId[communityId]) {
      const posts = await getCommunityPosts(communityId);
      setPostsByCommunityId((prev) => ({
        ...prev,
        [communityId]: posts ?? [],
      }));
    }
  };

  const handleJoin = async (communityId: string, name: string) => {
    const confirmed = window.confirm(
      `Quieres unirte a ${name}? Al entrar podras publicar y participar.`,
    );
    if (!confirmed) return;
    await joinCommunityApi(communityId);
    setJoinedIds((prev) => new Set([...prev, communityId]));
  };

  const handleLeave = async (communityId: string, name: string) => {
    const confirmed = window.confirm(`Seguro que quieres salir de ${name}?`);
    if (!confirmed) return;
    await leaveCommunityApi(communityId);
    setJoinedIds((prev) => {
      const next = new Set(prev);
      next.delete(communityId);
      return next;
    });
  };

  const activePosts = useMemo(
    () => (activeCommunityId ? (postsByCommunityId[activeCommunityId] ?? []) : []),
    [activeCommunityId, postsByCommunityId],
  );

  const activeCommunity = communities.find((c) => c.id === activeCommunityId);

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Comunidades" />

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
            <p className="mt-3 font-mono text-[10px] text-cyan-200/45">
              GET /api/clients/communities
            </p>
          </section>

          <section className="tech-card mt-4">
            <p className="tech-mono text-xs text-cyan-200/75">COMUNIDADES</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Encuentra tu grupo tech ideal</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Explora comunidades enfocadas en PC Building, iPhones, Android, comparaciones, gaming y mas dentro de TechMarket.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Comunidades", "Debate", "Descubrimiento", "Participacion"].map((chip) => (
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
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="w-full rounded-2xl border border-cyan-200/25 bg-cyan-300/15 px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/22"
              >
                Crear nueva comunidad
              </button>
            </section>

            <section className="tech-card">
              <p className="text-sm font-semibold text-cyan-50">Tu estado</p>
              <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/30 p-4">
                <p className="tech-mono text-xs text-cyan-200/70">CLIENTE ACTUAL</p>
                <p className="mt-2 text-base font-semibold text-cyan-50">{CURRENT_CLIENT_USER.name}</p>
                <p className="mt-1 text-sm text-cyan-100/75">{CURRENT_CLIENT_USER.city}</p>
                <p className="mt-3 text-sm leading-6 text-cyan-100/75">
                  Puedes crear comunidades y unirte a otras para publicar en ellas.
                </p>
              </div>
            </section>

            <ClientQuickLinksCard
              links={[
                { href: "/cliente", label: "Volver al feed" },
                { href: "/cliente/servicios", label: "Ir a servicios" },
                { href: "/cliente/empresas", label: "Explorar empresas" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">COMUNIDADES ACTIVAS</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">
              Comunidades del ecosistema
            </h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              Datos obtenidos desde{" "}
              <span className="font-mono text-cyan-200">GET /api/clients/communities</span>.
              Selecciona "Ver posts" para cargar las publicaciones de cada comunidad.
            </p>
          </section>

          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando comunidades desde la API...</p>
            </section>
          ) : apiError ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con la API en{" "}
                <span className="font-mono text-cyan-200">localhost:8082</span>.
              </p>
            </section>
          ) : communities.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">No hay comunidades disponibles.</p>
            </section>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-2">
                {communities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    posts={postsByCommunityId[community.id] ?? []}
                    joined={joinedIds.has(community.id)}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    onViewPosts={handleViewPosts}
                  />
                ))}
              </section>

              <AnimatePresence>
                {activeCommunityId && activeCommunity && (
                  <motion.section
                    key={activeCommunityId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22 }}
                    className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] p-5 shadow-xl shadow-slate-950/25"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="tech-mono text-xs text-cyan-200/75">POSTS</p>
                        <h3 className="mt-1 text-xl font-semibold text-cyan-50">
                          {activeCommunity.nombre}
                        </h3>
                        <p className="font-mono text-[10px] text-cyan-200/45">
                          GET /api/clients/communities/{activeCommunityId}/posts
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveCommunityId(null)}
                        className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100/80"
                      >
                        Cerrar
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {activePosts.length === 0 ? (
                        <p className="text-sm text-cyan-100/75">
                          No hay posts en esta comunidad o la API no retorno datos.
                        </p>
                      ) : (
                        activePosts.map((post) => (
                          <article
                            key={post.id}
                            className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4"
                          >
                            <p className="text-xs font-semibold text-cyan-200/80">{post.autor}</p>
                            <p className="mt-2 text-sm leading-6 text-cyan-100/85">{post.contenido}</p>
                            <p className="mt-2 font-mono text-[10px] text-cyan-200/45">{post.id}</p>
                          </article>
                        ))
                      )}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
