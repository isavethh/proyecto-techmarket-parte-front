"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClientPageHeader } from "../../../components/ClientPageSections";
import { PublicationActionButton, PublicationCard } from "../../../components/PublicationCard";
import {
  CommunityMemberRole,
  createCommunityPost,
  createCommunityPostReply,
  isCurrentUserMember,
  isCurrentUserLikedCommunityPost,
  joinCommunity,
  readCommunityCatalog,
  readCommunityPosts,
  subscribeCommunityStore,
  toggleCommunityPostLike,
} from "../../../lib/communities";

const EMPTY_COMMUNITIES = [];
const EMPTY_POSTS = [];

const roleLabel: Record<CommunityMemberRole, string> = {
  administrador: "Administrador",
  moderador: "Moderador",
  miembro: "Miembro",
};

const roleBadgeClass: Record<CommunityMemberRole, string> = {
  administrador: "border-amber-300/35 bg-amber-300/10 text-amber-100",
  moderador: "border-violet-300/35 bg-violet-300/12 text-violet-100",
  miembro: "border-cyan-100/20 bg-white/5 text-cyan-100/85",
};

const formatPostDate = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);

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

const rolePriority: Record<CommunityMemberRole, number> = {
  administrador: 0,
  moderador: 1,
  miembro: 2,
};

