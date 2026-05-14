"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../../components/ClientPageSections";
import {
  ClientCommunityPost,
  joinClientCommunity,
  listClientCommunities,
  listClientCommunityPosts,
  type ClientCommunity,
} from "../../../../lib/api/iaApi";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

const coverImages = [
  "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
];

const members = [
  { name: "Diego Salazar", city: "Santa Cruz", role: "Administrador" },
  { name: "Lorena Vega", city: "La Paz", role: "Moderador" },
  { name: "Pablo Arce", city: "Cochabamba", role: "Moderador" },
  { name: "Camila Mendoza", city: "La Paz", role: "Miembro" },
  { name: "Hector Mena", city: "Tarija", role: "Miembro" },
];

const rules = [
  "Respeta opiniones tecnicas aunque no coincidan con tu setup.",
  "Publica especificaciones completas cuando pidas ayuda.",
  "No se permite spam comercial fuera de hilos autorizados.",
];

const communityVisualFor = (communityName: string, index = 0) => {
  const normalizedName = communityName.toLowerCase();

  if (normalizedName.includes("pc") || normalizedName.includes("armadores")) {
    return {
      tag: "PC Building",
      title: "PC Building",
      description:
        "PCs desde cero, comparan configuraciones y comparan componentes por rendimiento.",
      cover: coverImages[0],
    };
  }

  if (normalizedName.includes("soporte") || normalizedName.includes("tecnico")) {
    return {
      tag: "Soporte",
      title: "Soporte tecnico",
      description:
        "Diagnosticos, mantenimiento, reparacion y buenas practicas para equipos de trabajo.",
      cover: coverImages[1],
    };
  }

  if (normalizedName.includes("red")) {
    return {
      tag: "Redes",
      title: "Redes para Pymes",
      description:
        "Wi-Fi, cableado, routers, seguridad y monitoreo para oficinas y pymes.",
      cover: coverImages[2],
    };
  }

  return {
    tag: "TechMarket",
    title: communityName,
    description:
      "Dudas, comparaciones, experiencias y recomendaciones de la comunidad TechMarket.",
    cover: coverImages[index % coverImages.length],
  };
};

const postDate = (index: number) => {
  const day = String(18 - index).padStart(2, "0");
  const minute = String(20 + index * 7).padStart(2, "0");
  return `${day}/04 11:${minute}`;
};

