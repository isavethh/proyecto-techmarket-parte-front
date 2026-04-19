import { ReactNode } from "react";
import { motion } from "motion/react";

type PublicationMedia = {
  src: string;
  alt: string;
  imageClassName?: string;
  wrapperClassName?: string;
};

type PublicationCardProps = {
  header: ReactNode;
  content: ReactNode;
  media?: PublicationMedia;
  footer?: ReactNode;
  actions?: ReactNode;
  composer?: ReactNode;
  thread?: ReactNode;
  className?: string;
};

type PublicationAvatarProps = {
  label: string;
};

type PublicationActionButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  active?: boolean;
  accent?: "primary" | "neutral";
  className?: string;
  disabled?: boolean;
};

const combineClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(" ");

export function PublicationAvatar({ label }: PublicationAvatarProps) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function PublicationActionButton({
  children,
  onClick,
  type = "button",
  active = false,
  accent = "neutral",
  className,
  disabled = false,
}: PublicationActionButtonProps) {
  const toneClass =
    accent === "primary"
      ? active
        ? "border-cyan-200/45 bg-cyan-300/20 text-cyan-50"
        : "border-cyan-100/15 bg-cyan-300/12 text-cyan-100/90"
      : active
        ? "border-cyan-200/40 bg-cyan-400/16 text-cyan-50"
        : "border-cyan-100/12 bg-white/5 text-cyan-100/90";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -1.5, boxShadow: "0 14px 28px rgba(8, 145, 178, 0.18)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={combineClassNames(
        "group relative overflow-hidden rounded-xl border px-3 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
        toneClass,
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.28),transparent_70%)]" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export function PublicationCard({
  header,
  content,
  media,
  footer,
  actions,
  composer,
  thread,
  className,
}: PublicationCardProps) {
  return (
    <article
      className={combineClassNames(
        "rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(16,41,72,0.92),rgba(7,24,44,0.96))] p-4 shadow-xl shadow-slate-950/25",
        className,
      )}
    >
      {header}
      {content}

      {media ? (
        <div
          className={combineClassNames(
            "mt-4 overflow-hidden rounded-2xl border border-cyan-100/10",
            media.wrapperClassName,
          )}
        >
          <img
            src={media.src}
            alt={media.alt}
            className={combineClassNames("h-64 w-full object-cover", media.imageClassName)}
            loading="lazy"
          />
        </div>
      ) : null}

      {footer}
      {actions}
      {composer}
      {thread}
    </article>
  );
}