export default function CommunityDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const communities = useSyncExternalStore(
    subscribeCommunityStore,
    readCommunityCatalog,
    () => EMPTY_COMMUNITIES,
  );
  const allPosts = useSyncExternalStore(subscribeCommunityStore, readCommunityPosts, () => EMPTY_POSTS);

  const [dismissedJoinPrompts, setDismissedJoinPrompts] = useState<string[]>([]);
  const [draftPost, setDraftPost] = useState("");
  const [draftImage, setDraftImage] = useState<string | undefined>(undefined);
  const [draftImageName, setDraftImageName] = useState("");
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyDraftByPostId, setReplyDraftByPostId] = useState<Record<string, string>>({});
  const [auraLikePostId, setAuraLikePostId] = useState<string | null>(null);

  const community = useMemo(
    () => communities.find((item) => item.slug === slug),
    [communities, slug],
  );

  const isMember = useMemo(() => {
    if (!community) {
      return false;
    }

    return isCurrentUserMember(community);
  }, [community]);

  const showJoinPrompt = useMemo(() => {
    if (!community || isMember) {
      return false;
    }

    return !dismissedJoinPrompts.includes(community.slug);
  }, [community, dismissedJoinPrompts, isMember]);

  const orderedMembers = useMemo(() => {
    if (!community) {
      return [];
    }

    return [...community.members].sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);
  }, [community]);

  const fullPosts = useMemo(() => {
    return allPosts
      .filter((post) => post.communitySlug === slug)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [allPosts, slug]);

  const visiblePosts = isMember ? fullPosts : fullPosts.slice(0, 2);

  const resetPostForm = () => {
    setDraftPost("");
    setDraftImage(undefined);
    setDraftImageName("");
  };

  const openJoinPrompt = () => {
    if (!community) {
      return;
    }

    setDismissedJoinPrompts((current) =>
      current.filter((dismissedSlug) => dismissedSlug !== community.slug),
    );
  };

  const handleCommunityImage = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      setDraftImage(undefined);
      setDraftImageName("");
      return;
    }

    setDraftImageName(selectedImage.name);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        setDraftImage(fileReader.result);
      }
    };

    fileReader.readAsDataURL(selectedImage);
  };

  const handleJoinCommunity = () => {
    if (!community) {
      return;
    }

    joinCommunity(community.slug);
  };

  const handleLikePost = (postId: string, currentlyLiked: boolean) => {
    if (!isMember) {
      openJoinPrompt();
      return;
    }

    toggleCommunityPostLike(postId);

    if (!currentlyLiked) {
      setAuraLikePostId(postId);
      window.setTimeout(() => {
        setAuraLikePostId((current) => (current === postId ? null : current));
      }, 520);
    }
  };

  const handleReplyToggle = (postId: string) => {
    if (!isMember) {
      openJoinPrompt();
      return;
    }

    setActiveReplyPostId((current) => (current === postId ? null : postId));
  };

  const handleReplySubmit = (event: FormEvent<HTMLFormElement>, postId: string) => {
    event.preventDefault();

    if (!isMember) {
      openJoinPrompt();
      return;
    }

    const draftReply = (replyDraftByPostId[postId] ?? "").trim();

    if (draftReply.length < 3) {
      return;
    }

    const createdReply = createCommunityPostReply({
      postId,
      body: draftReply,
    });

    if (!createdReply) {
      return;
    }

    setReplyDraftByPostId((current) => ({
      ...current,
      [postId]: "",
    }));
    setActiveReplyPostId(null);
  };

  const handleCreatePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!community || !isMember) {
      return;
    }

    const createdPost = createCommunityPost({
      communitySlug: community.slug,
      body: draftPost,
      image: draftImage,
    });

    if (!createdPost) {
      return;
    }

    resetPostForm();
  };

  if (!community) {
    return (
      <div className="flex-1 pb-10">
        <ClientPageHeader sectionLabel="Comunidades" />

        <main className="mx-auto mt-8 w-full max-w-[900px] px-4 lg:px-6">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">COMUNIDAD</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50">Esta comunidad no existe</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Puede haber sido removida o nunca fue creada. Regresa al listado para entrar a otra comunidad.
            </p>
            <Link href="/cliente/comunidades" className="mt-4 inline-flex rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-50">
              Volver a comunidades
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel={community.focus} />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">COMUNIDAD</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">{community.name}</h1>
            <p className="mt-3 text-sm text-cyan-100/80">{community.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-100/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/85">
                {community.focus}
              </span>
              <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs text-cyan-100/85">
                {community.members.length} miembros
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs ${isMember ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100" : "border-cyan-100/20 bg-white/5 text-cyan-100/85"}`}>
                {isMember ? "Miembro activo" : "Modo visitante"}
              </span>
            </div>

            {!isMember ? (
              <button
                type="button"
                onClick={openJoinPrompt}
                className="mt-4 w-full rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
              >
                Quiero ingresar
              </button>
            ) : null}
          </section>

          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Miembros de la comunidad</p>
            <p className="mt-2 text-xs text-cyan-100/70">
              {isMember
                ? "Vista completa de miembros, incluyendo administrador y moderadores."
                : "Como visitante ves una muestra de miembros. Al ingresar veras la lista completa."}
            </p>
            <div className="mt-3 space-y-2">
              {(isMember ? orderedMembers : orderedMembers.slice(0, 4)).map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border border-cyan-100/12 bg-slate-950/30 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-cyan-50">{member.name}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${roleBadgeClass[member.role]}`}>
                      {roleLabel[member.role]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-cyan-100/70">{member.city}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="tech-card space-y-2">
            <Link href="/cliente/comunidades" className="auth-action block w-full">
              Ver todas las comunidades
            </Link>
            <Link href="/cliente" className="auth-action block w-full">
              Volver al feed
            </Link>
          </section>
        </aside>

        <section className="space-y-4">
          {community.coverImage ? (
            <article className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(160deg,rgba(12,39,68,0.95),rgba(6,23,43,0.96))] shadow-xl shadow-slate-950/35">
              <img src={community.coverImage} alt={community.name} className="h-52 w-full object-cover md:h-64" loading="lazy" />
              <div className="p-5 md:p-6">
                <p className="tech-mono text-xs text-cyan-200/75">ENFOQUE</p>
                <h2 className="mt-2 text-2xl font-semibold text-cyan-50">{community.focus}</h2>
                <ul className="mt-4 space-y-2 text-sm text-cyan-100/80">
                  {community.rules.map((rule) => (
                    <li key={rule} className="rounded-xl border border-cyan-100/10 bg-slate-950/30 px-3 py-2">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ) : null}

          {!isMember ? (
            <section className="tech-card border border-cyan-100/15">
              <p className="tech-mono text-xs text-cyan-200/75">MODO VISITANTE</p>
              <h3 className="mt-2 text-xl font-semibold text-cyan-50">Vista parcial habilitada</h3>
              <p className="mt-3 text-sm text-cyan-100/80">
                Puedes leer solo algunas publicaciones. Para publicar y ver el contenido completo debes ingresar a
                la comunidad.
              </p>
              <p className="mt-2 text-xs text-cyan-200/70">
                Como visitante no puedes reaccionar ni responder publicaciones.
              </p>
            </section>
          ) : (
            <section className="tech-card">
              <p className="tech-mono text-xs text-cyan-200/75">NUEVA PUBLICACION</p>
              <h3 className="mt-2 text-xl font-semibold text-cyan-50">Comparte algo en {community.name}</h3>

              <form onSubmit={handleCreatePost} className="mt-4 space-y-3">
                <textarea
                  value={draftPost}
                  onChange={(event) => setDraftPost(event.target.value)}
                  rows={4}
                  placeholder="Comparte una idea, pregunta o comparacion para la comunidad."
                  className="auth-input min-h-[110px] resize-y"
                />

                <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/30 p-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCommunityImage}
                    className="block w-full text-xs text-cyan-100/80 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-300/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50"
                  />
                  {draftImageName ? <p className="mt-2 text-xs text-cyan-100/70">Archivo: {draftImageName}</p> : null}
                </div>

                {draftImage ? (
                  <div className="overflow-hidden rounded-2xl border border-cyan-100/15">
                    <img src={draftImage} alt="Vista previa de publicacion" className="h-52 w-full object-cover" />
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={draftPost.trim().length < 8}
                    className="tech-button tech-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Publicar en comunidad
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="space-y-3">
            {visiblePosts.map((post) => {
              const likedByCurrentUser = isCurrentUserLikedCommunityPost(post);

              return (
                <PublicationCard
                  key={post.id}
                  className="bg-[linear-gradient(160deg,rgba(13,36,64,0.95),rgba(7,24,44,0.96))] shadow-lg shadow-slate-950/20"
                  header={
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-cyan-50">{post.authorName}</p>
                        <p className="text-xs text-cyan-100/70">{formatPostDate(post.createdAt)}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${roleBadgeClass[post.authorRole]}`}>
                        {roleLabel[post.authorRole]}
                      </span>
                    </div>
                  }
                  content={<p className="mt-3 text-sm leading-6 text-cyan-100/85">{post.body}</p>}
                  media={
                    post.image
                      ? {
                          src: post.image,
                          alt: "Publicacion de la comunidad",
                          wrapperClassName: "mt-3",
                          imageClassName: "h-52 w-full object-cover",
                        }
                      : undefined
                  }
                  actions={
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <motion.button
                        type="button"
                        onClick={() => handleLikePost(post.id, likedByCurrentUser)}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        animate={
                          likedByCurrentUser
                            ? {
                                scale: [1, 1.04, 1],
                                boxShadow: [
                                  "0 0 0 rgba(34,211,238,0)",
                                  "0 0 24px rgba(34,211,238,0.45)",
                                  "0 0 12px rgba(34,211,238,0.24)",
                                ],
                              }
                            : {
                                scale: 1,
                                boxShadow: "0 0 0 rgba(34,211,238,0)",
                              }
                        }
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className={`group relative overflow-hidden rounded-xl border px-3 py-2 font-semibold transition ${
                          likedByCurrentUser
                            ? "border-cyan-300/45 bg-cyan-300/18 text-cyan-50"
                            : "border-cyan-100/12 bg-cyan-300/10 text-cyan-100/90 hover:bg-cyan-300/15"
                        }`}
                      >
                        <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.3),transparent_70%)]" />
                        <AnimatePresence>
                          {auraLikePostId === post.id ? (
                            <motion.span
                              className="pointer-events-none absolute inset-0 rounded-xl bg-cyan-300/35"
                              initial={{ opacity: 0.55, scale: 0.8 }}
                              animate={{ opacity: 0, scale: 1.35 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          ) : null}
                        </AnimatePresence>
                        <span className="relative z-10">
                          {likedByCurrentUser ? "Te gusta" : "Me gusta"} ({post.likedByUserIds?.length ?? 0})
                        </span>
                      </motion.button>

                      <PublicationActionButton
                        onClick={() => handleReplyToggle(post.id)}
                        accent="neutral"
                      >
                        Responder ({post.replies?.length ?? 0})
                      </PublicationActionButton>
                    </div>
                  }
                  composer={
                    isMember && activeReplyPostId === post.id ? (
                      <form onSubmit={(event) => handleReplySubmit(event, post.id)} className="mt-3 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                        <textarea
                          value={replyDraftByPostId[post.id] ?? ""}
                          onChange={(event) =>
                            setReplyDraftByPostId((current) => ({
                              ...current,
                              [post.id]: event.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Escribe tu respuesta para esta publicacion"
                          className="auth-input min-h-[90px] resize-y"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyPostId(null)}
                            className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/80"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={(replyDraftByPostId[post.id] ?? "").trim().length < 3}
                            className="rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-xs font-semibold text-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Responder
                          </button>
                        </div>
                      </form>
                    ) : null
                  }
                  thread={
                    post.replies && post.replies.length > 0 ? (
                      <div className="mt-3 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                        <p className="text-xs font-semibold text-cyan-200/80">Respuestas</p>
                        {post.replies.map((reply) => (
                          <div key={reply.id} className="rounded-xl border border-cyan-100/10 bg-white/5 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-cyan-50">{reply.authorName}</p>
                              <p className="text-[10px] text-cyan-200/65">{formatPostDate(reply.createdAt)}</p>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-cyan-100/85">{reply.body}</p>
                          </div>
                        ))}
                      </div>
                    ) : null
                  }
                />
              );
            })}

            {!visiblePosts.length ? (
              <section className="tech-card">
                <p className="text-sm text-cyan-100/80">Aun no hay publicaciones en esta comunidad.</p>
              </section>
            ) : null}

            {!isMember && fullPosts.length > visiblePosts.length ? (
              <section className="tech-card">
                <p className="text-sm text-cyan-100/80">
                  Hay mas contenido disponible. Ingresa a la comunidad para ver todas las publicaciones y participar.
                </p>
              </section>
            ) : null}
          </section>
        </section>
      </main>

      <AnimatePresence>
        {showJoinPrompt && !isMember ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setDismissedJoinPrompts((current) => {
                  if (!community || current.includes(community.slug)) {
                    return current;
                  }

                  return [...current, community.slug];
                });
              }
            }}
          >
            <motion.div
              className="w-full max-w-lg rounded-3xl border border-cyan-100/20 bg-[linear-gradient(170deg,rgba(10,33,57,0.97),rgba(4,18,34,0.98))] p-5 shadow-2xl shadow-slate-950/50 md:p-6"
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.9 }}
            >
              <p className="tech-mono text-xs text-cyan-200/70">INGRESO A COMUNIDAD</p>
              <h3 className="mt-2 text-2xl font-semibold text-cyan-50">Quieres ingresar a {community.name}?</h3>
              <p className="mt-3 text-sm text-cyan-100/80">
                Al ingresar podras ver todo el contenido, publicar, comentar y aparecer como miembro activo.
              </p>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDismissedJoinPrompts((current) => {
                      if (current.includes(community.slug)) {
                        return current;
                      }

                      return [...current, community.slug];
                    })
                  }
                  className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80"
                >
                  Seguir como visitante
                </button>
                <button type="button" onClick={handleJoinCommunity} className="tech-button tech-button-primary">
                  Ingresar ahora
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