export default function CommunityDetailPage() {
  const params = useParams<{ slug: string }>();
  const communityId = useMemo(
    () => (Array.isArray(params.slug) ? params.slug[0] : params.slug),
    [params.slug],
  );
  const [community, setCommunity] = useState<ClientCommunity | null>(null);
  const [posts, setPosts] = useState<ClientCommunityPost[]>([]);
  const [draftPost, setDraftPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCommunity = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [communitiesResponse, postsResponse] = await Promise.all([
          listClientCommunities(),
          listClientCommunityPosts(communityId),
        ]);

        if (!isMounted) {
          return;
        }

        setCommunity(communitiesResponse.find((item) => item.id === communityId) ?? null);
        setPosts(postsResponse);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        console.error("No se pudieron cargar posts de comunidad", requestError);
        setPosts([]);
        setError("No se pudo conectar con la API de comunidades.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (communityId) {
      loadCommunity();
    }

    return () => {
      isMounted = false;
    };
  }, [communityId]);

  const communityName = community?.nombre ?? communityId;
  const visual = communityVisualFor(communityName);

  const handleJoinCommunity = async () => {
    setJoinMessage(null);

    try {
      const response = await joinClientCommunity(communityId);
      setJoinMessage(response.mensaje);
    } catch (requestError) {
      console.error("No se pudo unir a comunidad", requestError);
      setJoinMessage("No se pudo unir a la comunidad.");
    }
  };

  const localPreviewPost = draftPost.trim()
    ? {
        id: "preview",
        autor: "Tu publicacion",
        contenido: draftPost.trim(),
      }
    : null;

  const visiblePosts = localPreviewPost ? [localPreviewPost, ...posts] : posts;

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader sectionLabel="Comunidades" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-120px)] lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
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
              {clientMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`auth-action ${item.href === "/cliente/comunidades" ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">COMUNIDAD</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">{communityName}</h1>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">{visual.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                {visual.tag}
              </span>
              <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100">
                {community?.miembros ?? 0} miembros
              </span>
              <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                Miembro activo
              </span>
            </div>

            <button
              type="button"
              onClick={handleJoinCommunity}
              className="mt-4 w-full rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
            >
              Ingresar ahora
            </button>

            {joinMessage ? (
              <p className="mt-3 text-sm text-cyan-100/80">{joinMessage}</p>
            ) : null}
          </section>

          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Miembros de la comunidad</p>
            <p className="mt-2 text-xs leading-5 text-cyan-100/70">
              Vista completa de miembros, incluyendo administrador y moderadores.
            </p>
            <div className="mt-4 space-y-2">
              {members.map((member) => (
                <div
                  key={member.name}
                  className="rounded-xl border border-cyan-100/12 bg-slate-950/35 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-cyan-50">{member.name}</p>
                    <span className="rounded-full border border-cyan-100/20 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-cyan-100">
                      {member.role}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-cyan-100/65">{member.city}</p>
                </div>
              ))}
            </div>
          </section>

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/comunidades", label: "Ver todas las comunidades" },
              { href: "/cliente/chat", label: "Ir a chat" },
            ]}
          />
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:h-[calc(100vh-120px)] lg:pr-2">
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(180deg,rgba(12,42,72,0.94),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25">
            <div className="h-64 overflow-hidden bg-slate-950 md:h-72">
              <img src={visual.cover} alt={communityName} className="h-full w-full object-cover" />
            </div>
            <div className="border-t border-cyan-100/10 p-5 md:p-6">
              <p className="tech-mono text-xs text-cyan-200/75">ENFOQUE</p>
              <h2 className="mt-2 text-2xl font-semibold text-cyan-50">{visual.title}</h2>
              <div className="mt-4 space-y-2">
                {rules.map((rule) => (
                  <p
                    key={rule}
                    className="rounded-xl border border-cyan-100/12 bg-slate-950/35 px-3 py-2 text-sm text-cyan-100/85"
                  >
                    {rule}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.9),rgba(7,24,44,0.96))] p-5 shadow-xl shadow-slate-950/25">
            <p className="tech-mono text-xs text-cyan-200/75">NUEVA PUBLICACION</p>
            <h3 className="mt-1 text-lg font-semibold text-cyan-50">
              Comparte algo en {communityName}
            </h3>
            <textarea
              value={draftPost}
              onChange={(event) => setDraftPost(event.target.value)}
              placeholder="Comparte una idea, pregunta o comparacion para la comunidad."
              className="mt-4 min-h-32 w-full resize-y rounded-xl border border-cyan-100/15 bg-slate-950/45 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="rounded-full border border-cyan-100/15 bg-cyan-300/12 px-4 py-2 text-xs font-semibold text-cyan-100">
                Elegir archivo
                <input type="file" className="hidden" />
              </label>
              <button
                type="button"
                disabled={!draftPost.trim()}
                className="rounded-xl border border-cyan-200/25 bg-cyan-400/20 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Publicar en comunidad
              </button>
            </div>
          </section>

          <section className="space-y-4">
            {visiblePosts.map((post, index) => {
              const member = members[index % members.length];
              const hasImage = index === 1;

              return (
                <article
                  key={post.id}
                  className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(180deg,rgba(8,28,52,0.96),rgba(7,24,44,0.98))] p-4 shadow-xl shadow-slate-950/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">{post.autor || member.name}</p>
                      <p className="text-xs text-cyan-100/65">{post.id === "preview" ? "Ahora" : postDate(index)}</p>
                    </div>
                    <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100">
                      {member.role}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-cyan-100/88">{post.contenido}</p>

                  {hasImage ? (
                    <img
                      src={visual.cover}
                      alt=""
                      className="mt-4 h-56 w-full rounded-2xl object-cover md:h-64"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-cyan-100/15 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                    >
                      {index === 0 ? "Te gusta" : "Me gusta"} ({index + 1})
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-white/10"
                    >
                      Responder ({index % 2})
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          {!visiblePosts.length ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                {isLoading ? "Cargando publicaciones..." : error ?? "No hay publicaciones para mostrar desde la API."}
              </p>
            </section>
          ) : null}
        </section>
      </main>
    </div>
  );
}
