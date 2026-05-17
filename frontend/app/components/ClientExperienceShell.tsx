"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { logout } from "@/lib/auth/authGuard";
import {
  ChangeEvent,
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CommunityFeedPost, upsertCommunityFeedPosts } from "../lib/communityFeed";

type ClientExperienceShellProps = {
  children: ReactNode;
};

type ClientTopbarControlsProps = {
  sectionLabel: string;
};

type ClientExperienceContextValue = {
  openPostModal: () => void;
};

const ClientExperienceContext = createContext<ClientExperienceContextValue | null>(null);

const CLIENT_PROFILE = {
  name: "Cliente",
  email: "cliente.test@techmarket.com",
  city: "Bolivia",
  account: "Cliente",
  initials: "US",
};

const buildClientProfileHref = (name: string): string => {
  const slug =
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "perfil";

  return `/cliente/perfil/${slug}`;
};

const CLIENT_ALLOWED_POST_CATEGORY = "Consulta";

const isClientCommunityDetailRoute = (pathname: string | null) =>
  typeof pathname === "string" && /^\/cliente\/comunidades\/[^/]+$/.test(pathname);

const canCreateClientPostOnRoute = (pathname: string | null) =>
  pathname === "/cliente" || isClientCommunityDetailRoute(pathname);

const getCurrentIso = () => new Date().toISOString();

const formatQuickTimestamp = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `Hoy ${hours}:${minutes}`;
};

export const useClientExperience = (): ClientExperienceContextValue => {
  const contextValue = useContext(ClientExperienceContext);

  if (!contextValue) {
    throw new Error("ClientTopbarControls debe renderizarse dentro de ClienteLayout.");
  }

  return contextValue;
};

