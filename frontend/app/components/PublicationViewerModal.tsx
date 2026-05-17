"use client";

import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const PUBLICATION_ENGAGEMENT_STORAGE_KEY = "techmarket.publication.engagement";
const CURRENT_CLIENT_NAME = "Cliente";

export type PublicationViewerComment = {
  id: string;
  author: string;
  text: string;
  time: string;
};

type PublicationEngagementSnapshot = {
  likeCount: number;
  likedByCurrentUser: boolean;
  comments: PublicationViewerComment[];
};

export type PublicationViewerData = {
  id: string;
  title: string;
  body: string;
  author: string;
  role?: string;
  location?: string;
  createdAt?: string;
  tag?: string;
  image?: string;
  variant?: "normal" | "sale";
  saleKind?: "producto" | "servicio";
  priceLabel?: string;
  conditionLabel?: string;
  categoryLabel?: string;
  initialLikeCount?: number;
  initiallyLiked?: boolean;
  initialComments?: PublicationViewerComment[];
};

type PublicationViewerModalProps = {
  publication: PublicationViewerData | null;
  onClose: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  onEngagementChange?: (publicationId: string, snapshot: PublicationEngagementSnapshot) => void;
};

const readEngagementStore = (): Record<string, PublicationEngagementSnapshot> => {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = window.localStorage.getItem(PUBLICATION_ENGAGEMENT_STORAGE_KEY);

  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed as Record<string, PublicationEngagementSnapshot>;
  } catch {
    return {};
  }
};

const writeEngagementStore = (store: Record<string, PublicationEngagementSnapshot>) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PUBLICATION_ENGAGEMENT_STORAGE_KEY, JSON.stringify(store));
};

const normalizeInitialSnapshot = (publication: PublicationViewerData): PublicationEngagementSnapshot => ({
  likeCount: Math.max(0, publication.initialLikeCount ?? 0),
  likedByCurrentUser: Boolean(publication.initiallyLiked),
  comments: publication.initialComments ?? [],
});

const mergeComments = (
  initialComments: PublicationViewerComment[],
  storedComments: PublicationViewerComment[],
): PublicationViewerComment[] => {
  const byId = new Map<string, PublicationViewerComment>();

  [...initialComments, ...storedComments].forEach((comment) => {
    if (!byId.has(comment.id)) {
      byId.set(comment.id, comment);
    }
  });

  return [...byId.values()];
};

type PublicationViewerCardProps = {
  publication: PublicationViewerData;
  initialSnapshot: PublicationEngagementSnapshot;
  onClose: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  onEngagementChange?: (publicationId: string, snapshot: PublicationEngagementSnapshot) => void;
};

