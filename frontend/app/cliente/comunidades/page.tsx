"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import {
  getClientCommunities,
  joinCommunityApi,
  leaveCommunityApi,
} from "@/lib/api/clientApi";
import type { ApiCommunity } from "@/lib/api/types";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

export default function ComunidadesPage() {
  const pathname = usePathname();

  const [communities, setCommunities] = useState<ApiCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getClientCommunities()
      .then(setCommunities)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (community: ApiCommunity) => {
    const alreadyJoined = joinedIds.has(community.id);
    if (alreadyJoined) {
      const confirmed = window.confirm(`Quieres salir de ${community.nombre}?`);
      if (!confirmed) return;
      try {
        await leaveCommunityApi(community.id);
        setJoinedIds((prev) => {
          const next = new Set(prev);
          next.delete(community.id);
          return next;
        });
        showToast("Saliste de la comunidad");
      } catch {
        showToast("No se pudo salir de la comunidad");
      }
    } else {
      const confirmed = window.confirm(
        `Quieres ingresar a ${community.nombre}? Al entrar podras publicar y participar en toda la comunidad.`,
      );
      if (!confirmed) return;
      try {
        await joinCommunityApi(community.id);
        setJoinedIds((prev) => new Set([...prev, community.id]));
        showToast("Te uniste a la comunidad");
      } catch {
        showToast("No se pudo unir a la comunidad");
      }
    }
  };

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Comunidades" />

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
            <ClientQuickLinksCard
              links={[
                { href: "/cliente", label: "Volver al feed" },
                { href: "/cliente/servicios", label: "Ir a servicios" },
                { href: "/cliente/empresas", label: "Explorar empresas" },
              ]}
            />
          </div>
        </aside>

        <section
          className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">GET /api/clients/communities</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Comunidades activas</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              Entra como visitante para explorar contenido. Al unirte desbloqueas publicaciones y participacion completa.
            </p>
          </section>

          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando comunidades...</p>
            </section>
          ) : error ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con{" "}
                <span className="font-mono text-cyan-200">GET /api/clients/communities</span>.
              </p>
            </section>
          ) : communities.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">No hay comunidades disponibles.</p>
            </section>
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              {communities.map((community) => {
                const joined = joinedIds.has(community.id);
                return (
                  <article
                    key={community.id}
                    className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25"
                  >
                    <div className="h-44 w-full bg-[linear-gradient(140deg,rgba(34,211,238,0.18),rgba(30,64,175,0.20),rgba(8,47,73,0.55))]" />

                    <div className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full border border-cyan-100/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/85">
                          Comunidad
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold text-cyan-50 ${joined ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100" : "border-cyan-100/20 bg-white/5"}`}>
                          {joined ? "Miembro" : "Visitante"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold text-white">{community.nombre}</h3>
                      <p className="mt-1 font-mono text-[11px] text-cyan-200/50">{community.id}</p>

                      <div className="mt-4 grid grid-cols-1 gap-2 text-center text-xs">
                        <div className="rounded-xl border border-cyan-100/10 bg-slate-950/25 px-3 py-2 text-cyan-100/75">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/60">Miembros</p>
                          <p className="mt-1 font-semibold text-cyan-50">{community.miembros}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/cliente/comunidades/${community.id}`}
                          className="flex-1 rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-center text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                        >
                          Abrir comunidad
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleJoin(community)}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                            joined
                              ? "border-cyan-100/20 bg-white/5 text-cyan-100/70 hover:bg-white/10"
                              : "border-cyan-100/20 bg-white/5 text-cyan-100/90 hover:bg-white/10"
                          }`}
                        >
                          {joined ? "Salir" : "Unirme"}
                        </button>
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
