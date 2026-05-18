"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../../components/ClientPageSections";
import { PublicationActionButton } from "../../../components/PublicationCard";
import ClientSidebar from "../../ClientSidebar";
import {
  ClientCommunity,
  ClientCommunityMember,
  ClientCommunityPost,
  ClientCommunityPostComment,
  createClientCommunityPost,
  createCommunityPostComment,
  demoteCommunityMember,
  getClientCommunityDetail,
  joinClientCommunity,
  kickCommunityMember,
  leaveClientCommunity,
  likeCommunityPost,
  listClientCommunityMembers,
  listClientCommunityPosts,
  listCommunityPostComments,
  promoteCommunityMember,
  unlikeCommunityPost,
} from "../../../../lib/api/iaApi";

const coverImages = [
  "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
];

const rules = [
  "Respeta opiniones técnicas aunque no coincidan con tu setup.",
  "Publica especificaciones completas cuando pidas ayuda.",
  "No se permite spam comercial fuera de hilos autorizados.",
];

const tagFor = (name: string): string => {
  const normalized = name.toLowerCase();
  if (normalized.includes("pc") || normalized.includes("armadores")) return "PC Building";
  if (normalized.includes("soporte") || normalized.includes("tecnico")) return "Soporte";
  if (normalized.includes("red")) return "Redes";
  if (normalized.includes("gam")) return "Gaming";
  return "TechMarket";
};

const coverFor = (name: string): string => {
  const normalized = name.toLowerCase();
  if (normalized.includes("pc") || normalized.includes("armadores")) return coverImages[0];
  if (normalized.includes("soporte") || normalized.includes("tecnico")) return coverImages[1];
  if (normalized.includes("red")) return coverImages[2];
  return coverImages[0];
};

const formatPostTime = (iso: string | null | undefined): string => {
  if (!iso) return "Ahora";
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMinutes < 1) return "Hace un instante";
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "—";
  }
};

const initialsFor = (name: string): string => {
  if (!name) return "U";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
};

const roleLabel = (rol: string): string => {
  if (rol === "ADMIN") return "Administrador";
  if (rol === "MODERATOR") return "Moderador";
  return "Miembro";
};

const roleBadgeClass = (rol: string): string => {
  if (rol === "ADMIN") return "border-amber-300/45 bg-amber-400/15 text-amber-100";
  if (rol === "MODERATOR") return "border-violet-300/45 bg-violet-400/15 text-violet-100";
  return "border-cyan-100/20 bg-white/5 text-cyan-100/85";
};

