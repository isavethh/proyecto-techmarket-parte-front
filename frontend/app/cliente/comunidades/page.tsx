"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  joinClientCommunity,
  listClientCommunities,
  type ClientCommunity,
} from "@/lib/api/iaApi";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";

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
  const [communities, setCommunities] = useState<ClientCommunity[]>([]);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [joinMessageById, setJoinMessageById] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    listClientCommunities()
      .then((response) => {
        if (active) {
          setCommunities(response);
          setRemoteError(null);
        }
      })
      .catch((error) => {
        if (active) {
          setCommunities([]);
          setRemoteError(error instanceof Error ? error.message : "No se pudo cargar comunidades");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const orderedCommunities = useMemo(
    () => [...communities].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [communities],
  );

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const response = await joinClientCommunity(communityId);
      setJoinMessageById((current) => ({ ...current, [communityId]: response.mensaje }));
    } catch (error) {
      setJoinMessageById((current) => ({
        ...current,
        [communityId]: error instanceof Error ? error.message : "No se pudo unir a la comunidad",
      }));
    }
  };

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader sectionLabel="Comunidades" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-140px)] lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
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
            <p className="tech-mono text-xs text-cyan-200/75">COMUNIDADES</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Datos desde API</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Crear comunidades no esta disponible porque no existe endpoint en la API indicada.
            </p>
          </section>

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/servicios", label: "Ir a servicios" },
              { href: "/cliente/empresas", label: "Explorar empresas" },
            ]}
          />
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">API</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Comunidades activas</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              {remoteError ? `No se pudo conectar con la API: ${remoteError}` : "Listado conectado al backend."}
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {orderedCommunities.map((community) => (
              <article
                key={community.id}
                className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] p-4 shadow-xl shadow-slate-950/25"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-white">{community.nombre}</h3>
                  <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-50">
                    {community.miembros} miembros
                  </span>
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
                    onClick={() => handleJoinCommunity(community.id)}
                    className="rounded-xl border border-cyan-100/20 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
                  >
                    Unirme
                  </button>
                </div>

                {joinMessageById[community.id] ? (
                  <p className="mt-3 text-sm text-cyan-100/80">{joinMessageById[community.id]}</p>
                ) : null}
              </article>
            ))}
          </section>

          {!orderedCommunities.length ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                {isLoading ? "Cargando comunidades..." : "No hay comunidades para mostrar desde la API."}
              </p>
            </section>
          ) : null}
        </section>
      </main>
    </div>
  );
}
