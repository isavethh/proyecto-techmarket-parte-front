"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../../components/ClientPageSections";
import {
  ClientCommunityPost,
  joinClientCommunity,
  listClientCommunityPosts,
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

export default function CommunityDetailPage() {
  const params = useParams<{ slug: string }>();
  const communityId = useMemo(
    () => (Array.isArray(params.slug) ? params.slug[0] : params.slug),
    [params.slug],
  );
  const [posts, setPosts] = useState<ClientCommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listClientCommunityPosts(communityId);

        if (!isMounted) {
          return;
        }

        setPosts(response);
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
      loadPosts();
    }

    return () => {
      isMounted = false;
    };
  }, [communityId]);

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

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Comunidades" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
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
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">{communityId}</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Posts cargados desde el endpoint de comunidades del cliente.
            </p>

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

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/comunidades", label: "Ver todas las comunidades" },
              { href: "/cliente/chat", label: "Ir a chat" },
            ]}
          />
        </aside>

        <section className="space-y-4">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">API</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Publicaciones de comunidad</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              {error ?? "Esta pantalla ya no carga comunidades ni miembros locales de muestra."}
            </p>
          </section>

          {posts.map((post) => (
            <article key={post.id} className="tech-card">
              <p className="text-sm font-semibold text-cyan-50">{post.autor}</p>
              <p className="mt-3 text-sm leading-6 text-cyan-100/85">{post.contenido}</p>
            </article>
          ))}

          {!posts.length ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                {isLoading ? "Cargando publicaciones..." : "No hay publicaciones para mostrar desde la API."}
              </p>
            </section>
          ) : null}
        </section>
      </main>
    </div>
  );
}