export default function CommunityDetailPage() {
  const params = useParams<{ slug: string }>();
  const communityId = useMemo(
    () => (Array.isArray(params.slug) ? params.slug[0] : params.slug),
    [params.slug],
  );

  const [community, setCommunity] = useState<ClientCommunity | null>(null);
  const [posts, setPosts] = useState<ClientCommunityPost[]>([]);
  const [members, setMembers] = useState<ClientCommunityMember[]>([]);
  const [draftPost, setDraftPost] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionTone, setActionTone] = useState<"success" | "error">("success");
  const [isPosting, setIsPosting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [memberBusyId, setMemberBusyId] = useState<string | null>(null);

  // Estado de likes y comentarios por post
  const [postBusyId, setPostBusyId] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, ClientCommunityPostComment[]>>({});
  const [commentDraftByPost, setCommentDraftByPost] = useState<Record<string, string>>({});
  const [commentBusyPostId, setCommentBusyPostId] = useState<string | null>(null);

  const currentMember = useMemo(
    () => members.find((m) => m.esMiUsuario) ?? null,
    [members],
  );
  const myRole = currentMember?.rol ?? "NONE";
  const canModerate = myRole === "ADMIN" || myRole === "MODERATOR";

  const loadAll = async () => {
    if (!communityId) return;
    setIsLoading(true);
    setError(null);

    const [detailResult, postsResult, membersResult] = await Promise.allSettled([
      getClientCommunityDetail(communityId),
      listClientCommunityPosts(communityId),
      listClientCommunityMembers(communityId),
    ]);

    if (detailResult.status === "fulfilled") {
      setCommunity(detailResult.value);
    } else {
      console.warn("No se pudo cargar detalle de comunidad", detailResult.reason);
      setCommunity((current) =>
        current ?? {
          id: communityId,
          nombre: communityId,
          descripcion: null,
          miembros: 0,
          unido: false,
          creadoEn: null,
        },
      );
    }

    if (postsResult.status === "fulfilled") {
      setPosts(postsResult.value);
    } else {
      console.warn("No se pudieron cargar publicaciones", postsResult.reason);
      setPosts([]);
    }

    if (membersResult.status === "fulfilled") {
      setMembers(membersResult.value);
    } else {
      console.warn("No se pudieron cargar miembros", membersResult.reason);
      setMembers([]);
    }

    if (
      detailResult.status === "rejected" &&
      postsResult.status === "rejected" &&
      membersResult.status === "rejected"
    ) {
      const reason = detailResult.reason;
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo conectar con la API de comunidades.",
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = window.setTimeout(() => setActionMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [actionMessage]);

  const refreshMembers = async () => {
    if (!community) return;
    try {
      const updated = await listClientCommunityMembers(community.id);
      setMembers(updated);
    } catch (err) {
      console.warn("No se pudieron refrescar miembros", err);
    }
  };

  const showToast = (message: string, tone: "success" | "error" = "success") => {
    setActionMessage(message);
    setActionTone(tone);
  };

  const handleJoinToggle = async () => {
    if (!community || isJoining) return;
    setIsJoining(true);
    try {
      if (community.unido) {
        await leaveClientCommunity(community.id);
        setCommunity((current) =>
          current
            ? { ...current, unido: false, miembros: Math.max(0, current.miembros - 1) }
            : current,
        );
        showToast(`Saliste de ${community.nombre}`);
        await refreshMembers();
      } else {
        const response = await joinClientCommunity(community.id);
        setCommunity((current) =>
          current ? { ...current, unido: true, miembros: current.miembros + 1 } : current,
        );
        showToast(response.mensaje ?? `Te uniste a ${community.nombre}`);
        await refreshMembers();
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Acción no completada", "error");
    } finally {
      setIsJoining(false);
    }
  };

  const handlePublishPost = async () => {
    if (!community || isPosting) return;
    const trimmedContent = draftPost.trim();
    if (trimmedContent.length < 2) {
      showToast("Escribí un mensaje un poco más completo.", "error");
      return;
    }

    setIsPosting(true);
    try {
      const created = await createClientCommunityPost(community.id, {
        titulo: draftTitle.trim() || undefined,
        contenido: trimmedContent,
      });
      setPosts((current) => [created, ...current]);
      setDraftPost("");
      setDraftTitle("");
      showToast("Publicación creada");

      if (!community.unido) {
        setCommunity((current) =>
          current ? { ...current, unido: true, miembros: current.miembros + 1 } : current,
        );
        await refreshMembers();
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "No se pudo publicar", "error");
    } finally {
      setIsPosting(false);
    }
  };

  // ─── Roles y kick ──────────────────────────────────────

  const handlePromote = async (member: ClientCommunityMember) => {
    if (!community || memberBusyId) return;
    setMemberBusyId(member.id);
    try {
      await promoteCommunityMember(community.id, member.id);
      showToast(`${member.nombre} ahora es moderador`);
      await refreshMembers();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "No se pudo promover", "error");
    } finally {
      setMemberBusyId(null);
    }
  };

  const handleDemote = async (member: ClientCommunityMember) => {
    if (!community || memberBusyId) return;
    setMemberBusyId(member.id);
    try {
      await demoteCommunityMember(community.id, member.id);
      showToast(`${member.nombre} ya no es moderador`);
      await refreshMembers();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "No se pudo degradar", "error");
    } finally {
      setMemberBusyId(null);
    }
  };

  const handleKick = async (member: ClientCommunityMember) => {
    if (!community || memberBusyId) return;
    if (!window.confirm(`¿Expulsar a ${member.nombre} de la comunidad?`)) return;
    setMemberBusyId(member.id);
    try {
      await kickCommunityMember(community.id, member.id);
      showToast(`${member.nombre} fue expulsado`);
      setCommunity((current) =>
        current ? { ...current, miembros: Math.max(0, current.miembros - 1) } : current,
      );
      await refreshMembers();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "No se pudo expulsar", "error");
    } finally {
      setMemberBusyId(null);
    }
  };

  // ─── Likes ──────────────────────────────────────

  const handleToggleLike = async (post: ClientCommunityPost) => {
    if (!community || postBusyId) return;
    setPostBusyId(post.id);
    try {
      const updated = post.meGusta
        ? await unlikeCommunityPost(community.id, post.id)
        : await likeCommunityPost(community.id, post.id);
      setPosts((current) => current.map((p) => (p.id === post.id ? updated : p)));
    } catch (err) {
      showToast(err instanceof Error ? err.message : "No se pudo actualizar el like", "error");
    } finally {
      setPostBusyId(null);
    }
  };

  // ─── Comentarios ──────────────────────────────────────

  const handleToggleComments = async (post: ClientCommunityPost) => {
    if (!community) return;
    const willExpand = expandedPostId !== post.id;
    setExpandedPostId(willExpand ? post.id : null);

    if (willExpand && !commentsByPost[post.id]) {
      try {
        const comments = await listCommunityPostComments(community.id, post.id);
        setCommentsByPost((current) => ({ ...current, [post.id]: comments }));
      } catch (err) {
        console.warn("No se pudieron cargar comentarios", err);
        setCommentsByPost((current) => ({ ...current, [post.id]: [] }));
      }
    }
  };

  const handleSubmitComment = async (post: ClientCommunityPost) => {
    if (!community || commentBusyPostId) return;
    const draft = (commentDraftByPost[post.id] ?? "").trim();
    if (draft.length < 1) return;

    setCommentBusyPostId(post.id);
    try {
      const newComment = await createCommunityPostComment(community.id, post.id, {
        contenido: draft,
      });
      setCommentsByPost((current) => ({
        ...current,
        [post.id]: [...(current[post.id] ?? []), newComment],
      }));
      setCommentDraftByPost((current) => ({ ...current, [post.id]: "" }));
      setPosts((current) =>
        current.map((p) =>
          p.id === post.id ? { ...p, comentarios: (p.comentarios ?? 0) + 1 } : p,
        ),
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "No se pudo comentar", "error");
    } finally {
      setCommentBusyPostId(null);
    }
  };

  // ─── Render ──────────────────────────────────────

  const communityName = community?.nombre ?? communityId;
  const visualTag = tagFor(communityName);
  const visualCover = coverFor(communityName);

  const sortedMembers = useMemo(() => {
    const rolePriority = (rol: string) => (rol === "ADMIN" ? 0 : rol === "MODERATOR" ? 1 : 2);
    return [...members].sort((a, b) => {
      const diff = rolePriority(a.rol) - rolePriority(b.rol);
      if (diff !== 0) return diff;
      return a.nombre.localeCompare(b.nombre);
    });
  }, [members]);

  const visibleMembers = showAllMembers ? sortedMembers : sortedMembers.slice(0, 6);

  type MemberAction = "promote" | "demote" | "kick";

  const canActOnMember = (member: ClientCommunityMember): MemberAction[] | null => {
    if (member.esMiUsuario) return null;
    const targetRole = member.rol;

    if (myRole === "ADMIN") {
      const actions: MemberAction[] = [];
      if (targetRole === "MEMBER") actions.push("promote", "kick");
      else if (targetRole === "MODERATOR") actions.push("demote", "kick");
      // Otro ADMIN: el backend ya bloquea kick a admin
      return actions;
    }

    if (myRole === "MODERATOR") {
      // Moderador solo puede kickear MEMBER
      if (targetRole === "MEMBER") return ["kick"];
      return null;
    }

    return null;
  };

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader sectionLabel="Comunidades" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-120px)] lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <aside className="chat-scrollbar min-w-0 space-y-4 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
          <ClientSidebar contextCard={false} />

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">COMUNIDAD</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">{communityName}</h1>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              {community?.descripcion ??
                "Comunidad activa para compartir dudas, comparaciones y recomendaciones tecnológicas."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                {visualTag}
              </span>
              <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100">
                {community?.miembros ?? 0} miembros
              </span>
              {community?.unido ? (
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${roleBadgeClass(myRole)}`}
                >
                  ✓ {roleLabel(myRole)}
                </span>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => void handleJoinToggle()}
              disabled={isJoining || !community}
              className={`mt-4 w-full rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                community?.unido
                  ? "border-rose-400/30 bg-rose-500/12 text-rose-200 hover:bg-rose-500/20"
                  : "border-cyan-200/35 bg-cyan-300/20 text-cyan-50 hover:bg-cyan-300/30"
              }`}
            >
              {isJoining
                ? "Procesando..."
                : community?.unido
                  ? "Salir de la comunidad"
                  : "Unirme a la comunidad"}
            </button>
          </section>

          <section className="tech-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-cyan-50">Miembros</p>
              <span className="rounded-full border border-cyan-100/15 bg-white/5 px-2 py-0.5 text-[11px] text-cyan-100/85">
                {members.length}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-cyan-100/70">
              {canModerate
                ? "Como " + roleLabel(myRole).toLowerCase() + " podés gestionar miembros."
                : "Personas activas en esta comunidad."}
            </p>
            <div className="mt-4 space-y-2">
              {sortedMembers.length === 0 ? (
                <p className="rounded-xl border border-dashed border-cyan-100/12 bg-slate-950/30 p-3 text-xs text-cyan-100/65">
                  Aún no hay miembros visibles.
                </p>
              ) : (
                visibleMembers.map((member) => {
                  const actions = canActOnMember(member);
                  const isBusy = memberBusyId === member.id;
                  return (
                    <div
                      key={member.id}
                      className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-[11px] font-bold text-slate-950">
                          {initialsFor(member.nombre)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-cyan-50">
                            {member.nombre}
                            {member.esMiUsuario ? (
                              <span className="ml-1 text-xs text-cyan-200/70">(tú)</span>
                            ) : null}
                          </p>
                          <span
                            className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${roleBadgeClass(member.rol)}`}
                          >
                            {roleLabel(member.rol)}
                          </span>
                        </div>
                      </div>

                      {actions && actions.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {actions.includes("promote") ? (
                            <button
                              type="button"
                              onClick={() => void handlePromote(member)}
                              disabled={isBusy}
                              className="rounded-lg border border-violet-300/30 bg-violet-400/12 px-2.5 py-1 text-[11px] font-semibold text-violet-100 transition hover:bg-violet-400/20 disabled:opacity-50"
                            >
                              ↑ Moderador
                            </button>
                          ) : null}
                          {actions.includes("demote") ? (
                            <button
                              type="button"
                              onClick={() => void handleDemote(member)}
                              disabled={isBusy}
                              className="rounded-lg border border-cyan-100/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-cyan-100/85 transition hover:bg-white/10 disabled:opacity-50"
                            >
                              ↓ Degradar
                            </button>
                          ) : null}
                          {actions.includes("kick") ? (
                            <button
                              type="button"
                              onClick={() => void handleKick(member)}
                              disabled={isBusy}
                              className="rounded-lg border border-rose-400/30 bg-rose-500/12 px-2.5 py-1 text-[11px] font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-50"
                            >
                              ✕ Expulsar
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
              {sortedMembers.length > 6 ? (
                <button
                  type="button"
                  onClick={() => setShowAllMembers((current) => !current)}
                  className="w-full rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/85 transition hover:bg-cyan-100/10"
                >
                  {showAllMembers ? "Ver menos" : `Ver todos (${sortedMembers.length})`}
                </button>
              ) : null}
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
              <img src={visualCover} alt={communityName} className="h-full w-full object-cover" />
            </div>
            <div className="border-t border-cyan-100/10 p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">ENFOQUE</p>
                  <h2 className="mt-2 text-2xl font-semibold text-cyan-50">{communityName}</h2>
                </div>
                <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {visualTag}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/65">
                  Normas de convivencia
                </p>
                {rules.map((rule) => (
                  <p
                    key={rule}
                    className="rounded-xl border border-cyan-100/12 bg-slate-950/35 px-3 py-2 text-sm text-cyan-100/85"
                  >
                    • {rule}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {actionMessage ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                actionTone === "success"
                  ? "border-emerald-300/35 bg-emerald-500/12 text-emerald-100"
                  : "border-rose-400/35 bg-rose-500/12 text-rose-100"
              }`}
            >
              {actionMessage}
            </div>
          ) : null}

          <section className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.9),rgba(7,24,44,0.96))] p-5 shadow-xl shadow-slate-950/25">
            <p className="tech-mono text-xs text-cyan-200/75">NUEVA PUBLICACIÓN</p>
            <h3 className="mt-1 text-lg font-semibold text-cyan-50">
              Comparte algo en {communityName}
            </h3>
            <p className="mt-1 text-xs text-cyan-100/65">
              {community?.unido
                ? "Tu publicación aparecerá inmediatamente en el feed."
                : "Al publicar te uniremos automáticamente a la comunidad."}
            </p>
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="Título (opcional)"
              className="mt-4 w-full rounded-xl border border-cyan-100/15 bg-slate-950/45 px-4 py-2 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
            <textarea
              value={draftPost}
              onChange={(event) => setDraftPost(event.target.value)}
              placeholder="Comparte una idea, pregunta o comparación para la comunidad."
              rows={4}
              className="mt-3 w-full resize-y rounded-xl border border-cyan-100/15 bg-slate-950/45 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-cyan-100/55">{draftPost.length} caracteres</p>
              <button
                type="button"
                onClick={() => void handlePublishPost()}
                disabled={!draftPost.trim() || isPosting}
                className="rounded-xl border border-cyan-200/35 bg-cyan-400/25 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/35 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPosting ? "Publicando..." : "Publicar en comunidad"}
              </button>
            </div>
          </section>

          {isLoading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando publicaciones...</p>
            </section>
          ) : error ? (
            <section className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </section>
          ) : posts.length === 0 ? (
            <section className="tech-card flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-100/10 bg-cyan-400/10 text-2xl">
                💬
              </div>
              <p className="text-base font-semibold text-cyan-50">Aún no hay publicaciones</p>
              <p className="max-w-md text-sm text-cyan-100/70">
                Sé el primero en compartir algo en esta comunidad.
              </p>
            </section>
          ) : (
            <section className="space-y-4">
              {posts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                const postComments = commentsByPost[post.id] ?? [];
                const commentDraft = commentDraftByPost[post.id] ?? "";
                const isCommentBusy = commentBusyPostId === post.id;
                const isLikeBusy = postBusyId === post.id;

                return (
                  <article
                    key={post.id}
                    className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(180deg,rgba(8,28,52,0.96),rgba(7,24,44,0.98))] p-4 shadow-xl shadow-slate-950/20"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                        {initialsFor(post.autor)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm font-semibold text-cyan-50">{post.autor}</p>
                          <p className="text-xs text-cyan-100/65">{formatPostTime(post.creadoEn)}</p>
                        </div>
                        {post.titulo ? (
                          <h3 className="mt-3 text-base font-semibold text-cyan-50">
                            {post.titulo}
                          </h3>
                        ) : null}
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-cyan-100/88">
                          {post.contenido}
                        </p>

                        {/* Acciones del post */}
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-cyan-100/10 pt-3 text-xs">
                          <motion.button
                            type="button"
                            onClick={() => void handleToggleLike(post)}
                            disabled={isLikeBusy}
                            whileHover={{ y: -1.5, boxShadow: "0 14px 28px rgba(8, 145, 178, 0.18)" }}
                            whileTap={{ scale: 0.97 }}
                            animate={
                              post.meGusta
                                ? {
                                    scale: [1, 1.04, 1],
                                    boxShadow: [
                                      "0 0 0 rgba(34,211,238,0)",
                                      "0 0 24px rgba(34,211,238,0.45)",
                                      "0 0 12px rgba(34,211,238,0.25)",
                                    ],
                                  }
                                : { scale: 1, boxShadow: "0 0 0 rgba(34,211,238,0)" }
                            }
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`group relative overflow-hidden rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${
                              post.meGusta
                                ? "border-cyan-200/45 bg-cyan-300/20 text-cyan-50"
                                : "border-cyan-100/12 bg-white/5 text-cyan-100/90"
                            }`}
                          >
                            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.28),transparent_70%)]" />
                            <span className="relative z-10">
                              {post.meGusta ? "Te gusta" : "Me gusta"} · {post.likes ?? 0}
                            </span>
                          </motion.button>

                          <PublicationActionButton
                            onClick={() => void handleToggleComments(post)}
                            active={isExpanded}
                            accent="neutral"
                          >
                            Comentar · {post.comentarios ?? 0}
                          </PublicationActionButton>
                        </div>

                        {/* Sección de comentarios expandible */}
                        {isExpanded ? (
                          <div className="mt-4 space-y-3 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                            {postComments.length === 0 ? (
                              <p className="text-xs text-cyan-100/65">
                                Aún no hay comentarios. ¡Sé el primero!
                              </p>
                            ) : (
                              <ul className="space-y-2">
                                {postComments.map((comment) => (
                                  <li
                                    key={comment.id}
                                    className="flex items-start gap-2.5 rounded-xl border border-cyan-100/10 bg-slate-950/40 p-2.5"
                                  >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-[10px] font-bold text-slate-950">
                                      {initialsFor(comment.autor)}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <p className="text-xs font-semibold text-cyan-50">
                                          {comment.autor}
                                        </p>
                                        <p className="text-[10px] text-cyan-100/55">
                                          {formatPostTime(comment.creadoEn)}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-xs leading-5 text-cyan-100/88">
                                        {comment.contenido}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="flex gap-2">
                              <input
                                value={commentDraft}
                                onChange={(event) =>
                                  setCommentDraftByPost((current) => ({
                                    ...current,
                                    [post.id]: event.target.value,
                                  }))
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    void handleSubmitComment(post);
                                  }
                                }}
                                placeholder="Escribir un comentario..."
                                className="flex-1 rounded-xl border border-cyan-100/15 bg-slate-950/45 px-3 py-2 text-xs text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                              />
                              <button
                                type="button"
                                onClick={() => void handleSubmitComment(post)}
                                disabled={!commentDraft.trim() || isCommentBusy}
                                className="rounded-xl border border-cyan-200/35 bg-cyan-300/20 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/30 disabled:opacity-60"
                              >
                                {isCommentBusy ? "..." : "Enviar"}
                              </button>
                            </div>
                          </div>
                        ) : null}
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