export function ClientTopbarControls({ sectionLabel }: ClientTopbarControlsProps) {
  const router = useRouter();
  const { openPostModal } = useClientExperience();
  const pathname = usePathname();
  const canCreatePost = canCreateClientPostOnRoute(pathname);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    logout(router);
  };

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (
        profileMenuRef.current?.contains(targetNode) ||
        profileTriggerRef.current?.contains(targetNode)
      ) {
        return;
      }

      setIsProfileMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  return (
    <div className="relative flex items-center gap-2">
      {canCreatePost ? (
        <button
          type="button"
          onClick={openPostModal}
          className="hidden rounded-xl border border-cyan-100/15 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:border-cyan-300/45 hover:bg-cyan-300/18 sm:inline-flex"
        >
          Nueva publicacion
        </button>
      ) : null}

      <button
        ref={profileTriggerRef}
        type="button"
        onClick={() => setIsProfileMenuOpen((current) => !current)}
        className="flex min-h-[40px] min-w-[44px] items-center gap-2 rounded-2xl border border-cyan-100/20 bg-[linear-gradient(140deg,rgba(11,34,60,0.94),rgba(6,23,43,0.96))] px-2 py-1.5 pr-3 text-left shadow-lg shadow-slate-950/35"
        aria-haspopup="menu"
        aria-expanded={isProfileMenuOpen}
        aria-label="Abrir menu de perfil"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 to-blue-600 text-[11px] font-bold text-slate-950">
          {CLIENT_PROFILE.initials}
        </span>
        <span className="hidden text-xs font-semibold text-cyan-100 md:block">{sectionLabel}</span>
      </button>

      {isProfileMenuOpen ? (
        <div
          ref={profileMenuRef}
          className="absolute right-0 top-[calc(100%+0.55rem)] w-[290px] overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(10,33,57,0.96),rgba(4,18,34,0.98))] p-4 shadow-2xl shadow-slate-950/50"
          role="menu"
          aria-label="Menu de perfil"
        >
          <p className="tech-mono text-xs text-cyan-200/70">PERFIL CLIENTE</p>
          <p className="mt-2 text-base font-semibold text-cyan-50">{CLIENT_PROFILE.name}</p>
          <p className="mt-1 text-sm text-cyan-100/80">{CLIENT_PROFILE.email}</p>

          <div className="mt-3 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-3 text-xs text-cyan-100/80">
            <div className="flex items-center justify-between gap-3">
              <span>Ciudad</span>
              <strong className="text-cyan-50">{CLIENT_PROFILE.city}</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Estado</span>
              <strong className="text-cyan-50">{CLIENT_PROFILE.account}</strong>
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            <Link
              href={buildClientProfileHref(CLIENT_PROFILE.name)}
              onClick={() => setIsProfileMenuOpen(false)}
              className="auth-action block w-full"
            >
              Ver perfil
            </Link>
            {canCreatePost ? (
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  openPostModal();
                }}
                className="auth-action block w-full text-left"
              >
                Nueva publicacion
              </button>
            ) : null}
            <button type="button" onClick={handleLogout} className="auth-action block w-full text-left">
              Cerrar sesion
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ClientExperienceShell({ children }: ClientExperienceShellProps) {
  const pathname = usePathname();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [imageName, setImageName] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const modalTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsPostModalOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isPostModalOpen) {
      modalTextareaRef.current?.focus();
    }
  }, [isPostModalOpen]);

  const canPublish = useMemo(() => postText.trim().length >= 8 && !isPublishing, [postText, isPublishing]);

  const resetPostForm = () => {
    setPostText("");
    setImagePreview(undefined);
    setImageName("");
    setIsPublishing(false);
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setImagePreview(undefined);
      setImageName("");
      return;
    }

    setImageName(selectedFile.name);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        setImagePreview(fileReader.result);
      }
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const openPostModal = () => {
    if (!canCreateClientPostOnRoute(pathname)) {
      return;
    }

    setIsPostModalOpen(true);
  };

  const handlePublishPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedText = postText.trim();
    if (normalizedText.length < 8) {
      return;
    }

    setIsPublishing(true);

    const nextPost: CommunityFeedPost = {
      id: `client-post-${Date.now()}`,
      author: CLIENT_PROFILE.name,
      role: "Cliente",
      time: formatQuickTimestamp(),
      title: `${CLIENT_ALLOWED_POST_CATEGORY}: ${normalizedText.slice(0, 56)}${normalizedText.length > 56 ? "..." : ""}`,
      body: normalizedText,
      tag: CLIENT_ALLOWED_POST_CATEGORY,
      location: CLIENT_PROFILE.city,
      image: imagePreview,
      createdAt: getCurrentIso(),
    };

    upsertCommunityFeedPosts([nextPost]);

    resetPostForm();
    setIsPostModalOpen(false);
  };

  return (
    <ClientExperienceContext.Provider value={{ openPostModal }}>
      {children}

      <AnimatePresence>
        {isPostModalOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur"
            role="dialog"
            aria-modal="true"
            aria-label="Crear publicacion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setIsPostModalOpen(false);
              }
            }}
          >
            <motion.form
              onSubmit={handlePublishPost}
              className="chat-scrollbar max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-100/20 bg-[linear-gradient(175deg,rgba(9,30,53,0.98),rgba(5,18,35,0.98))] p-5 shadow-2xl shadow-slate-950/60 md:p-6"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 28,
                mass: 0.9,
              }}
            >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="tech-mono text-xs text-cyan-200/70">NUEVA PUBLICACION</p>
                <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Publicar consulta en la comunidad</h2>
                <p className="mt-2 text-sm text-cyan-100/75">
                  Los clientes solo pueden publicar consultas dentro de Comunidades.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100/80"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-100/15 bg-slate-950/30 px-3 py-2">
              <p className="text-xs text-cyan-100/65">Tipo de publicacion</p>
              <p className="mt-1 text-sm font-semibold text-cyan-50">Consulta</p>
            </div>

            <label className="mt-5 block text-sm font-semibold text-cyan-50" htmlFor="client-post-text">
              Que quieres compartir?
            </label>
            <textarea
              id="client-post-text"
              ref={modalTextareaRef}
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              placeholder="Ejemplo: Alguien recomienda una laptop ligera para programar y editar?"
              rows={5}
              className="auth-input mt-2 min-h-[120px] resize-y"
            />
            <p className="mt-2 text-xs text-cyan-100/65">Minimo 8 caracteres para publicar.</p>

            <label className="mt-5 block text-sm font-semibold text-cyan-50" htmlFor="client-post-image">
              Imagen
            </label>
            <div className="mt-2 rounded-2xl border border-cyan-100/15 bg-slate-950/30 p-3">
              <input
                id="client-post-image"
                type="file"
                accept="image/*"
                onChange={handleImageSelection}
                className="block w-full text-xs text-cyan-100/80 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-300/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50"
              />
              {imageName ? <p className="mt-2 text-xs text-cyan-100/70">Archivo: {imageName}</p> : null}
            </div>

            {imagePreview ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100/15">
                <img src={imagePreview} alt="Vista previa de publicacion" className="h-52 w-full object-cover" />
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  resetPostForm();
                  setIsPostModalOpen(false);
                }}
                className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!canPublish}
                className="tech-button tech-button-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPublishing ? "Publicando..." : "Publicar"}
              </button>
            </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ClientExperienceContext.Provider>
  );
}
