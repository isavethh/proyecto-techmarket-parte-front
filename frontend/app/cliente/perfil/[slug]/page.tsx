"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  ClientInfoCard,
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../../components/ClientPageSections";
import {
  COMMUNITY_FEED_UPDATED_EVENT,
  CommunityFeedPost,
  mergeCommunityFeedPosts,
  readCommunityFeedPosts,
} from "../../../lib/communityFeed";
import {
  clientProfileSeedPosts,
  resolveClientUserProfile,
  toClientProfileSlug,
} from "../../../lib/clientUserProfiles";

const EMPTY_FEED_SNAPSHOT: CommunityFeedPost[] = [];
const ACTIVE_CLIENT_SLUG = "camila-mendoza";
const ACTIVE_CLIENT_PROFILE_STORAGE_KEY = "techmarket.client.profile.camila-mendoza";

type EditableClientProfile = {
  name: string;
  email: string;
  city: string;
  residenceArea: string;
  bio: string;
};

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

function ClienteUsuarioPerfilContent() {
  const params = useParams<{ slug: string | string[] }>();
  const searchParams = useSearchParams();

  const slugValue = Array.isArray(params.slug) ? (params.slug[0] ?? "") : params.slug;
  const normalizedSlug = toClientProfileSlug(slugValue);

  const nameHint = searchParams.get("name")?.trim() ?? "";
  const locationHint = searchParams.get("location")?.trim() ?? "";

  const profile = resolveClientUserProfile(normalizedSlug, nameHint, locationHint);
  const isOwnProfile = profile.slug === ACTIVE_CLIENT_SLUG;
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editableProfile, setEditableProfile] = useState<EditableClientProfile>({
    name: profile.name,
    email: profile.email,
    city: profile.city,
    residenceArea: profile.residenceArea,
    bio: profile.bio,
  });

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

  useEffect(() => {
    const initialProfile: EditableClientProfile = {
      name: profile.name,
      email: profile.email,
      city: profile.city,
      residenceArea: profile.residenceArea,
      bio: profile.bio,
    };

    if (!isOwnProfile || typeof window === "undefined") {
      setEditableProfile(initialProfile);
      setIsEditingProfile(false);
      return;
    }

    const rawStoredProfile = window.localStorage.getItem(ACTIVE_CLIENT_PROFILE_STORAGE_KEY);

    if (!rawStoredProfile) {
      setEditableProfile(initialProfile);
      return;
    }

    try {
      const parsed = JSON.parse(rawStoredProfile) as Partial<EditableClientProfile>;

      setEditableProfile({
        name: parsed.name?.trim() || initialProfile.name,
        email: parsed.email?.trim() || initialProfile.email,
        city: parsed.city?.trim() || initialProfile.city,
        residenceArea: parsed.residenceArea?.trim() || initialProfile.residenceArea,
        bio: parsed.bio?.trim() || initialProfile.bio,
      });
    } catch {
      setEditableProfile(initialProfile);
    }
  }, [
    isOwnProfile,
    profile.bio,
    profile.city,
    profile.email,
    profile.name,
    profile.residenceArea,
  ]);

  const profileView = isOwnProfile ? { ...profile, ...editableProfile } : profile;

  const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOwnProfile || typeof window === "undefined") {
      return;
    }

    const normalizedProfile: EditableClientProfile = {
      name: editableProfile.name.trim() || profile.name,
      email: editableProfile.email.trim() || profile.email,
      city: editableProfile.city.trim() || profile.city,
      residenceArea: editableProfile.residenceArea.trim() || profile.residenceArea,
      bio: editableProfile.bio.trim() || profile.bio,
    };

    setEditableProfile(normalizedProfile);
    window.localStorage.setItem(ACTIVE_CLIENT_PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
    setIsEditingProfile(false);
  };

  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de usuario" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <ClientInfoCard
            eyebrow="PERFIL CLIENTE"
            title={profileView.name}
            description="Perfil publico del usuario dentro de la comunidad cliente de TechMarket."
          >
            <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
              <div className="flex items-center justify-between gap-3">
                <span>Ciudad</span>
                <strong className="text-cyan-50">{profileView.city}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Area de residencia</span>
                <strong className="text-cyan-50">{profileView.residenceArea}</strong>
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
            {isOwnProfile ? (
              <p className="mt-3 text-xs text-cyan-200/80">Este es tu perfil. Puedes editar tus datos visibles.</p>
            ) : null}
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
                    {getInitials(profileView.name)}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Perfil de usuario</p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{profileView.name}</h1>
                    <p className="mt-2 text-sm text-cyan-100/80">{profileView.email}</p>
                  </div>
                </div>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-cyan-100/85">{profileView.bio}</p>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-4 py-2 text-cyan-100">
                    {profileView.city}
                  </span>
                  <span className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-cyan-100/85">
                    {profileView.residenceArea}
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
                {isOwnProfile ? (
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-flex cursor-not-allowed rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-sm font-semibold text-cyan-100/65"
                  >
                    No puedes enviarte mensajes a ti mismo
                  </button>
                ) : (
                  <Link
                    href="/cliente/chat"
                    className="mt-4 inline-flex rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                  >
                    Enviar mensaje
                  </Link>
                )}
              </div>
            </div>
          </section>

          {isOwnProfile ? (
            <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Perfil editable</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Gestiona tus datos visibles</h2>
                </div>
                {!isEditingProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/18"
                  >
                    Editar perfil
                  </button>
                ) : null}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSave} className="mt-5 grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-name">Nombre</label>
                    <input
                      id="profile-name"
                      value={editableProfile.name}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, name: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-email">Correo</label>
                    <input
                      id="profile-email"
                      value={editableProfile.email}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, email: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-city">Ciudad</label>
                    <input
                      id="profile-city"
                      value={editableProfile.city}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, city: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-area">Area de residencia</label>
                    <input
                      id="profile-area"
                      value={editableProfile.residenceArea}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, residenceArea: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-bio">Bio</label>
                    <textarea
                      id="profile-bio"
                      value={editableProfile.bio}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, bio: event.target.value }))
                      }
                      rows={4}
                      className="auth-input mt-1 min-h-[110px] resize-y"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditableProfile({
                          name: profileView.name,
                          email: profileView.email,
                          city: profileView.city,
                          residenceArea: profileView.residenceArea,
                          bio: profileView.bio,
                        });
                        setIsEditingProfile(false);
                      }}
                      className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="tech-button tech-button-primary">
                      Guardar cambios
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-4 text-sm text-cyan-100/78">
                  Tus cambios se guardan en este navegador para personalizar como se muestra tu perfil.
                </p>
              )}
            </section>
          ) : null}

          <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Publicaciones</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Todas las publicaciones de {profileView.name}</h2>
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

export default function ClienteUsuarioPerfilPage() {
  return (
    <Suspense fallback={<div className="flex-1 pb-8" />}>
      <ClienteUsuarioPerfilContent />
    </Suspense>
  );
}
