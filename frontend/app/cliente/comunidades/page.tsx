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

type CommunityVisual = {
  tag: string;
  description: string;
  cover: string;
  status: "Miembro" | "Visitante";
};

const coverImages = [
  "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
];

const communityVisualFor = (community: ClientCommunity, index: number): CommunityVisual => {
  const normalizedName = community.nombre.toLowerCase();

  if (normalizedName.includes("pc") || normalizedName.includes("armadores")) {
    return {
      tag: "PC Building",
      description:
        "Comunidad para quienes arman PCs desde cero, comparten configuraciones y comparan componentes por rendimiento.",
      cover: coverImages[0],
      status: "Miembro",
    };
  }

  if (normalizedName.includes("soporte") || normalizedName.includes("tecnico")) {
    return {
      tag: "Soporte",
      description:
        "Espacio para diagnósticos, mantenimiento, reparación y buenas prácticas para equipos de trabajo.",
      cover: coverImages[1],
      status: index % 2 === 0 ? "Miembro" : "Visitante",
    };
  }

  if (normalizedName.includes("red")) {
    return {
      tag: "Redes",
      description:
        "Charlas sobre Wi-Fi, cableado, routers, seguridad y monitoreo para oficinas y pymes.",
      cover: coverImages[2],
      status: index % 2 === 0 ? "Miembro" : "Visitante",
    };
  }

  return {
    tag: "TechMarket",
    description:
      "Comunidad activa para compartir dudas, comparaciones, experiencias y recomendaciones tecnológicas.",
    cover: coverImages[index % coverImages.length],
    status: index % 2 === 0 ? "Miembro" : "Visitante",
  };
};

const formatCommunityDate = (index: number) => {
  const day = String(10 - Math.min(index, 8)).padStart(2, "0");
  const hour = String(4 + index).padStart(2, "0");
  return `${day}/04 ${hour}:10`;
};

export default function ComunidadesPage() {
  const pathname = usePathname();
  const [communities, setCommunities] = useState<ClientCommunity[]>([]);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [joinMessageById, setJoinMessageById] = useState<Record<string, string>>({});
  const [joinedById, setJoinedById] = useState<Record<string, boolean>>({});
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

  const featuredCommunity = orderedCommunities[0] ?? null;
  const featuredVisual = featuredCommunity ? communityVisualFor(featuredCommunity, 0) : null;

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const response = await joinClientCommunity(communityId);
      setJoinedById((current) => ({ ...current, [communityId]: true }));
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

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-120px)] lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar min-w-0 space-y-4 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
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
            <p className="tech-mono text-xs text-cyan-200/75">COMUNIDAD DESTACADA</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">
              {featuredCommunity?.nombre ?? "Comunidades activas"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              {featuredVisual?.description ??
                "Entra como visitante para explorar contenido. Al unirte desbloqueas participación completa."}
            </p>
            {featuredCommunity && featuredVisual ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {featuredVisual.tag}
                </span>
                <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {featuredCommunity.miembros} miembros
                </span>
                <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                  Miembro activo
                </span>
              </div>
            ) : null}
          </section>

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
                : "Entra como visitante para explorar contenido. Al unirte desbloqueas publicaciones y participación completa."}
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {orderedCommunities.map((community, index) => {
              const visual = communityVisualFor(community, index);
              const isJoined = joinedById[community.id] || visual.status === "Miembro";

              return (
                <article
                  key={community.id}
                  className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(180deg,rgba(12,42,72,0.94),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25"
                >
                  <div className="h-44 overflow-hidden bg-slate-950 md:h-48">
                    <img
                      src={visual.cover}
                      alt={community.nombre}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                        {visual.tag}
                      </span>
                      <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-50">
                        {isJoined ? "Miembro" : "Visitante"}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-semibold text-cyan-50">{community.nombre}</h2>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-cyan-100/80">
                      {visual.description}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                        <p className="tech-mono text-[10px] text-cyan-200/60">MIEMBROS</p>
                        <p className="mt-1 font-semibold text-cyan-50">{community.miembros}</p>
                      </div>
                      <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                        <p className="tech-mono text-[10px] text-cyan-200/60">POSTS</p>
                        <p className="mt-1 font-semibold text-cyan-50">{Math.max(1, index + 2)}</p>
                      </div>
                      <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                        <p className="tech-mono text-[10px] text-cyan-200/60">CREADA</p>
                        <p className="mt-1 font-semibold text-cyan-50">{formatCommunityDate(index)}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                      <Link
                        href={`/cliente/comunidades/${community.id}`}
                        className="rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-center text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                      >
                        Abrir comunidad
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleJoinCommunity(community.id)}
                        className="rounded-xl border border-cyan-100/20 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
                      >
                        {isJoined ? "Acceso completo" : "Unirme"}
                      </button>
                    </div>

                    {joinMessageById[community.id] ? (
                      <p className="mt-3 text-sm text-cyan-100/80">{joinMessageById[community.id]}</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
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
