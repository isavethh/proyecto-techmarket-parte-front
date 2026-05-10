"use client";

import { FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
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
  toClientProfileSlug,
} from "../../../lib/clientUserProfiles";
import { getClientProfile, updateClientProfile } from "../../../lib/api/clientApi";
import type { ApiClientProfile } from "../../../lib/api/types";

const EMPTY_FEED_SNAPSHOT: CommunityFeedPost[] = [];

type EditableFields = {
  nombre: string;
  apellido: string;
  telefono: string;
};

const subscribeCommunityFeed = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "techmarket.community.feed") onStoreChange();
  };
  const handleFeedUpdate = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COMMUNITY_FEED_UPDATED_EVENT, handleFeedUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COMMUNITY_FEED_UPDATED_EVENT, handleFeedUpdate);
  };
};

const formatPublishedAt = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return "Reciente";
  const date = new Date(parsed);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes} UTC`;
};

function getInitials(nombre: string, apellido: string): string {
  return (
    [nombre, apellido]
      .filter(Boolean)
      .slice(0, 2)
      .map((t) => t[0]?.toUpperCase() ?? "")
      .join("") || "US"
  );
}

function fullName(profile: ApiClientProfile): string {
  return [profile.nombre, profile.apellido].filter(Boolean).join(" ");
}

export default function ClienteUsuarioPerfilPage() {
  const [profile, setProfile] = useState<ApiClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<EditableFields>({
    nombre: "",
    apellido: "",
    telefono: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getClientProfile();
      if (!result) {
        setApiError(true);
      } else {
        setProfile(result);
        setEditFields({
          nombre: result.nombre,
          apellido: result.apellido,
          telefono: result.telefono,
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const dynamicFeedPosts = useSyncExternalStore(
    subscribeCommunityFeed,
    readCommunityFeedPosts,
    () => EMPTY_FEED_SNAPSHOT,
  );

  const authoredPosts = useMemo(() => {
    if (!profile) return [];
    const name = fullName(profile);
    const slug = toClientProfileSlug(name);
    const seedPosts = clientProfileSeedPosts.filter(
      (post) => toClientProfileSlug(post.author) === slug,
    );
    const dynamicPosts = dynamicFeedPosts.filter(
      (post) => toClientProfileSlug(post.author) === slug,
    );
    return mergeCommunityFeedPosts([...seedPosts, ...dynamicPosts]);
  }, [dynamicFeedPosts, profile]);

  const handleEdit = () => {
    if (!profile) return;
    setEditFields({ nombre: profile.nombre, apellido: profile.apellido, telefono: profile.telefono });
    setSaveError(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaveError(false);
    const result = await updateClientProfile({
      nombre: editFields.nombre.trim() || profile.nombre,
      apellido: editFields.apellido.trim() || profile.apellido,
      telefono: editFields.telefono.trim() || profile.telefono,
    });
    if (result) {
      setProfile(result);
      setIsEditing(false);
    } else {
      setSaveError(true);
    }
    setSaving(false);
  };

  const displayName = profile ? fullName(profile) : "—";
  const initials = profile ? getInitials(profile.nombre, profile.apellido) : "US";

  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de usuario" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <ClientInfoCard
            eyebrow="PERFIL CLIENTE"
            title={displayName}
            description="Tu perfil dentro de la comunidad cliente de TechMarket."
          >
            <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
              <div className="flex items-center justify-between gap-3">
                <span>ID</span>
                <strong className="font-mono text-cyan-50">{profile?.id ?? "—"}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Telefono</span>
                <strong className="text-cyan-50">{profile?.telefono ?? "—"}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Publicaciones</span>
                <strong className="text-cyan-50">{authoredPosts.length}</strong>
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] text-cyan-200/45">
              GET /api/clients/profile
            </p>
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
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                      Perfil de usuario
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                      {displayName}
                    </h1>
                    <p className="mt-2 text-sm text-cyan-100/80">{profile?.email ?? "—"}</p>
                  </div>
                </div>

                {loading && (
                  <p className="mt-5 text-sm text-cyan-100/60">
                    Cargando perfil desde la API...
                  </p>
                )}
                {apiError && !loading && (
                  <p className="mt-5 text-sm text-cyan-100/60">
                    No se pudo conectar con la API en{" "}
                    <span className="font-mono text-cyan-200">localhost:8082</span>.
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">
                  Informacion general
                </p>
                <div className="mt-4 space-y-2">
                  <div className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                    ID: <span className="font-mono">{profile?.id ?? "—"}</span>
                  </div>
                  <div className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                    Email: {profile?.email ?? "—"}
                  </div>
                  <div className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                    Telefono: {profile?.telefono ?? "—"}
                  </div>
                </div>
                <p className="mt-4 font-mono text-[10px] text-cyan-200/45">
                  GET /api/clients/profile
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">
                  Perfil editable
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">Gestiona tus datos</h2>
                <p className="mt-1 font-mono text-[10px] text-cyan-200/45">
                  PUT /api/clients/profile
                </p>
              </div>
              {!isEditing && profile && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/18"
                >
                  Editar perfil
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="mt-5 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs text-cyan-100/75" htmlFor="profile-nombre">
                    Nombre
                  </label>
                  <input
                    id="profile-nombre"
                    value={editFields.nombre}
                    onChange={(e) =>
                      setEditFields((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                    className="auth-input mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-cyan-100/75" htmlFor="profile-apellido">
                    Apellido
                  </label>
                  <input
                    id="profile-apellido"
                    value={editFields.apellido}
                    onChange={(e) =>
                      setEditFields((prev) => ({ ...prev, apellido: e.target.value }))
                    }
                    className="auth-input mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-cyan-100/75" htmlFor="profile-telefono">
                    Telefono
                  </label>
                  <input
                    id="profile-telefono"
                    value={editFields.telefono}
                    onChange={(e) =>
                      setEditFields((prev) => ({ ...prev, telefono: e.target.value }))
                    }
                    className="auth-input mt-1"
                  />
                </div>

                {saveError && (
                  <p className="text-xs text-red-300/90 md:col-span-2">
                    No se pudo guardar. Verifica que la API este disponible en{" "}
                    <span className="font-mono">localhost:8082</span>.
                  </p>
                )}

                <div className="flex justify-end gap-2 md:col-span-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="tech-button tech-button-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-4 text-sm text-cyan-100/78">
                {profile
                  ? "Tus cambios se envian directamente a la API de TechMarket."
                  : "Carga el perfil para poder editar tus datos."}
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">
                  Publicaciones
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Todas las publicaciones de {displayName}
                </h2>
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
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-56 w-full object-cover"
                          loading="lazy"
                        />
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