function PublicationViewerCard({
  publication,
  initialSnapshot,
  onClose,
  secondaryActionLabel,
  onSecondaryAction,
  onEngagementChange,
}: PublicationViewerCardProps) {
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(initialSnapshot.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(initialSnapshot.likeCount);
  const [comments, setComments] = useState<PublicationViewerComment[]>(initialSnapshot.comments);
  const [draftComment, setDraftComment] = useState("");
  const hasSyncedInitialSnapshotRef = useRef(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const persistSnapshot = (snapshot: PublicationEngagementSnapshot) => {
    const currentStore = readEngagementStore();
    const nextStore = {
      ...currentStore,
      [publication.id]: snapshot,
    };

    writeEngagementStore(nextStore);
    onEngagementChange?.(publication.id, snapshot);
  };

  useEffect(() => {
    if (hasSyncedInitialSnapshotRef.current) {
      return;
    }

    hasSyncedInitialSnapshotRef.current = true;
    onEngagementChange?.(publication.id, initialSnapshot);
  }, [initialSnapshot, onEngagementChange, publication.id]);

  const handleToggleLike = () => {
    const nextLiked = !likedByCurrentUser;
    const nextLikeCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    const nextSnapshot: PublicationEngagementSnapshot = {
      likeCount: nextLikeCount,
      likedByCurrentUser: nextLiked,
      comments,
    };

    setLikedByCurrentUser(nextLiked);
    setLikeCount(nextLikeCount);
    persistSnapshot(nextSnapshot);
  };

  const handleSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedBody = draftComment.trim();

    if (normalizedBody.length < 3) {
      return;
    }

    const nextComment: PublicationViewerComment = {
      id: `${publication.id}-modal-comment-${Date.now()}`,
      author: CURRENT_CLIENT_NAME,
      text: normalizedBody,
      time: "Ahora",
    };

    const nextComments = [...comments, nextComment];
    const nextSnapshot: PublicationEngagementSnapshot = {
      likeCount,
      likedByCurrentUser,
      comments: nextComments,
    };

    setComments(nextComments);
    setDraftComment("");
    persistSnapshot(nextSnapshot);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.9 }}
      className="chat-scrollbar max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-100/20 bg-[linear-gradient(170deg,rgba(10,33,57,0.97),rgba(4,18,34,0.98))] p-5 shadow-2xl shadow-slate-950/60 md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="tech-mono text-xs text-cyan-200/70">
            {publication.variant === "sale"
              ? `ANUNCIO DE ${publication.saleKind === "servicio" ? "SERVICIO" : "PRODUCTO"}`
              : "PUBLICACION"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-cyan-50">{publication.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100/80"
        >
          Cerrar
        </button>
      </div>

      {publication.variant === "sale" ? (
        <div className="mt-4 rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-4">
          <p className="text-2xl font-bold text-cyan-50">{publication.priceLabel ?? "Precio por inbox"}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {publication.categoryLabel ? (
              <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-cyan-50">
                {publication.categoryLabel}
              </span>
            ) : null}
            {publication.conditionLabel ? (
              <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-cyan-100/85">
                {publication.conditionLabel}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {publication.image ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100/12">
          <img
            src={publication.image}
            alt={publication.title}
            className="max-h-[360px] w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/30 p-4">
        <p className="text-sm font-semibold text-cyan-50">{publication.author}</p>
        <p className="mt-1 text-xs text-cyan-200/75">
          {[publication.role, publication.location, publication.createdAt].filter(Boolean).join(" · ")}
        </p>
        {publication.tag ? <p className="mt-2 text-xs text-cyan-100/75">Etiqueta: {publication.tag}</p> : null}
      </div>

      <p className="mt-4 text-sm leading-7 text-cyan-100/88">{publication.body}</p>

      <section className="mt-5 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4">
        <div className="flex items-center justify-between text-xs text-cyan-200/75">
          <p>{likeCount} me gusta</p>
          <p>{comments.length} comentarios</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            onClick={handleToggleLike}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              likedByCurrentUser
                ? "border-cyan-200/45 bg-cyan-300/20 text-cyan-50"
                : "border-cyan-100/15 bg-white/5 text-cyan-100/90 hover:bg-cyan-300/10"
            }`}
          >
            {likedByCurrentUser ? "Te gusta" : "Me gusta"}
          </motion.button>

          <button
            type="button"
            onClick={() => commentInputRef.current?.focus()}
            className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-sm font-semibold text-cyan-100/90 transition hover:bg-white/10"
          >
            Comentar
          </button>
        </div>

        <form onSubmit={handleSubmitComment} className="mt-3 space-y-2">
          <textarea
            ref={commentInputRef}
            value={draftComment}
            onChange={(event) => setDraftComment(event.target.value)}
            rows={3}
            placeholder="Escribe un comentario..."
            className="w-full resize-none rounded-2xl border border-cyan-100/12 bg-slate-950/45 px-3 py-2 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={draftComment.trim().length < 3}
              className="rounded-xl border border-cyan-200/25 bg-cyan-400/20 px-3 py-2 text-xs font-semibold text-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Publicar comentario
            </button>
          </div>
        </form>

        {comments.length > 0 ? (
          <div className="mt-3 space-y-2">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-cyan-50">{comment.author}</p>
                  <p className="text-[10px] text-cyan-200/70">{comment.time}</p>
                </div>
                <p className="mt-1 text-xs leading-5 text-cyan-100/85">{comment.text}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-cyan-100/70">
            Aun no hay comentarios. Se el primero en participar.
          </p>
        )}
      </section>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80"
        >
          Cerrar vista
        </button>
        {secondaryActionLabel ? (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-50"
          >
            {secondaryActionLabel}
          </button>
        ) : null}
      </div>
    </motion.article>
  );
}

export function PublicationViewerModal({
  publication,
  onClose,
  secondaryActionLabel,
  onSecondaryAction,
  onEngagementChange,
}: PublicationViewerModalProps) {
  const publicationSnapshot = useMemo(() => {
    if (!publication) {
      return null;
    }

    const initialSnapshot = normalizeInitialSnapshot(publication);
    const currentStore = readEngagementStore();
    const storedSnapshot = currentStore[publication.id];

    if (!storedSnapshot) {
      return initialSnapshot;
    }

    return {
      likeCount: Math.max(0, storedSnapshot.likeCount),
      likedByCurrentUser: storedSnapshot.likedByCurrentUser,
      comments: mergeComments(initialSnapshot.comments, storedSnapshot.comments ?? []),
    };
  }, [publication]);

  useEffect(() => {
    if (!publication) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, publication]);

  return (
    <AnimatePresence>
      {publication && publicationSnapshot ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <PublicationViewerCard
            key={publication.id}
            publication={publication}
            initialSnapshot={publicationSnapshot}
            onClose={onClose}
            secondaryActionLabel={secondaryActionLabel}
            onSecondaryAction={onSecondaryAction}
            onEngagementChange={onEngagementChange}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
