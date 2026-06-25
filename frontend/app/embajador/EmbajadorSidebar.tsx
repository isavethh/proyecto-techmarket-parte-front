"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/lib/auth/authGuard";
import { profileDisplayData, type ApiProfile } from "./useAmbassadorApi";

export type EmbajadorSidebarSection =
  | "resumen"
  | "negocios"
  | "usuarios"
  | "embajadores"
  | "prospectos"
  | "onboarding"
  | "comisiones"
  | "guia";

type EmbajadorSidebarProps = {
  activeSection?: EmbajadorSidebarSection;
  onOpenReferralModal?: () => void;
  onLogout?: () => void;
  profile?: ApiProfile | null;
};

const getSidebarLinkClass = (isActive: boolean) =>
  isActive ? "auth-action active" : "auth-action";

export function EmbajadorTopbarControls({ profile }: { profile?: ApiProfile | null }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const display = profile ? profileDisplayData(profile) : null;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-[40px] min-w-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-cyan-100/20 bg-[linear-gradient(140deg,rgba(11,34,60,0.94),rgba(6,23,43,0.96))] px-2 py-1.5 pr-3 text-left shadow-lg shadow-slate-950/35 transition hover:border-cyan-300/45 hover:bg-[linear-gradient(140deg,rgba(15,42,73,0.96),rgba(8,29,53,0.98))] hover:shadow-cyan-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Abrir perfil de embajador"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 to-blue-600 text-[11px] font-bold text-slate-950">
          {display?.initials ?? "EM"}
        </span>
        <span className="hidden text-xs font-semibold text-cyan-100 md:block">
          {display?.fullName ?? "Embajador"}
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-[calc(100%+0.55rem)] w-[300px] overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(10,33,57,0.96),rgba(4,18,34,0.98))] p-4 shadow-2xl shadow-slate-950/50"
          role="menu"
          aria-label="Menu de embajador"
        >
          <p className="tech-mono text-xs text-cyan-200/70">PERFIL EMBAJADOR</p>
          <p className="mt-2 text-base font-semibold text-cyan-50">{display?.fullName ?? "—"}</p>
          <p className="mt-1 text-sm text-cyan-100/80">
            {profile?.estado === "ACTIVE" ? "Embajador verificado" : "Embajador"}
          </p>

          <div className="mt-3 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-3 text-xs text-cyan-100/80">
            <div className="flex items-center justify-between gap-3">
              <span>Nivel</span>
              <strong className="text-cyan-50">{profile?.nivel ?? "—"}</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Ciudad</span>
              <strong className="text-cyan-50">{profile?.ciudad ?? "—"}</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Código referido</span>
              <strong className="text-cyan-50">{profile?.codigoReferido ?? "—"}</strong>
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => logout(router)}
              className="auth-action block w-full text-left"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EmbajadorSidebar({
  activeSection = "resumen",
  onOpenReferralModal,
  onLogout,
  profile,
}: EmbajadorSidebarProps) {
  const display = profile ? profileDisplayData(profile) : null;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-scroll lg:pr-2 chat-scrollbar">
      <section className="tech-card">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
            {display?.initials ?? ".."}
          </div>
          <div>
            <p className="text-sm font-semibold text-cyan-50">{display?.fullName ?? "Cargando..."}</p>
            <p className="text-xs text-cyan-100/75">{profile?.estado === "ACTIVE" ? "Embajador verificado" : "Embajador"}</p>
            <p className="mt-1 inline-flex rounded-full border border-cyan-100/15 bg-cyan-300/12 px-2 py-0.5 text-[11px] font-semibold text-cyan-50">
              {profile?.nivel ?? "..."}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3 text-xs text-cyan-100/85">
          <div className="flex items-center justify-between gap-3">
            <span>Ciudad</span>
            <strong className="text-cyan-50">{profile?.ciudad ?? "—"}</strong>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Pais</span>
            <strong className="text-cyan-50">{profile?.pais ?? "—"}</strong>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Código referido</span>
            <strong className="text-cyan-50">{profile?.codigoReferido ?? "—"}</strong>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <p className="tech-mono text-[11px] text-cyan-200/70">[ PERFIL EMBAJADOR ]</p>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- PANEL ---</p>
          <Link href="/embajador/resumen" className={getSidebarLinkClass(activeSection === "resumen")}>
            Resumen
          </Link>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- RED ---</p>
          <Link href="/embajador/negocios-referidos" className={getSidebarLinkClass(activeSection === "negocios")}>
            Negocios referidos
          </Link>
          <Link href="/embajador/vision-usuarios" className={getSidebarLinkClass(activeSection === "usuarios")}>
            Vision de usuarios
          </Link>
          <Link href="/embajador/embajadores-referidos" className={getSidebarLinkClass(activeSection === "embajadores")}>
            Embajadores referidos
          </Link>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- CRECIMIENTO ---</p>
          <Link href="/embajador/prospectos" className={getSidebarLinkClass(activeSection === "prospectos")}>
            Prospectos
          </Link>
          <Link href="/embajador/onboarding" className={getSidebarLinkClass(activeSection === "onboarding")}>
            Onboarding
          </Link>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- MONETIZACION ---</p>
          <Link href="/embajador/comisiones" className={getSidebarLinkClass(activeSection === "comisiones")}>
            Comisiones
          </Link>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">[ BOTON ]</p>
          {onOpenReferralModal ? (
            <button type="button" onClick={onOpenReferralModal} className="auth-action active">
              Referir
            </button>
          ) : (
            <Link href="/embajador" className="auth-action active">
              Referir
            </Link>
          )}

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- SISTEMA ---</p>
          <Link href="/embajador/guia" className={getSidebarLinkClass(activeSection === "guia")}>
            Guia de uso
          </Link>
          <button type="button" onClick={onLogout} className="auth-action">
            Cerrar sesión
          </button>
        </div>
      </section>
    </aside>
  );
}
