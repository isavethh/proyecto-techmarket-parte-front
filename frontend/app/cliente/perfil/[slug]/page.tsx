"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import {
  ClientInfoCard,
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../../components/ClientPageSections";
import {
  COMMUNITY_FEED_UPDATED_EVENT,
  mergeCommunityFeedPosts,
  readCommunityFeedPosts,
} from "../../../lib/communityFeed";
import {
  clientProfileSeedPosts,
  resolveClientUserProfile,
  toClientProfileSlug,
} from "../../../lib/clientUserProfiles";

const EMPTY_FEED_SNAPSHOT = [];

const subscribeCommunityFeed = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "techmarket.community.feed") {
      onStoreChange();
    }
  };

  const handleFeedUpdate = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COMMUNITY_FEED_UPDATED_EVENT, handleFeedUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COMMUNITY_FEED_UPDATED_EVENT, handleFeedUpdate);
  };
};

const formatPublishedAt = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);

  if (Number.isNaN(parsed)) {
    return "Reciente";
  }

  const date = new Date(parsed);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes} UTC`;
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("") || "US";

export default function ClienteUsuarioPerfilPage() {
  const params = useParams<{ slug: string | string[] }>();
  const searchParams = useSearchParams();

  const slugValue = Array.isArray(params.slug) ? (params.slug[0] ?? "") : params.slug;
  const normalizedSlug = toClientProfileSlug(slugValue);

  const nameHint = searchParams.get("name")?.trim() ?? "";
  const locationHint = searchParams.get("location")?.trim() ?? "";

  const profile = resolveClientUserProfile(normalizedSlug, nameHint, locationHint);

  const dynamicFeedPosts = useSyncExternalStore(
    subscribeCommunityFeed,
    readCommunityFeedPosts,
    () => EMPTY_FEED_SNAPSHOT,
  );

  const authoredPosts = useMemo(() => {
    const seedPosts = clientProfileSeedPosts.filter(
      (post) => toClientProfileSlug(post.author) === profile.slug,
    );

    const dynamicPosts = dynamicFeedPosts.filter(
      (post) => toClientProfileSlug(post.author) === profile.slug,
    );

    return mergeCommunityFeedPosts([...seedPosts, ...dynamicPosts]);
  }, [dynamicFeedPosts, profile.slug]);

  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de usuario" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <ClientInfoCard
            eyebrow="PERFIL CLIENTE"
            title={profile.name}
            description="Perfil publico del usuario dentro de la comunidad cliente de TechMarket."
          >
            <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
              <div className="flex items-center justify-between gap-3">
                <span>Ciudad</span>
                <strong className="text-cyan-50">{profile.city}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Area de residencia</span>
                <strong className="text-cyan-50">{profile.residenceArea}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Estado</span>
                <strong className="text-cyan-50">{profile.account}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Publicaciones</span>
                <strong className="text-cyan-50">{authoredPosts.length}</strong>
              </div>
            </div>
          </ClientInfoCard>

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/chat", label: "Ir a mis chats" },
              { href: "/cliente/comunidades", label: "Explorar comunidades" },
            ]}
          />
        </aside>

        <section className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr] md:p-8">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-100/10 bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                    {getInitials(profile.name)}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Perfil de usuario</p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{profile.name}</h1>
                    <p className="mt-2 text-sm text-cyan-100/80">{profile.email}</p>
                  </div>
                </div>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-cyan-100/85">{profile.bio}</p>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-4 py-2 text-cyan-100">
                    {profile.city}
                  </span>
                  <span className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-cyan-100/85">
                    {profile.residenceArea}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Informacion general</p>
                <div className="mt-4 space-y-2">
                  {profile.generalInfo.map((item) => (
                    <div key={item} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                      {item}
                    </div>
                  ))}
                </div>
                <Link
                  href="/cliente/chat"
                  className="mt-4 inline-flex rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                >
                  Enviar mensaje
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Publicaciones</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Todas las publicaciones de {profile.name}</h2>
              </div>
              <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/90">
                {authoredPosts.length} publicaciones
              </span>
            </div>

            {authoredPosts.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-cyan-100/18 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                Este usuario aun no tiene publicaciones visibles en la comunidad.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {authoredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(16,41,72,0.92),rgba(7,24,44,0.96))] p-4 shadow-xl shadow-slate-950/25"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-cyan-50">{post.author}</p>
                        <p className="text-xs text-cyan-200/70">
                          {post.role} · {post.location} · {formatPublishedAt(post.createdAt)}
                        </p>
                      </div>
                      <span className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-3 py-1 text-xs text-cyan-100/85">
                        {post.tag}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-cyan-50">{post.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-cyan-100/85">{post.body}</p>

                    {post.image ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100/10">
                        <img src={post.image} alt={post.title} className="h-56 w-full object-cover" loading="lazy" />
                      </div>
                    ) : null}

                    <div className="mt-4 border-t border-cyan-100/10 pt-3 text-xs text-cyan-200/75">
                      {post.time || formatPublishedAt(post.createdAt)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
