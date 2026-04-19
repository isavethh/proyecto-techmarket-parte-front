"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ClientInfoCard,
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../components/ClientPageSections";
import {
  createCommunity,
  CURRENT_CLIENT_USER,
  isCurrentUserMember,
  joinCommunity,
  readCommunityCatalog,
  readCommunityPosts,
  subscribeCommunityStore,
} from "../../lib/communities";

const EMPTY_COMMUNITIES = [];
const EMPTY_POSTS = [];

const communityFocusOptions = [
  "PC Building",
  "iPhones",
  "Comparaciones",
  "Android",
  "Gaming",
  "Redes",
  "Seguridad",
  "Productividad",
];

const formatDateTime = (iso: string) => {
  const parsed = Date.parse(iso);

  if (Number.isNaN(parsed)) {
    return "Reciente";
  }

  const date = new Date(parsed);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month} ${hours}:${minutes}`;
};

export default function ComunidadesPage() {
  const router = useRouter();
  const communities = useSyncExternalStore(
    subscribeCommunityStore,
    readCommunityCatalog,
    () => EMPTY_COMMUNITIES,
  );
  const posts = useSyncExternalStore(subscribeCommunityStore, readCommunityPosts, () => EMPTY_POSTS);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityFocus, setCommunityFocus] = useState(communityFocusOptions[0]);
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityImage, setCommunityImage] = useState<string | undefined>(undefined);
  const [communityImageName, setCommunityImageName] = useState("");

  const postCountBySlug = useMemo(() => {
    return posts.reduce<Record<string, number>>((accumulator, post) => {
      accumulator[post.communitySlug] = (accumulator[post.communitySlug] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [posts]);

  const orderedCommunities = useMemo(
    () =>
      [...communities].sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      }),
    [communities],
  );

  const resetCreateCommunityForm = () => {
    setCommunityName("");
    setCommunityFocus(communityFocusOptions[0]);
    setCommunityDescription("");
    setCommunityImage(undefined);
    setCommunityImageName("");
  };

  const handleCreateImage = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      setCommunityImage(undefined);
      setCommunityImageName("");
      return;
    }

    setCommunityImageName(selectedImage.name);
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        setCommunityImage(fileReader.result);
      }
    };

    fileReader.readAsDataURL(selectedImage);
  };

  const handleCreateCommunity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const createdCommunity = createCommunity({
      name: communityName,
      focus: communityFocus,
      description: communityDescription,
      coverImage: communityImage,
    });

    if (!createdCommunity) {
      return;
    }

    resetCreateCommunityForm();
    setShowCreateModal(false);
    router.push(`/cliente/comunidades/${createdCommunity.slug}`);
  };

  const handleJoinCommunity = (slug: string, communityNameValue: string) => {
    const confirmed = window.confirm(
      `Quieres ingresar a ${communityNameValue}? Al entrar podras publicar y participar en toda la comunidad.`,
    );

    if (!confirmed) {
      return;
    }

    joinCommunity(slug);
  };

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Comunidades" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <ClientInfoCard
            eyebrow="COMUNIDADES"
            title="Encuentra tu grupo tech ideal"
            description="Unete a comunidades enfocadas en temas especificos como PC Building, iPhones, Android, comparaciones y mas."
          >
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 w-full rounded-xl border border-cyan-100/15 bg-cyan-300/12 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:border-cyan-300/45 hover:bg-cyan-300/20"
            >
              Crear nueva comunidad
            </button>
          </ClientInfoCard>

          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Tu estado</p>
            <div className="mt-3 rounded-2xl border border-cyan-100/15 bg-slate-950/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cliente actual</p>
              <p className="mt-2 text-base font-semibold text-cyan-50">{CURRENT_CLIENT_USER.name}</p>
              <p className="mt-1 text-sm text-cyan-100/75">{CURRENT_CLIENT_USER.city}</p>
              <p className="mt-3 text-xs text-cyan-100/70">
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
        </aside>

        <section className="space-y-4">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">DESCUBRIMIENTO</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Comunidades activas</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              Entra como visitante para explorar contenido. Al unirte desbloqueas publicaciones y participacion
              completa.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {orderedCommunities.map((community) => {
              const joined = isCurrentUserMember(community);
              const postCount = postCountBySlug[community.slug] ?? 0;

              return (
                <article
                  key={community.slug}
                  className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25"
                >
                  {community.coverImage ? (
                    <img src={community.coverImage} alt={community.name} className="h-44 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-cyan-300/25 via-blue-500/20 to-slate-950/70" />
                  )}

                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full border border-cyan-100/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/85">
                        {community.focus}
                      </span>
                      <span className="rounded-full border px-3 py-1 text-xs font-semibold text-cyan-50 border-cyan-100/20 bg-white/5">
                        {joined ? "Miembro" : "Visitante"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-white">{community.name}</h3>
                    <p className="mt-2 text-sm text-cyan-100/80">{community.description}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl border border-cyan-100/10 bg-slate-950/25 px-2 py-2 text-cyan-100/75">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/60">Miembros</p>
                        <p className="mt-1 font-semibold text-cyan-50">{community.members.length}</p>
                      </div>
                      <div className="rounded-xl border border-cyan-100/10 bg-slate-950/25 px-2 py-2 text-cyan-100/75">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/60">Posts</p>
                        <p className="mt-1 font-semibold text-cyan-50">{postCount}</p>
                      </div>
                      <div className="rounded-xl border border-cyan-100/10 bg-slate-950/25 px-2 py-2 text-cyan-100/75">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/60">Creada</p>
                        <p className="mt-1 font-semibold text-cyan-50">{formatDateTime(community.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/cliente/comunidades/${community.slug}`}
                        className="flex-1 rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-center text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                      >
                        Abrir comunidad
                      </Link>
                      {!joined ? (
                        <button
                          type="button"
                          onClick={() => handleJoinCommunity(community.slug, community.name)}
                          className="rounded-xl border border-cyan-100/20 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
                        >
                          Unirme
                        </button>
                      ) : (
                        <span className="rounded-xl border border-emerald-300/35 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100">
                          Acceso completo
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </section>
      </main>

      <AnimatePresence>
        {showCreateModal ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setShowCreateModal(false);
              }
            }}
          >
            <motion.form
              onSubmit={handleCreateCommunity}
              className="chat-scrollbar max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-100/20 bg-[linear-gradient(175deg,rgba(9,30,53,0.98),rgba(5,18,35,0.98))] p-5 shadow-2xl shadow-slate-950/60 md:p-6"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.9 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/70">NUEVA COMUNIDAD</p>
                  <h3 className="mt-2 text-2xl font-semibold text-cyan-50">Crea tu propio grupo</h3>
                  <p className="mt-2 text-sm text-cyan-100/75">
                    Define un tema claro y convoca personas interesadas en ese mismo foco.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100/80"
                >
                  Cerrar
                </button>
              </div>

              <label className="mt-5 block text-sm font-semibold text-cyan-50" htmlFor="community-name">
                Nombre de la comunidad
              </label>
              <input
                id="community-name"
                value={communityName}
                onChange={(event) => setCommunityName(event.target.value)}
                placeholder="Ejemplo: Comunidad de PC Building Bolivia"
                className="auth-input mt-2"
              />

              <label className="mt-5 block text-sm font-semibold text-cyan-50" htmlFor="community-focus">
                Tema principal
              </label>
              <select
                id="community-focus"
                value={communityFocus}
                onChange={(event) => setCommunityFocus(event.target.value)}
                className="auth-select mt-2"
              >
                {communityFocusOptions.map((focusOption) => (
                  <option key={focusOption} value={focusOption}>
                    {focusOption}
                  </option>
                ))}
              </select>

              <label className="mt-5 block text-sm font-semibold text-cyan-50" htmlFor="community-description">
                Descripcion
              </label>
              <textarea
                id="community-description"
                value={communityDescription}
                onChange={(event) => setCommunityDescription(event.target.value)}
                placeholder="Explica en que se enfoca la comunidad y para quien esta pensada."
                rows={4}
                className="auth-input mt-2 min-h-[110px] resize-y"
              />
              <p className="mt-2 text-xs text-cyan-100/65">Minimo 20 caracteres.</p>

              <label className="mt-5 block text-sm font-semibold text-cyan-50" htmlFor="community-image">
                Imagen de portada
              </label>
              <div className="mt-2 rounded-2xl border border-cyan-100/15 bg-slate-950/30 p-3">
                <input
                  id="community-image"
                  type="file"
                  accept="image/*"
                  onChange={handleCreateImage}
                  className="block w-full text-xs text-cyan-100/80 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-300/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50"
                />
                {communityImageName ? (
                  <p className="mt-2 text-xs text-cyan-100/70">Archivo: {communityImageName}</p>
                ) : null}
              </div>

              {communityImage ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100/15">
                  <img src={communityImage} alt="Vista previa de portada" className="h-48 w-full object-cover" />
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetCreateCommunityForm();
                    setShowCreateModal(false);
                  }}
                  className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={communityName.trim().length < 4 || communityDescription.trim().length < 20}
                  className="tech-button tech-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Crear comunidad
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
