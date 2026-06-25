"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/authGuard";
import { getUser } from "@/lib/auth/tokenStore";

type CompanyPageHeaderProps = {
  sectionLabel: string;
  brandHref?: string;
  middleSlot?: ReactNode;
  rightSlot?: ReactNode;
  sticky?: boolean;
  className?: string;
};

type CompanyTopbarControlsProps = {
  sectionLabel: string;
};

type CompanyPanelLink = {
  title: string;
  href: string;
};

type CompanyPanelCardProps = {
  links: CompanyPanelLink[];
  className?: string;
  initials?: string;
  panelTitle?: string;
  panelSubtitle?: string;
};

const combineClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(" ");

type CompanyProfileSummary = {
  name: string;
  email: string;
  city: string;
  account: string;
  initials: string;
};

const DEFAULT_COMPANY_PROFILE: CompanyProfileSummary = {
  name: "Mi empresa",
  email: "",
  city: "—",
  account: "Empresa",
  initials: "E",
};

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "E";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "E";
}

/** Perfil de empresa derivado de la sesión iniciada (no hardcodeado). */
function useCompanyProfile(): CompanyProfileSummary {
  const [profile, setProfile] = useState<CompanyProfileSummary>(DEFAULT_COMPANY_PROFILE);

  useEffect(() => {
    const user = getUser() as
      | { nombre?: string; email?: string; ciudad?: string; tipo?: string }
      | null;
    if (!user) return;

    const name = (user.nombre || DEFAULT_COMPANY_PROFILE.name).trim();
    setProfile({
      name,
      email: (user.email || "").trim(),
      city: (user.ciudad || "").trim() || "—",
      account:
        user.tipo === "empresa" || user.tipo === "empresa_tienda" ? "Empresa" : "Cuenta",
      initials: deriveInitials(name),
    });
  }, []);

  return profile;
}

function CompanyTopbarControls({ sectionLabel }: CompanyTopbarControlsProps) {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const companyProfile = useCompanyProfile();

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
      <Link
        href="/empresa/publicaciones"
        className="hidden rounded-xl border border-cyan-100/15 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:border-cyan-300/45 hover:bg-cyan-300/18 sm:inline-flex"
      >
        Gestionar publicaciones
      </Link>

      <button
        ref={profileTriggerRef}
        type="button"
        onClick={() => setIsProfileMenuOpen((current) => !current)}
        className="flex min-h-[40px] min-w-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-cyan-100/20 bg-[linear-gradient(140deg,rgba(11,34,60,0.94),rgba(6,23,43,0.96))] px-2 py-1.5 pr-3 text-left shadow-lg shadow-slate-950/35 transition hover:border-cyan-300/45 hover:bg-[linear-gradient(140deg,rgba(15,42,73,0.96),rgba(8,29,53,0.98))] hover:shadow-cyan-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35"
        aria-haspopup="menu"
        aria-expanded={isProfileMenuOpen}
        aria-label="Abrir perfil de empresa"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 to-blue-600 text-[11px] font-bold text-slate-950">
          {companyProfile.initials}
        </span>
        <span className="hidden text-xs font-semibold text-cyan-100 md:block">{sectionLabel}</span>
      </button>

      {isProfileMenuOpen ? (
        <div
          ref={profileMenuRef}
          className="absolute right-0 top-[calc(100%+0.55rem)] w-[290px] overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(10,33,57,0.96),rgba(4,18,34,0.98))] p-4 shadow-2xl shadow-slate-950/50"
          role="menu"
          aria-label="Menu de empresa"
        >
          <p className="tech-mono text-xs text-cyan-200/70">PERFIL EMPRESA</p>
          <p className="mt-2 text-base font-semibold text-cyan-50">{companyProfile.name}</p>
          <p className="mt-1 text-sm text-cyan-100/80">{companyProfile.email}</p>

          <div className="mt-3 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-3 text-xs text-cyan-100/80">
            <div className="flex items-center justify-between gap-3">
              <span>Ciudad</span>
              <strong className="text-cyan-50">{companyProfile.city}</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Estado</span>
              <strong className="text-cyan-50">{companyProfile.account}</strong>
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            <Link
              href="/empresa/perfil"
              onClick={() => setIsProfileMenuOpen(false)}
              className="auth-action block w-full"
            >
              Mi perfil
            </Link>
            <Link
              href="/empresa/publicaciones"
              onClick={() => setIsProfileMenuOpen(false)}
              className="auth-action block w-full"
            >
              Publicaciones
            </Link>
            <Link
              href="/empresa/resenas"
              onClick={() => setIsProfileMenuOpen(false)}
              className="auth-action block w-full"
            >
              Reseñas
            </Link>
            <Link
              href="/empresa/ia"
              onClick={() => setIsProfileMenuOpen(false)}
              className="auth-action block w-full"
            >
              Consultor IA
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="auth-action block w-full text-left"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function CompanyPageHeader({
  sectionLabel,
  brandHref = "/empresa",
  middleSlot,
  rightSlot,
  sticky = true,
  className,
}: CompanyPageHeaderProps) {
  return (
    <header
      className={combineClassNames("tech-top-nav z-30", sticky && "sticky top-0", className)}
    >
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href={brandHref} className="font-semibold text-cyan-100/90">
          TechMarket
        </Link>

        {middleSlot ? <div className="hidden max-w-xl flex-1 md:block">{middleSlot}</div> : null}

        <div className="flex items-center gap-2">
          {rightSlot}
          <CompanyTopbarControls sectionLabel={sectionLabel} />
        </div>
      </div>
    </header>
  );
}

export function CompanyPanelCard({
  links,
  className,
  initials = "TC",
  panelTitle = "Mi panel",
  panelSubtitle = "TechMarket",
}: CompanyPanelCardProps) {
  return (
    <section className={combineClassNames("tech-card", className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-cyan-50">{panelTitle}</p>
          <p className="text-xs text-cyan-100/75">{panelSubtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {links.map((link) => (
          <Link key={`${link.href}-${link.title}`} href={link.href} className="auth-action">
            {link.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
